import secrets
from datetime import datetime, timezone
from typing import Literal, Optional

from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Vend88 Agent Portal - Local Test API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Role → permissions mapping ───────────────────────────────────
ROLE_PERMISSIONS: dict[str, list[str]] = {
    "agent": [
        "view_own_registrations",
        "view_own_customers",
        "view_own_businesses",
        "submit_registrations",
        "update_own_profile",
    ],
    "admin": [
        "view_registrations",
        "manage_registrations",
        "view_customers",
        "manage_customers",
        "view_businesses",
        "manage_businesses",
        "manage_forms",
    ],
    "super_admin": [
        "view_registrations",
        "manage_registrations",
        "view_customers",
        "manage_customers",
        "view_businesses",
        "manage_businesses",
        "manage_admins",
        "manage_system_settings",
        "view_audit_logs",
        "manage_forms",
    ],
}

# ── In-memory store ──────────────────────────────────────────────
USERS: dict[str, dict] = {
    "agent@vend88.com": {
        "_id": "user_003",
        "password": "agent123",
        "role": "agent",
        "first_name": "Local",
        "last_name": "Agent",
        "status": "active",
        "permissions": [
            "view_own_registrations",
            "view_own_customers",
            "view_own_businesses",
            "submit_registrations",
            "update_own_profile",
        ],
    },
    "admin@vend88.com": {
        "_id": "user_002",
        "password": "admin123",
        "role": "admin",
        "first_name": "Local",
        "last_name": "Admin",
        "status": "active",
        "permissions": [
            "manage_businesses",
            "manage_customers",
            "manage_agents",
            "manage_registration_forms",
            "manage_form_templates",
        ],
    },
    "superadmin@vend88.com": {
        "_id": "user_001",
        "password": "super123",
        "role": "super_admin",
        "first_name": "Local",
        "last_name": "Super Admin",
        "status": "active",
        "permissions": [
            "manage_businesses",
            "manage_customers",
            "manage_agents",
            "manage_registration_forms",
            "manage_form_templates",
            "manage_admins",
            "view_reports",
            "manage_system_settings",
        ],
    },
}

# token → email
TOKENS: dict[str, str] = {}

# Audit log (all admin and system operations)
AUDIT_LOG: list[dict] = []

# Registration links (tracking generated links)
REGISTRATION_LINKS: dict[str, dict] = {}


# ── Schemas ──────────────────────────────────────────────────────
class PortalLoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[Literal["agent", "admin", "super_admin"]] = None


class ProfileRequest(BaseModel):
    token: str


class TokenRequest(BaseModel):
    token: str


class AdminDetailRequest(BaseModel):
    token: str
    user_id: str


class AdminCreateRequest(BaseModel):
    token: str
    email: str
    first_name: str
    last_name: str
    password: str
    role: Optional[Literal["agent", "admin", "super_admin"]] = "admin"
    phone_number: Optional[str] = ""
    username: Optional[str] = ""


class AdminUpdateRequest(BaseModel):
    token: str
    user_id: str
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    username: Optional[str] = None
    role: Optional[Literal["agent", "admin", "super_admin"]] = None
    status: Optional[Literal["active", "suspended"]] = None


class AdminDeleteRequest(BaseModel):
    token: str
    user_id: str


class RegistrationGenerateRequest(BaseModel):
    admin_email: str
    form_fields: Optional[list] = None
    template_id: Optional[str] = None


class AdminPermissionsRequest(BaseModel):
    token: str
    user_id: str
    permissions: list[str]


# ── Routes ───────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "Local test API is running"}


portal_router = APIRouter(prefix="/portal", tags=["portal"])


@portal_router.post("/auth/login")
def portal_login(body: PortalLoginRequest):
    user = USERS.get(body.email)
    if not user or user["password"] != body.password:
        raise HTTPException(
            status_code=401,
            detail={
                "status_code": 401,
                "status_msg": "unauthorized",
                "message": "Invalid credentials",
            },
        )

    # Block suspended accounts
    if user.get("status") == "suspended":
        raise HTTPException(
            status_code=403,
            detail={
                "status_code": 403,
                "status_msg": "suspended",
                "message": "Your account has been suspended. Contact administrator.",
            },
        )

    # If a role was requested, verify the user has that role (or higher).
    # super_admin can access admin pages; admin can access agent pages.
    ROLE_HIERARCHY = {"super_admin": 2, "admin": 1, "agent": 0}
    if body.role:
        user_level = ROLE_HIERARCHY.get(user["role"], 0)
        required_level = ROLE_HIERARCHY.get(body.role, 0)
        if user_level < required_level:
            raise HTTPException(
                status_code=401,
                detail={
                    "status_code": 401,
                    "status_msg": "unauthorized",
                    "message": f"{body.role.replace('_', ' ').title()} role not assigned to this user. Contact administrator.",
                    "user_email": body.email,
                },
            )

    token = secrets.token_hex(32)
    TOKENS[token] = body.email

    # Update last login timestamp
    user["last_login"] = datetime.now(timezone.utc).isoformat()

    role = user["role"]
    return {
        "status_code": 200,
        "status_msg": "success",
        "token": token,
        "user": {
            "_id": user["_id"],
            "email": body.email,
            "role": role,
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "status": user["status"],
        },
        "session_timeout": 3600,
        "permissions": ROLE_PERMISSIONS.get(role, []),
    }


@portal_router.post("/admin/profile")
def admin_profile(body: ProfileRequest):
    email = TOKENS.get(body.token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = USERS[email]
    return {
        "status_code": 200,
        "status_msg": "success",
        "email": email,
        "role": user["role"],
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "permissions": user.get("permissions", []),
        "created_at": "2024-01-01T00:00:00Z",
    }


# ── Helper ───────────────────────────────────────────────────────
def _require_token(token: str) -> str:
    """Validate token and return the associated email."""
    email = TOKENS.get(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    return email


def _require_admin_access(token: str) -> str:
    """Validate token and ensure user is super_admin."""
    email = _require_token(token)
    user = USERS[email]
    if user["role"] != "super_admin":
        raise HTTPException(
            status_code=403,
            detail={"status_code": 403, "status_msg": "Super admin access required"},
        )
    return email


def _user_by_id(user_id: str) -> tuple[str, dict]:
    """Find a user by _id. Returns (email, user_dict) or raises 404."""
    for email, u in USERS.items():
        if u["_id"] == user_id:
            return email, u
    raise HTTPException(
        status_code=404,
        detail={"status_code": 404, "status_msg": "User not found"},
    )


def _log_audit(action: str, target_email: str, actor_email: str, details: str = "") -> None:
    """Log an audit event for admin operations."""
    AUDIT_LOG.append({
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "action": action,
        "target_email": target_email,
        "actor_email": actor_email,
        "details": details,
    })


# ── Admin management CRUD ────────────────────────────────────────
@portal_router.post("/admin/list")
def admin_list(body: TokenRequest):
    _require_admin_access(body.token)
    
    # Return user IDs (matching the real backend format)
    user_ids = [
        user["_id"]
        for email, user in USERS.items()
        if user["role"] in ("admin", "super_admin")
    ]
    
    return {
        "status_code": 200,
        "status_msg": "success",
        "user_IDs": user_ids,
    }


@portal_router.post("/admin/detail")
def admin_detail(body: AdminDetailRequest):
    actor_email = _require_admin_access(body.token)
    email, user = _user_by_id(body.user_id)
    # Return 404 if user is an agent (admin management only handles admins)
    if user["role"] == "agent":
        raise HTTPException(
            status_code=404,
            detail={"status_code": 404, "status_msg": "User not found"},
        )
    return {
        "status_code": 200,
        "status_msg": "success",
        "user_id": user["_id"],
        "email": email,
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "role": user["role"],
        "status": user.get("status", "active"),
        "created_at": user.get("created_at", "2024-01-01T00:00:00Z"),
        "updated_at": user.get("updated_at"),
        "last_login": user.get("last_login"),
        "permissions": user.get("permissions", []),
    }


@portal_router.post("/admin/create")
def admin_create(body: AdminCreateRequest):
    actor_email = _require_admin_access(body.token)

    if body.email in USERS:
        raise HTTPException(
            status_code=400,
            detail={"status_code": 400, "status_msg": "Email already exists"},
        )

    now = datetime.now(timezone.utc).isoformat()
    new_id = f"user_{secrets.token_hex(4)}"
    USERS[body.email] = {
        "_id": new_id,
        "password": body.password,
        "role": body.role or "admin",
        "first_name": body.first_name,
        "last_name": body.last_name,
        "status": "active",
        "created_at": now,
    }
    _log_audit("CREATE", body.email, actor_email, f"Created {body.role or 'admin'}")
    return {
        "status_code": 200,
        "status_msg": "User created successfully",
        "user_id": new_id,
        "email": body.email,
        "first_name": body.first_name,
        "last_name": body.last_name,
        "username": body.username or "",
        "phone_number": body.phone_number or "",
        "created_at": now,
    }


@portal_router.post("/admin/update")
def admin_update(body: AdminUpdateRequest):
    actor_email = _require_admin_access(body.token)
    email, user = _user_by_id(body.user_id)
    # Return 404 if user is an agent (admin management only handles admins)
    if user["role"] == "agent":
        raise HTTPException(
            status_code=404,
            detail={"status_code": 404, "status_msg": "User not found"},
        )

    now = datetime.now(timezone.utc).isoformat()
    changes = []
    if body.first_name is not None:
        user["first_name"] = body.first_name
        changes.append(f"first_name={body.first_name}")
    if body.last_name is not None:
        user["last_name"] = body.last_name
        changes.append(f"last_name={body.last_name}")
    if body.role is not None:
        user["role"] = body.role
        changes.append(f"role={body.role}")
    if body.status is not None:
        user["status"] = body.status
        changes.append(f"status={body.status}")
    if body.email is not None and body.email != email:
        USERS[body.email] = USERS.pop(email)
        email = body.email
        changes.append(f"email={body.email}")
    user["updated_at"] = now
    
    _log_audit("UPDATE", email, actor_email, ", ".join(changes) if changes else "no changes")

    return {
        "status_code": 200,
        "status_msg": "User updated successfully",
        "user_id": user["_id"],
        "email": email,
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "username": body.username or "",
        "phone_number": body.phone_number or "",
        "updated_at": now,
    }


@portal_router.post("/admin/delete")
def admin_delete(body: AdminDeleteRequest):
    actor_email = _require_admin_access(body.token)
    email, user = _user_by_id(body.user_id)
    # Return 404 if user is an agent (admin management only handles admins)
    if user["role"] == "agent":
        raise HTTPException(
            status_code=404,
            detail={"status_code": 404, "status_msg": "User not found"},
        )
    del USERS[email]
    # Also remove any tokens for this user
    expired = [t for t, e in TOKENS.items() if e == email]
    for t in expired:
        del TOKENS[t]
    _log_audit("DELETE", email, actor_email, f"Deleted {user['role']}")
    return {
        "status_code": 200,
        "status_msg": "User deleted successfully",
        "user_id": body.user_id,
    }
    expired = [t for t, e in TOKENS.items() if e == email]
    for t in expired:
        del TOKENS[t]
    return {
        "status_code": 200,
        "status_msg": "User deleted successfully",
        "user_id": body.user_id,
    }


@portal_router.get("/admin/audit-log")
def get_audit_log(token: str):
    _require_admin_access(token)
    return {
        "status_code": 200,
        "status_msg": "success",
        "audit_log": AUDIT_LOG[-100:],  # Return last 100 entries
        "total": len(AUDIT_LOG),
    }


@portal_router.get("/admin/audit-log/{user_id}")
def get_user_audit_log(user_id: str, token: str):
    _require_admin_access(token)
    # Get email from user_id
    email = None
    for e, user in USERS.items():
        if user["_id"] == user_id:
            email = e
            break
    
    if not email:
        raise HTTPException(
            status_code=404,
            detail={"status_code": 404, "status_msg": "User not found"},
        )
    
    # Filter audit logs for this user (where they are target or actor)
    user_logs = [
        log for log in AUDIT_LOG 
        if log["target_email"] == email or log["actor_email"] == email
    ]
    
    return {
        "status_code": 200,
        "status_msg": "success",
        "user_id": user_id,
        "email": email,
        "audit_log": user_logs[-50:],  # Return last 50 entries for this user
        "total": len(user_logs),
    }


@portal_router.post("/admin/permissions")
def update_admin_permissions(body: AdminPermissionsRequest):
    """Update admin permissions."""
    actor_email = _require_admin_access(body.token)
    email, user = _user_by_id(body.user_id)
    
    # Only super_admin can be modified, and only super_admin can modify others
    if user["role"] == "agent":
        raise HTTPException(
            status_code=404,
            detail={"status_code": 404, "status_msg": "User not found"},
        )
    
    # Update permissions
    old_perms = user.get("permissions", [])
    user["permissions"] = body.permissions
    user["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    # Log the change
    added = set(body.permissions) - set(old_perms)
    removed = set(old_perms) - set(body.permissions)
    details = []
    if added:
        details.append(f"Added: {', '.join(added)}")
    if removed:
        details.append(f"Removed: {', '.join(removed)}")
    
    _log_audit("PERMISSIONS_UPDATED", email, actor_email, "; ".join(details) if details else "no changes")
    
    return {
        "status_code": 200,
        "status_msg": "Permissions updated successfully",
        "user_id": body.user_id,
        "email": email,
        "permissions": body.permissions,
    }


# ── Registration management ──────────────────────────────────────
@app.post("/registration/generate")
def registration_generate(body: RegistrationGenerateRequest):
    """Generate a new registration link and log it to audit trail."""
    # Generate unique IDs for this registration
    form_id = f"V88-REG-{secrets.token_hex(4).upper()}"
    token = secrets.token_hex(16)
    
    # Store registration link info
    registration_link = {
        "form_id": form_id,
        "token": token,
        "admin_email": body.admin_email,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "template_id": body.template_id,
        "fields_count": len(body.form_fields) if body.form_fields else 0,
    }
    REGISTRATION_LINKS[token] = registration_link
    
    # Log this as an audit entry
    field_info = f"{len(body.form_fields)} fields" if body.form_fields else "default fields"
    _log_audit(
        "REGISTRATION_LINK_GENERATED",
        body.admin_email,  # Target is the admin who generated it
        body.admin_email,  # Actor is the admin who did it
        f"Generated registration link with {field_info}"
    )
    
    # Return registration link details
    registration_link_url = f"http://vend88.local/register?token={token}"
    
    return {
        "status_code": 200,
        "success": True,
        "data": {
            "form_id": form_id,
            "token": token,
            "link": registration_link_url,
            "expires_at": (datetime.now(timezone.utc).replace(day=datetime.now(timezone.utc).day + 7)).isoformat(),
        },
        "message": "Registration link generated successfully",
    }


app.include_router(portal_router)


if __name__ == "__main__":
    import os
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "127.0.0.1")

    # In production (Render), don't use reload
    if os.environ.get("RENDER"):
        uvicorn.run("main:app", host=host, port=port)
    else:
        uvicorn.run("main:app", host=host, port=port, reload=True,
                     reload_dirs=[os.path.dirname(os.path.abspath(__file__))])

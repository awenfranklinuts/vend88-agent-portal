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

# Registrations (submitted registration forms)
REGISTRATIONS: dict[str, dict] = {}


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


# ── Registration Management Schemas ──────────────────────────────
class RegistrationSubmitRequest(BaseModel):
    token: str  # Registration token from generated link
    contact_email: str
    contact_name: str
    contact_phone: Optional[str] = None
    messaging_app_type: Optional[str] = None
    messaging_app_id: Optional[str] = None
    quote_number: Optional[str] = None
    business_name: str
    abn: Optional[str] = None
    registered_address: Optional[str] = None
    registered_suburb: Optional[str] = None
    registered_postcode: Optional[str] = None
    registered_state: Optional[str] = None
    registered_country: Optional[str] = None
    eftpos_integration: Optional[str] = None
    alipay_option: Optional[str] = None
    alipay_other: Optional[str] = None
    ready_by: Optional[str] = None
    heard_about: Optional[str] = None
    heard_other: Optional[str] = None
    menu_files: Optional[list] = None
    menu_send_later: Optional[bool] = False
    notes: Optional[str] = None
    form_fields: Optional[list] = None


class RegistrationRejectRequest(BaseModel):
    token: str
    reason: Optional[str] = None


class RegistrationRevokeRequest(BaseModel):
    token: str
    reason: Optional[str] = None


class RegistrationApproveRequest(BaseModel):
    token: str
    approval_notes: Optional[str] = None


class LinkCustomerRequest(BaseModel):
    customer_id: Optional[str] = None
    create_new: Optional[bool] = False
    customer_data: Optional[dict] = None


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


@app.get("/registration/list")
def registration_list(token: str):
    """List all registration forms (admin only)."""
    email = _require_token(token)
    user = USERS.get(email)
    if not user or user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    registrations_list = list(REGISTRATIONS.values())
    
    return {
        "status_code": 200,
        "success": True,
        "data": registrations_list,
        "total": len(registrations_list),
    }


@app.get("/registration/validate-token/{token}")
def validate_registration_token(token: str):
    """Validate a registration token without authentication (public endpoint)."""
    if token not in REGISTRATION_LINKS:
        raise HTTPException(
            status_code=404,
            detail={"status_code": 404, "message": "Invalid or expired token"},
        )
    
    link_info = REGISTRATION_LINKS[token]
    
    return {
        "status_code": 200,
        "success": True,
        "valid": True,
        "form_id": link_info["form_id"],
        "template_id": link_info.get("template_id"),
        "expires_at": link_info.get("expires_at"),
    }


@app.post("/registration/submit")
def registration_submit(body: RegistrationSubmitRequest):
    """Submit a registration form (public endpoint - requires token)."""
    if body.token not in REGISTRATION_LINKS:
        raise HTTPException(
            status_code=401,
            detail={"status_code": 401, "message": "Invalid or expired token"},
        )
    
    link_info = REGISTRATION_LINKS[body.token]
    
    # Create registration record
    registration_id = f"REG-{secrets.token_hex(4).upper()}"
    form_id = link_info["form_id"]
    
    registration = {
        "id": registration_id,
        "form_id": form_id,
        "status": "submitted",
        "contact_email": body.contact_email,
        "contact_name": body.contact_name,
        "contact_phone": body.contact_phone,
        "messaging_app_type": body.messaging_app_type,
        "messaging_app_id": body.messaging_app_id,
        "quote_number": body.quote_number,
        "business_name": body.business_name,
        "abn": body.abn,
        "registered_address": body.registered_address,
        "registered_suburb": body.registered_suburb,
        "registered_postcode": body.registered_postcode,
        "registered_state": body.registered_state,
        "registered_country": body.registered_country,
        "eftpos_integration": body.eftpos_integration,
        "alipay_option": body.alipay_option,
        "alipay_other": body.alipay_other,
        "ready_by": body.ready_by,
        "heard_about": body.heard_about,
        "heard_other": body.heard_other,
        "menu_files": body.menu_files,
        "menu_send_later": body.menu_send_later,
        "notes": body.notes,
        "generated_by": link_info["admin_email"],
        "generated_at": link_info["created_at"],
        "submitted_at": datetime.now(timezone.utc).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    
    REGISTRATIONS[registration_id] = registration
    
    # Mark token as used
    link_info["used"] = True
    link_info["used_at"] = datetime.now(timezone.utc).isoformat()
    
    return {
        "status_code": 200,
        "success": True,
        "message": "Registration submitted successfully",
        "data": {
            "registration_id": registration_id,
            "form_id": form_id,
            "status": "submitted",
        },
    }


@app.get("/registration/{registration_id}")
def get_registration(registration_id: str, token: str):
    """Get registration details (admin only)."""
    email = _require_token(token)
    user = USERS.get(email)
    if not user or user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if registration_id not in REGISTRATIONS:
        raise HTTPException(
            status_code=404,
            detail={"status_code": 404, "message": "Registration not found"},
        )
    
    registration = REGISTRATIONS[registration_id]
    
    return {
        "status_code": 200,
        "success": True,
        "data": registration,
    }


@app.post("/registration/{registration_id}")
def update_registration(registration_id: str, body: dict, token: str):
    """Update registration details (admin only)."""
    email = _require_token(token)
    user = USERS.get(email)
    if not user or user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if registration_id not in REGISTRATIONS:
        raise HTTPException(
            status_code=404,
            detail={"status_code": 404, "message": "Registration not found"},
        )
    
    registration = REGISTRATIONS[registration_id]
    
    # Update only provided fields
    for key, value in body.items():
        if key not in ["id", "created_at", "submitted_at", "status"]:
            registration[key] = value
    
    registration["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    return {
        "status_code": 200,
        "success": True,
        "message": "Registration updated successfully",
        "data": registration,
    }


@app.put("/registration/{registration_id}/link-customer")
def link_customer(registration_id: str, body: LinkCustomerRequest, token: str):
    """Link or create a customer for this registration (admin only)."""
    email = _require_token(token)
    user = USERS.get(email)
    if not user or user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if registration_id not in REGISTRATIONS:
        raise HTTPException(
            status_code=404,
            detail={"status_code": 404, "message": "Registration not found"},
        )
    
    registration = REGISTRATIONS[registration_id]
    
    if body.customer_id:
        registration["linked_customer_id"] = body.customer_id
    elif body.create_new and body.customer_data:
        # Create new customer (simplified)
        customer_id = f"CUST-{secrets.token_hex(4).upper()}"
        registration["linked_customer_id"] = customer_id
    
    registration["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    return {
        "status_code": 200,
        "success": True,
        "message": "Customer linked successfully",
        "data": registration,
    }


@app.post("/registration/approve/{registration_id}")
def approve_registration(registration_id: str, body: RegistrationApproveRequest):
    """Approve a submitted registration (admin only)."""
    email = _require_token(body.token)
    user = USERS.get(email)
    if not user or user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if registration_id not in REGISTRATIONS:
        raise HTTPException(
            status_code=404,
            detail={"status_code": 404, "message": "Registration not found"},
        )
    
    registration = REGISTRATIONS[registration_id]
    registration["status"] = "approved"
    registration["approved_at"] = datetime.now(timezone.utc).isoformat()
    registration["approved_by"] = email
    registration["approval_notes"] = body.approval_notes
    registration["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    _log_audit(
        "REGISTRATION_APPROVED",
        registration["contact_email"],
        email,
        f"Approved registration {registration_id}",
    )
    
    return {
        "status_code": 200,
        "success": True,
        "message": "Registration approved successfully",
        "data": registration,
    }


@app.post("/registration/reject/{registration_id}")
def reject_registration(registration_id: str, body: RegistrationRejectRequest):
    """Reject a submitted registration (admin only)."""
    email = _require_token(body.token)
    user = USERS.get(email)
    if not user or user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if registration_id not in REGISTRATIONS:
        raise HTTPException(
            status_code=404,
            detail={"status_code": 404, "message": "Registration not found"},
        )
    
    registration = REGISTRATIONS[registration_id]
    registration["status"] = "rejected"
    registration["rejected_at"] = datetime.now(timezone.utc).isoformat()
    registration["rejected_by"] = email
    registration["rejection_reason"] = body.reason
    registration["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    _log_audit(
        "REGISTRATION_REJECTED",
        registration["contact_email"],
        email,
        f"Rejected registration {registration_id}: {body.reason}",
    )
    
    return {
        "status_code": 200,
        "success": True,
        "message": "Registration rejected successfully",
        "data": registration,
    }


@app.post("/registration/revoke/{registration_id}")
def revoke_registration(registration_id: str, body: RegistrationRevokeRequest):
    """Revoke a pending registration link (admin only)."""
    email = _require_token(body.token)
    user = USERS.get(email)
    if not user or user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if registration_id not in REGISTRATIONS:
        raise HTTPException(
            status_code=404,
            detail={"status_code": 404, "message": "Registration not found"},
        )
    
    registration = REGISTRATIONS[registration_id]
    registration["status"] = "cancelled"
    registration["cancelled_at"] = datetime.now(timezone.utc).isoformat()
    registration["cancelled_by"] = email
    registration["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    _log_audit(
        "REGISTRATION_REVOKED",
        registration.get("contact_email", "pending"),
        email,
        f"Revoked registration link {registration_id}",
    )
    
    return {
        "status_code": 200,
        "success": True,
        "message": "Registration link revoked successfully",
        "data": registration,
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

import secrets
import string
from datetime import datetime, timedelta, timezone
from typing import Any, Literal, Optional
from zoneinfo import ZoneInfo

from fastapi import APIRouter, FastAPI, Header, HTTPException, Request
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

FORM_BASE_URL = "https://form.vend88.com/register"
FORM_TIMEZONE = ZoneInfo("Australia/Sydney")
TOKEN_ALPHABET = string.ascii_letters + string.digits

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

# Customers (used by registration approval flow)
CUSTOMERS: dict[str, dict] = {
    "cust_001": {
        "_id": "cust_001",
        "name": "John Smith",
        "email": "john.smith@coffeeshop.com",
        "phone": "+61412345678",
        "messagingAppType": "whatsapp",
        "messagingAppId": "+61412345678",
        "registration_id": "V88-REG-001",
        "created_at": "2024-01-15T10:30:00Z",
    },
    "cust_002": {
        "_id": "cust_002",
        "name": "Jane Doe",
        "email": "jane.doe@restaurant.com",
        "phone": "+61498765432",
        "messagingAppType": "wechat",
        "messagingAppId": "janedoe_wechat",
        "registration_id": "V88-REG-002",
        "created_at": "2024-02-20T14:15:00Z",
    },
    "cust_003": {
        "_id": "cust_003",
        "name": "Michael Chen",
        "email": "michael.chen@bakery.com",
        "phone": "+61455123789",
        "created_at": "2024-03-10T09:00:00Z",
    },
}


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
    token: Optional[str] = None
    reason: Optional[str] = None


class RegistrationRevokeRequest(BaseModel):
    token: Optional[str] = None
    reason: Optional[str] = None


class RegistrationApproveRequest(BaseModel):
    token: Optional[str] = None
    approval_notes: Optional[str] = None


class LinkCustomerRequest(BaseModel):
    token: Optional[str] = None
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


def _extract_bearer_token(authorization: Optional[str]) -> Optional[str]:
    if not authorization:
        return None
    scheme, _, value = authorization.partition(" ")
    if scheme.lower() != "bearer" or not value:
        return None
    return value.strip()


def _resolve_email(token: Optional[str] = None, authorization: Optional[str] = None) -> str:
    resolved_token = token or _extract_bearer_token(authorization)
    if not resolved_token:
        raise HTTPException(status_code=401, detail="Invalid token")
    return _require_token(resolved_token)


def _require_registration_access(
    token: Optional[str] = None, authorization: Optional[str] = None
) -> str:
    email = _resolve_email(token=token, authorization=authorization)
    user = USERS[email]
    if user["role"] not in {"admin", "super_admin"}:
        raise HTTPException(status_code=403, detail="Admin access required")
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


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _format_datetime(value: datetime) -> str:
    return value.strftime("%Y-%m-%d %H:%M:%S %z")


def _now_formatted(tz: Any) -> str:
    return _format_datetime(datetime.now(tz))


def _generate_registration_token(length: int = 32) -> str:
    return "".join(secrets.choice(TOKEN_ALPHABET) for _ in range(length))


def _build_link_url(token: str) -> str:
    return f"{FORM_BASE_URL}?token={token}"


def _find_link_by_identifier(identifier: str) -> Optional[dict]:
    if identifier in REGISTRATION_LINKS:
        return REGISTRATION_LINKS[identifier]
    for link in REGISTRATION_LINKS.values():
        if link.get("form_id") == identifier:
            return link
    return None


def _find_registration_by_identifier(identifier: str) -> Optional[dict]:
    if identifier in REGISTRATIONS:
        return REGISTRATIONS[identifier]
    for registration in REGISTRATIONS.values():
        if registration.get("form_id") == identifier or registration.get("id") == identifier:
            return registration
    return None


def _serialize_link(link: dict) -> dict[str, Any]:
    return {
        "id": link.get("id"),
        "form_id": link["form_id"],
        "token": link["token"],
        "status": "cancelled" if link.get("revoked") else "pending",
        "generated_by": link.get("generated_by") or link["admin_email"],
        "generated_at": link.get("generated_at") or link["created_at"],
        "created_at": link["created_at"],
        "expires_at": link.get("expires_at"),
        "template_id": link.get("template_id"),
        "form_fields": link.get("form_fields") or [],
        "fields_count": link.get("fields_count", 0),
        "link": _build_link_url(link["token"]),
        "cancelled_at": link.get("revoked_at"),
        "cancelled_by": link.get("revoked_by"),
        "updated_at": link.get("updated_at"),
    }


def _serialize_registration(registration: dict) -> dict[str, Any]:
    payload = dict(registration)
    payload.setdefault("id", registration.get("id") or registration.get("form_id"))
    payload.setdefault("form_id", registration.get("form_id") or registration.get("id"))
    payload.setdefault("status", "pending")
    return payload


def _list_registration_records(form_id: Optional[str] = None) -> list[dict[str, Any]]:
    submitted: list[dict[str, Any]] = []
    submitted_form_ids: set[str] = set()
    for registration in REGISTRATIONS.values():
        if form_id and registration.get("form_id") != form_id and registration.get("id") != form_id:
            continue
        serialized = _serialize_registration(registration)
        submitted.append(serialized)
        submitted_form_ids.add(serialized["form_id"])

    pending: list[dict[str, Any]] = []
    for link in REGISTRATION_LINKS.values():
        link_form_id = link["form_id"]
        if form_id and link_form_id != form_id:
            continue
        if link_form_id in submitted_form_ids:
            continue
        if link.get("used"):
            continue
        pending.append(_serialize_link(link))

    combined = pending + submitted
    combined.sort(
        key=lambda item: item.get("submitted_at") or item.get("generated_at") or item.get("created_at") or "",
        reverse=True,
    )
    return combined


def _registration_not_found() -> HTTPException:
    return HTTPException(
        status_code=404,
        detail={"status_code": 404, "message": "Registration not found"},
    )


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
@app.post("/registration/generate", tags=["Registration"])
def registration_generate(body: RegistrationGenerateRequest):
    """Generate a new registration link using the current official API shape."""
    form_id = f"V88-REG-{secrets.randbelow(900) + 100:03d}"
    token = _generate_registration_token()
    created_at = _now_iso()
    generated_at = _now_formatted(FORM_TIMEZONE)
    expires_at = _format_datetime(datetime.now(timezone.utc) + timedelta(days=30))

    registration_link = {
        "id": None,
        "form_id": form_id,
        "token": token,
        "admin_email": body.admin_email,
        "generated_by": body.admin_email,
        "generated_at": generated_at,
        "created_at": created_at,
        "updated_at": created_at,
        "expires_at": expires_at,
        "template_id": body.template_id,
        "form_fields": body.form_fields or [],
        "fields_count": len(body.form_fields) if body.form_fields else 0,
        "status": "pending",
        "used": False,
        "revoked": False,
    }
    REGISTRATION_LINKS[token] = registration_link

    field_info = f"{len(body.form_fields)} fields" if body.form_fields else "default fields"
    _log_audit(
        "REGISTRATION_LINK_GENERATED",
        body.admin_email,
        body.admin_email,
        f"Generated registration link {form_id} with {field_info}",
    )

    return {
        "status_code": 200,
        "success": True,
        "message": "Registration token generated successfully",
        "data": {
            "id": None,
            "form_id": form_id,
            "token": token,
            "link": _build_link_url(token),
            "generated_by": body.admin_email,
            "generated_at": generated_at,
            "expires_at": expires_at,
            "status": "pending",
        },
    }


@app.get("/registration/list", tags=["Registration"])
def registration_list(
    token: Optional[str] = None,
    form_id: Optional[str] = None,
    authorization: Optional[str] = Header(None),
):
    """List all registration forms (admin only)."""
    _require_registration_access(token=token, authorization=authorization)
    registrations_list = _list_registration_records(form_id=form_id)

    return {
        "status_code": 200,
        "success": True,
        "status_msg": "success",
        "data": registrations_list,
        "registrations": registrations_list,
        "total": len(registrations_list),
    }


@app.get("/registration/validate-token/{token}", tags=["Registration"])
def validate_registration_token(token: str):
    """Validate a registration token without authentication (public endpoint)."""
    if token not in REGISTRATION_LINKS:
        raise HTTPException(
            status_code=404,
            detail={"status_code": 404, "message": "Invalid or expired token"},
        )

    link_info = REGISTRATION_LINKS[token]

    if link_info.get("revoked"):
        raise HTTPException(
            status_code=410,
            detail={"status_code": 410, "message": "Registration link has been revoked"},
        )

    if link_info.get("used"):
        raise HTTPException(
            status_code=410,
            detail={"status_code": 410, "message": "Registration link has already been used"},
        )
    
    return {
        "status_code": 200,
        "success": True,
        "valid": True,
        "form_id": link_info["form_id"],
        "template_id": link_info.get("template_id"),
        "expires_at": link_info.get("expires_at"),
    }


@app.post("/registration/submit", tags=["Registration"])
def registration_submit(body: RegistrationSubmitRequest):
    """Submit a registration form (public endpoint - requires token)."""
    if body.token not in REGISTRATION_LINKS:
        raise HTTPException(
            status_code=401,
            detail={"status_code": 401, "message": "Invalid or expired token"},
        )
    link_info = REGISTRATION_LINKS[body.token]

    if link_info.get("revoked"):
        raise HTTPException(
            status_code=410,
            detail={"status_code": 410, "message": "Registration link has been revoked"},
        )

    if link_info.get("used"):
        raise HTTPException(
            status_code=409,
            detail={"status_code": 409, "message": "Registration link has already been used"},
        )

    registration_id = f"REG-{secrets.token_hex(4).upper()}"
    form_id = link_info["form_id"]
    now = _now_iso()

    registration = {
        "id": registration_id,
        "form_id": form_id,
        "token": body.token,
        "status": "submitted",
        "contact_email": body.contact_email,
        "contact_name": body.contact_name,
        "owner_name": body.contact_name,
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
        "template_id": link_info.get("template_id"),
        "form_fields": body.form_fields or link_info.get("form_fields") or [],
        "submitted_at": now,
        "created_at": now,
        "updated_at": now,
    }

    REGISTRATIONS[registration_id] = registration

    link_info["used"] = True
    link_info["used_at"] = now
    link_info["updated_at"] = now

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


@app.get("/registration/{registration_id}", tags=["Registration"])
def get_registration(
    registration_id: str,
    token: Optional[str] = None,
    authorization: Optional[str] = Header(None),
):
    """Get registration details (admin only)."""
    _require_registration_access(token=token, authorization=authorization)

    registration = _find_registration_by_identifier(registration_id)
    if registration:
        payload = _serialize_registration(registration)
    else:
        link = _find_link_by_identifier(registration_id)
        if not link:
            raise _registration_not_found()
        payload = _serialize_link(link)

    return {
        "status_code": 200,
        "success": True,
        "data": payload,
        "registration": payload,
    }


@app.post("/registration/{registration_id}", tags=["Registration"])
async def update_registration(
    registration_id: str,
    request: Request,
    authorization: Optional[str] = Header(None),
):
    """Update registration details (admin only)."""
    _require_registration_access(authorization=authorization)
    body = await request.json()

    registration = _find_registration_by_identifier(registration_id)
    if registration is None:
        link = _find_link_by_identifier(registration_id)
        if not link:
            raise _registration_not_found()
        for key, value in body.items():
            if key not in {"id", "form_id", "token", "created_at", "status"}:
                link[key] = value
        link["updated_at"] = _now_iso()
        payload = _serialize_link(link)
        return {
            "status_code": 200,
            "success": True,
            "message": "Registration updated successfully",
            "data": payload,
        }

    for key, value in body.items():
        if key not in ["id", "created_at", "submitted_at", "status"]:
            registration[key] = value

    registration["updated_at"] = _now_iso()
    payload = _serialize_registration(registration)

    return {
        "status_code": 200,
        "success": True,
        "message": "Registration updated successfully",
        "data": payload,
    }


@app.put("/registration/{registration_id}/link-customer", tags=["Registration"])
@app.post("/registration/{registration_id}/link-customer", tags=["Registration"])
def link_customer(
    registration_id: str,
    body: LinkCustomerRequest,
    authorization: Optional[str] = Header(None),
):
    """Link or create a customer for this registration (admin only)."""
    _require_registration_access(token=body.token, authorization=authorization)

    registration = _find_registration_by_identifier(registration_id)
    if registration is None:
        raise _registration_not_found()

    customer = None
    if body.customer_id:
        registration["linked_customer_id"] = body.customer_id
        customer = CUSTOMERS.get(body.customer_id)
    elif body.create_new and body.customer_data:
        customer_id = f"CUST-{secrets.token_hex(4).upper()}"
        customer = {
            "_id": customer_id,
            "name": body.customer_data.get("name") or "New Customer",
            "email": body.customer_data.get("email") or "",
            "phone": body.customer_data.get("phone") or "",
            "registration_id": registration.get("form_id") or registration.get("id"),
            "created_at": _now_iso(),
        }
        CUSTOMERS[customer_id] = customer
        registration["linked_customer_id"] = customer_id

    registration["updated_at"] = _now_iso()
    payload = _serialize_registration(registration)

    return {
        "status_code": 200,
        "success": True,
        "message": "Customer linked successfully",
        "data": payload,
        "customer": customer,
    }


@app.post("/registration/approve/{registration_id}", tags=["Registration"])
def approve_registration(
    registration_id: str,
    body: RegistrationApproveRequest,
    authorization: Optional[str] = Header(None),
):
    """Approve a submitted registration (admin only)."""
    email = _require_registration_access(token=body.token, authorization=authorization)
    registration = _find_registration_by_identifier(registration_id)
    if registration is None:
        raise _registration_not_found()

    registration["status"] = "approved"
    registration["approved_at"] = _now_iso()
    registration["approved_by"] = email
    registration["approval_notes"] = body.approval_notes
    registration["updated_at"] = _now_iso()
    payload = _serialize_registration(registration)

    _log_audit(
        "REGISTRATION_APPROVED",
        registration.get("contact_email", registration.get("form_id", registration_id)),
        email,
        f"Approved registration {registration_id}",
    )

    return {
        "status_code": 200,
        "success": True,
        "message": "Registration approved successfully",
        "data": payload,
    }


@app.post("/registration/reject/{registration_id}", tags=["Registration"])
def reject_registration(
    registration_id: str,
    body: RegistrationRejectRequest,
    authorization: Optional[str] = Header(None),
):
    """Reject a submitted registration (admin only)."""
    email = _require_registration_access(token=body.token, authorization=authorization)
    registration = _find_registration_by_identifier(registration_id)
    if registration is None:
        raise _registration_not_found()

    registration["status"] = "rejected"
    registration["rejected_at"] = _now_iso()
    registration["rejected_by"] = email
    registration["rejection_reason"] = body.reason
    registration["updated_at"] = _now_iso()
    payload = _serialize_registration(registration)

    _log_audit(
        "REGISTRATION_REJECTED",
        registration.get("contact_email", registration.get("form_id", registration_id)),
        email,
        f"Rejected registration {registration_id}: {body.reason}",
    )

    return {
        "status_code": 200,
        "success": True,
        "message": "Registration rejected successfully",
        "data": payload,
    }


@app.post("/registration/revoke/{registration_id}", tags=["Registration"])
def revoke_registration(
    registration_id: str,
    body: RegistrationRevokeRequest,
    authorization: Optional[str] = Header(None),
):
    """Revoke a pending registration link (admin only)."""
    email = _require_registration_access(token=body.token, authorization=authorization)

    registration = _find_registration_by_identifier(registration_id)
    if registration is not None:
        registration["status"] = "cancelled"
        registration["cancelled_at"] = _now_iso()
        registration["cancelled_by"] = email
        registration["updated_at"] = _now_iso()
        payload = _serialize_registration(registration)
    else:
        link = _find_link_by_identifier(registration_id)
        if not link:
            raise _registration_not_found()
        link["revoked"] = True
        link["revoked_at"] = _now_iso()
        link["revoked_by"] = email
        link["updated_at"] = _now_iso()
        payload = _serialize_link(link)

    _log_audit(
        "REGISTRATION_REVOKED",
        payload.get("contact_email", payload.get("form_id", registration_id)),
        email,
        f"Revoked registration link {registration_id}",
    )

    return {
        "status_code": 200,
        "success": True,
        "message": "Registration link revoked successfully",
        "data": payload,
    }


@app.post("/customers/list")
@app.post("/customer/list")
def customer_list(body: dict, authorization: Optional[str] = Header(None)):
    """List customers for registration linking flows."""
    _require_registration_access(token=body.get("token"), authorization=authorization)
    customers = list(CUSTOMERS.values())
    return {
        "status_code": 200,
        "status_msg": "success",
        "customers": customers,
        "total": len(customers),
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

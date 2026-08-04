// Use environment variables when available. In production (HTTPS) prefer an HTTPS host.
const defaultHttp = 'http://52.63.11.1:5000';
const defaultHttps = 'https://dev.vend88.com';

// Read environment overrides (may be set on host). If a hosting env mistakenly
// points to the production host (prod.vend88.com) but we need dev, map it.
const rawEnvBase = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL : undefined;
const rawEnvRegBase = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_REGISTRATION_BASE_URL : undefined;

// Protect against accidental prod host in the env by mapping prod -> dev.
const sanitizeBase = (url?: string) => {
  if (!url) return undefined;
  try {
    return url.replace('prod.vend88.com', 'dev.vend88.com');
  } catch (e) {
    return url;
  }
};

const envBase = sanitizeBase(rawEnvBase);
const envRegBase = sanitizeBase(rawEnvRegBase);

const inferredBase = envBase
  || (typeof window !== 'undefined' && window.location.protocol === 'https:' ? defaultHttps : defaultHttp);
// Use the same base URL for registration (don't mix dev.vend88.com and 52.63.11.1)
// Always use HTTPS dev server for consistency with login token
const inferredRegBase = envRegBase || defaultHttps;

export const API_CONFIG = {
  BASE_URL: inferredBase,
  REGISTRATION_BASE_URL: inferredRegBase,
  ENDPOINTS: {
    LOGIN: "/admin/login",
    ADMIN_PROFILE: "/admin/profile",
    LIST_BUSINESS: "/shop/list_business",
    LIST_CUSTOMERS: "/customer/list",
    GET_PERMISSION: "/shop/get_business_permission",
    SEARCH_BUSINESS: "/search/business_search",
    UPDATE_PERMISSION: "/shop/update_business_permission",
    DELETE_PERMISSION: "/shop/delete_business_permission",
    ADD_PERMISSION: "/shop/add_business_permission",
    AGENT_BUSINESS_LIST: "/shop/get_agent_admin",
    
    // Admin Management
    LIST_USER: "/admin/list_user",
    USER_DETAIL: "/admin/user_detail",
    ADMIN_CREATE: "/admin/create_user",
    ADMIN_UPDATE: "/admin/update_user",
    ADMIN_DELETE: "/admin/delete_user",
    
    // Registration Management
    REGISTRATION_GENERATE: "/registration/generate",
    REGISTRATION_LIST: "/registration/list",
    REGISTRATION_GET: "/registration/:id",
    REGISTRATION_UPDATE: "/registration/:id",
    REGISTRATION_LINK: "/registration/:id/link-customer",
    REGISTRATION_APPROVE: "/registration/approve/:id",
    REGISTRATION_REJECT: "/registration/reject/:id",
    REGISTRATION_REVOKE: "/registration/revoke/:id",
    REGISTRATION_SUBMIT: "/registration/submit",
    REGISTRATION_VALIDATE_TOKEN: "/registration/validate-token/:token",
    
    // Customer Management
    CUSTOMERS_LIST: "/customers/list",
    CUSTOMERS_CREATE: "/customers/create",
    CUSTOMERS_GET: "/customers/:id",
    CUSTOMERS_UPDATE: "/customers/update/:id",
    CUSTOMERS_DELETE: "/customers/delete/:id",

    // Inquiry Management
    INQUIRIES_LIST: "/portal/inquiries/list",
    INQUIRIES_UPDATE: "/portal/inquiries/update",
    INQUIRIES_DELETE: "/portal/inquiries/delete",
  }
} as const;

// Get complete API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Get API URL for registration endpoints (uses different base URL)
export const getRegistrationApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.REGISTRATION_BASE_URL}${endpoint}`;
};

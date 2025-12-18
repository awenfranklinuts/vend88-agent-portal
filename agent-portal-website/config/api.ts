export const API_CONFIG = {
  BASE_URL: 'http://52.63.11.1:5000',
  REGISTRATION_BASE_URL: 'http://52.63.11.1:5000', // Direct backend server for registration endpoints
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

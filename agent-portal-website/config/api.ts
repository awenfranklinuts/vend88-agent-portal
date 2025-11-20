export const API_CONFIG = {
  BASE_URL: 'https://prod.vend88.com',
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
    
    // Registration Management (New APIs - Coming Soon)
    REGISTRATION_GENERATE: "/registration/generate",
    REGISTRATION_LIST: "/registration/list",
    REGISTRATION_GET: "/registration/:id",
    REGISTRATION_UPDATE: "/registration/:id",
    REGISTRATION_APPROVE: "/registration/approve/:id",
    REGISTRATION_REJECT: "/registration/reject/:id",
    REGISTRATION_SUBMIT: "/registration/submit",
    REGISTRATION_VALIDATE_TOKEN: "/registration/validate-token/:token",
  }
} as const;

// Get complete API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

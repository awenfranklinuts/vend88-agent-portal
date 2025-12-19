"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { getApiUrl, API_CONFIG } from "@/config/api";

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  business_id: string;
  created_at: string;
  status: "active" | "inactive";
}

export interface Business {
  _id: string;
  owner_id: string;
  name: string;
  location?: string;
  status: "active" | "inactive";
}

export interface Agent {
  _id: string;
  email: string;
  name: string;
  businesses: string[];
}

interface AdminProfile {
  email: string;
  role: string;
  first_name: string;
  last_name: string;
}

  interface AuthContextType {
  token: string | null;
  userEmail: string | null;
  role: "agent" | "admin" | null;
  adminProfile: AdminProfile | null;
  customers: Customer[];
  businesses: Business[];
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setUserEmail: (email: string | null) => void;
  setRole: (role: "agent" | "admin" | null) => void;
  fetchAdminProfile: (tokenArg?: string) => Promise<boolean>;
  fetchCustomers: () => Promise<void>;
  fetchBusinesses: () => Promise<void>;
  logout: () => void;
  sessionExpired: boolean;
  clearSessionExpired: () => void;
 }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [token, setTokenState] = useState<string | null>(null);
  const [userEmail, setUserEmailState] = useState<string | null>(null);
  const [role, setRoleState] = useState<"agent" | "admin" | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  // When user clicks Dismiss, suppress re-showing modal until this timestamp
  const [suppressSessionExpiredUntil, setSuppressSessionExpiredUntil] = useState<number | null>(null);

  useEffect(() => {
    // Initialize from localStorage and verify session timeout
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("userEmail");
    const storedRole = localStorage.getItem("role") as "agent" | "admin" | null;
    const sessionTimeout = sessionStorage.getItem('sessionTimeout');

    const now = Date.now();
    const timeout = sessionTimeout ? parseInt(sessionTimeout) : 0;

    // If session timeout missing or expired, clear any stored credentials
    if (!sessionTimeout || now >= timeout) {
      // If there was a stored token/email/role, mark session expired so UI can show message
      if (storedToken || storedEmail || storedRole) {
        // Only show expired modal if not currently suppressed
        if (!suppressSessionExpiredUntil || Date.now() >= suppressSessionExpiredUntil) {
          setSessionExpired(true);
        }
      }
      // ensure cleanup
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('role');
      sessionStorage.removeItem('sessionTimeout');
      setIsLoading(false);
      return;
    }

    if (storedToken) setTokenState(storedToken);
    if (storedEmail) setUserEmailState(storedEmail);
    if (storedRole) setRoleState(storedRole);

    // Validate token by fetching admin profile; if invalid, logout
    (async () => {
      if (storedToken) {
        try {
          const ok = await fetchAdminProfile(storedToken || undefined);
          if (!ok) {
            // token invalid, mark expired and clear session
            if (!suppressSessionExpiredUntil || Date.now() >= suppressSessionExpiredUntil) {
              setSessionExpired(true);
            }
            setTokenState(null);
            setUserEmailState(null);
            setRoleState(null);
            sessionStorage.removeItem('sessionTimeout');
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('role');
          }
        } catch (e) {
          console.warn('Token validation failed during init', e);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  const setUserEmail = (email: string | null) => {
    setUserEmailState(email);
    if (email) {
      localStorage.setItem("userEmail", email);
    } else {
      localStorage.removeItem("userEmail");
    }
  };

  const setRole = (newRole: "agent" | "admin" | null) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem("role", newRole);
    } else {
      localStorage.removeItem("role");
    }
  };

  const fetchAdminProfile = useCallback(async (tokenArg?: string) => {
    const tokenToUse = tokenArg || token;
    if (!tokenToUse || isFetchingProfile) return false;

    setIsFetchingProfile(true);
    try {
      const response = await axios.post(
        '/api/admin/profile',
        { token: tokenToUse },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenToUse}`,
          },
        }
      );

      if (response.data.status_code === 200) {
        setAdminProfile({
          email: response.data.email,
          role: response.data.role,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
        });
        setIsFetchingProfile(false);
        return true;
      }
    } catch (error) {
      console.error("Failed to fetch admin profile:", error);
      setIsFetchingProfile(false);
      return false;
    }
    // default false
    setIsFetchingProfile(false);
    return false;
  }, [token, isFetchingProfile]);

  const fetchCustomers = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.LIST_CUSTOMERS),
        { token },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status_code === 200) {
        setCustomers(response.data.customers || []);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  }, [token]);

  const fetchBusinesses = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.LIST_BUSINESS),
        { token },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status_code === 200) {
        setBusinesses(response.data.business || []);
      }
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setUserEmail(null);
    setRole(null);
    setAdminProfile(null);
    setCustomers([]);
    setBusinesses([]);
    // Clear session timeout as well
    sessionStorage.removeItem('sessionTimeout');
  };

  const clearSessionExpired = () => {
    setSessionExpired(false);
    // suppress re-showing the modal for 10 seconds after Dismiss
    const until = Date.now() + 10000;
    setSuppressSessionExpiredUntil(until);
  };

  // Clear suppression when the window passes
  useEffect(() => {
    if (!suppressSessionExpiredUntil) return;
    const ms = suppressSessionExpiredUntil - Date.now();
    if (ms <= 0) {
      setSuppressSessionExpiredUntil(null);
      return;
    }
    const t = setTimeout(() => setSuppressSessionExpiredUntil(null), ms);
    return () => clearTimeout(t);
  }, [suppressSessionExpiredUntil]);

  // Countdown state for auto-redirect when session expires
  const [redirectCountdown, setRedirectCountdown] = useState<number>(3);

  // Start countdown when sessionExpired becomes true
  useEffect(() => {
    if (!sessionExpired) {
      setRedirectCountdown(3);
      return;
    }

    setRedirectCountdown(3);
    const timer = setInterval(() => {
      setRedirectCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionExpired]);

  // When countdown reaches zero, force logout and redirect to login
  useEffect(() => {
    if (sessionExpired && redirectCountdown <= 0) {
      // stop showing the expired modal and reset countdown to avoid negative display
      setSessionExpired(false);
      setRedirectCountdown(0);
      // clear session and redirect
      logout();
      try {
        router.push('/login');
      } catch (e) {
        // fallback: use window.location
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
  }, [redirectCountdown, sessionExpired, router]);

  return (
    <AuthContext.Provider
      value={{
        token,
        userEmail,
        role,
        adminProfile,
        customers,
        businesses,
        isLoading,
        setToken,
        setUserEmail,
        setRole,
        fetchAdminProfile,
        fetchCustomers,
        fetchBusinesses,
        logout,
        sessionExpired,
        clearSessionExpired,
      }}
    >
      {children}

      {sessionExpired && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)', zIndex: 1200 }}>
          <div style={{ background: 'white', padding: 24, borderRadius: 12, maxWidth: 420, width: '90%', textAlign: 'center' }}>
            <h3 style={{ margin: 0, marginBottom: 8, color: '#0a3655' }}>{'Session Expired'}</h3>
            <p style={{ marginTop: 0, marginBottom: 8, color: '#5c6b7a' }}>{'Your session has expired. Please login again to continue.'}</p>
            <p style={{ marginTop: 0, marginBottom: 12, color: '#9ca3af' }}>{`Redirecting to login in ${redirectCountdown} second${redirectCountdown === 1 ? '' : 's'}...`}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <button onClick={() => { clearSessionExpired(); }} style={{ padding: '8px 12px', borderRadius: 8, background: '#e5e7eb', border: 'none', cursor: 'pointer' }}>{'Dismiss'}</button>
              <button onClick={() => { logout(); router.push('/login'); }} style={{ padding: '8px 12px', borderRadius: 8, background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}>{'Go to Login'}</button>
            </div>
          </div>
        </div>
      )}

    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

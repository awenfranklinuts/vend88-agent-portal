"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
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
  fetchAdminProfile: () => Promise<void>;
  fetchCustomers: () => Promise<void>;
  fetchBusinesses: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [userEmail, setUserEmailState] = useState<string | null>(null);
  const [role, setRoleState] = useState<"agent" | "admin" | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize from localStorage
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("userEmail");
    const storedRole = localStorage.getItem("role") as "agent" | "admin" | null;

    if (storedToken) setTokenState(storedToken);
    if (storedEmail) setUserEmailState(storedEmail);
    if (storedRole) setRoleState(storedRole);

    setIsLoading(false);
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

  const fetchAdminProfile = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_PROFILE),
        { token },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
      }
    } catch (error) {
      console.error("Failed to fetch admin profile:", error);
    }
  }, [token]);

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
  };

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
      }}
    >
      {children}
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

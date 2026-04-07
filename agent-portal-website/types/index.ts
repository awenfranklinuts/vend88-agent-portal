// Common types used across the application

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  business_id: string;
  business_ids?: string[];
  created_at: string;
  status: "active" | "inactive";
}

export interface Business {
  _id: string;
  owner_id: string;
  name: string;
  location?: string;
  status: "active" | "inactive" | "setup" | "suspended";
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  contact_email?: string;
  contactEmail?: string;
  contact_phone?: string;
  contactPhone?: string;
  owner_name?: string;
  owner_email?: string;
  abn?: string;
  address?: string;
  suburb?: string;
  postcode?: string;
  state?: string;
  country?: string;
  eftposIntegration?: string;
  alipayOption?: string;
  alipayOther?: string;
  registrationId?: string;
}

export interface Agent {
  _id: string;
  email: string;
  name: string;
  businesses: string[];
  role: "agent" | "admin";
}

export interface Permission {
  _id: string;
  business_id: string;
  expire: string;
  level: string;
  name: string;
}

export interface ApiResponse<T = any> {
  status_code: number;
  message?: string;
  data?: T;
}

export type Language = "en" | "zh";

export interface TranslationDict {
  [key: string]: {
    en: string;
    zh: string;
  };
}

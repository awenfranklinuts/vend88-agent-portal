import type { ComponentType } from "react";
import { hasPermission } from "@/context/AuthContext";
import {
  AdminIcon,
  AgentIcon,
  BusinessIcon,
  CustomersIcon,
  InquiryIcon,
  QuotationIcon,
  RegistrationIcon,
  ReportsIcon,
  SettingsIcon,
  TemplateIcon,
} from "@/components/icons/AdminModuleIcons";

/**
 * Single source of truth for admin modules.
 *
 * The sidebar, the dashboard home cards and the admin permission editor all
 * read from this list. To add a module: add an entry here, create its page
 * under app/admin, and gate that page with hasPermission(adminProfile, <permission>).
 */

export interface LocalizedText {
  en: string;
  zh: string;
}

export type AdminSectionId = "sales" | "accounts" | "insights" | "system";

export const ADMIN_SECTIONS: { id: AdminSectionId; label: LocalizedText }[] = [
  { id: "sales", label: { en: "Sales", zh: "销售" } },
  { id: "accounts", label: { en: "Accounts", zh: "账户" } },
  { id: "insights", label: { en: "Insights", zh: "数据洞察" } },
  { id: "system", label: { en: "System", zh: "系统" } },
];

export interface AdminSubModule {
  label: LocalizedText;
  href: string;
  icon: ComponentType;
  permission: string;
}

export interface AdminModule {
  id: string;
  section: AdminSectionId;
  label: LocalizedText;
  description: LocalizedText;
  href: string;
  icon: ComponentType;
  /** Required for modules without children. Modules with children are visible if any child is. */
  permission?: string;
  children?: AdminSubModule[];
  /** Permission cannot be granted to regular admins (super admins always have it). */
  superAdminOnly?: boolean;
}

export const ADMIN_MODULES: AdminModule[] = [
  // Sales
  {
    id: "inquiries",
    section: "sales",
    label: { en: "Inquiry Management", zh: "咨询管理" },
    description: {
      en: "View and manage customer and lead inquiries submitted from pospal.com.au and vendpos.com.au.",
      zh: "查看和管理来自 pospal.com.au 和 vendpos.com.au 的客户与潜在客户咨询。",
    },
    href: "/admin/inquiries",
    icon: InquiryIcon,
    permission: "manage_inquiries",
  },
  {
    id: "quotations",
    section: "sales",
    label: { en: "Quotation Management", zh: "报价管理" },
    description: {
      en: "Create, send, and track quotations for customers.",
      zh: "创建、发送和跟踪客户报价。",
    },
    href: "/admin/quotations",
    icon: QuotationIcon,
    permission: "manage_quotations",
  },

  // Accounts
  {
    id: "businesses",
    section: "accounts",
    label: { en: "Business Management", zh: "业务管理" },
    description: {
      en: "Manage all businesses and locations. View, add, edit, and monitor business information.",
      zh: "管理所有业务和地点。查看、添加、编辑和监控业务信息。",
    },
    href: "/admin/businesses",
    icon: BusinessIcon,
    permission: "manage_businesses",
  },
  {
    id: "customers",
    section: "accounts",
    label: { en: "Customer Management", zh: "客户管理" },
    description: {
      en: "Manage all POS customers. View, add, edit, and monitor customer information.",
      zh: "管理所有POS客户。查看、添加、编辑和监控客户信息。",
    },
    href: "/admin/customers",
    icon: CustomersIcon,
    permission: "manage_customers",
  },
  {
    id: "agents",
    section: "accounts",
    label: { en: "Agent Management", zh: "代理管理" },
    description: {
      en: "Manage agent accounts and permissions. Assign business access rights.",
      zh: "管理代理账户和权限。分配业务访问权限。",
    },
    href: "/admin/agents",
    icon: AgentIcon,
    permission: "manage_agents",
  },
  {
    id: "registrations",
    section: "accounts",
    label: { en: "Registration Management", zh: "注册管理" },
    description: {
      en: "Review, generate, and manage one-time registration links and registrations.",
      zh: "审核、生成和管理一次性注册链接与注册。",
    },
    href: "/admin/registrations",
    icon: RegistrationIcon,
    children: [
      {
        label: { en: "Registration Forms", zh: "注册表单" },
        href: "/admin/registrations",
        icon: RegistrationIcon,
        permission: "manage_registration_forms",
      },
      {
        label: { en: "Form Templates", zh: "表单模板" },
        href: "/admin/registrations/templates",
        icon: TemplateIcon,
        permission: "manage_form_templates",
      },
    ],
  },

  // Insights
  {
    id: "reports",
    section: "insights",
    label: { en: "Reports & Analytics", zh: "报告与分析" },
    description: {
      en: "View detailed reports, analytics, and insights across all customers and businesses.",
      zh: "查看详细报告、分析和所有客户和业务的洞察。",
    },
    href: "/admin/reports",
    icon: ReportsIcon,
    permission: "view_reports",
  },

  // System
  {
    id: "admins",
    section: "system",
    label: { en: "Admin Management", zh: "管理员管理" },
    description: {
      en: "Manage system administrator accounts and permissions.",
      zh: "管理系统管理员账户和权限。",
    },
    href: "/admin/admins",
    icon: AdminIcon,
    permission: "manage_admins",
    superAdminOnly: true,
  },
  {
    id: "settings",
    section: "system",
    label: { en: "System Settings", zh: "系统设置" },
    description: {
      en: "Configure system settings, user permissions, and application preferences.",
      zh: "配置系统设置、用户权限和应用程序偏好。",
    },
    href: "/admin/settings",
    icon: SettingsIcon,
    permission: "manage_system_settings",
  },
];

type ProfileLike = Parameters<typeof hasPermission>[0];

/** Permissions a module controls, with display names for the permission editor. */
export const getModulePermissions = (module: AdminModule): { id: string; label: LocalizedText }[] =>
  module.children
    ? module.children.map(child => ({ id: child.permission, label: child.label }))
    : module.permission
      ? [{ id: module.permission, label: module.label }]
      : [];

export const ALL_PERMISSION_IDS: string[] = ADMIN_MODULES.flatMap(m => getModulePermissions(m).map(p => p.id));

export const canAccessModule = (profile: ProfileLike, module: AdminModule): boolean =>
  getModulePermissions(module).some(p => hasPermission(profile, p.id));

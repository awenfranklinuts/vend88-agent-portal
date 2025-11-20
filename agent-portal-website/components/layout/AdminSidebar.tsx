"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";

// Icon Components
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const BusinessIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const CustomersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const AgentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const ReportsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v6m0 6v6"/>
    <path d="M17.7 6.3l-3 3m-5.4 0l-3-3"/>
    <path d="M23 12h-6m-6 0H1"/>
    <path d="M17.7 17.7l-3-3m-5.4 0l-3 3"/>
  </svg>
);

const RegistrationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const AdminIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 1 0 6 0V5a3 3 0 0 0-3-3z"/>
    <path d="M12 14a9 9 0 0 0-9 9h18a9 9 0 0 0-9-9z"/>
    <path d="M12 14v-2"/>
  </svg>
);

const Sidebar = styled.aside<{ $mobileOpen: boolean }>`
  width: 280px;
  background: white;
  box-shadow: 2px 0 8px rgba(30, 64, 175, 0.08);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  
  @media (max-width: 968px) {
    position: fixed;
    left: 0;
    top: 65px;
    bottom: 0;
    width: 280px;
    z-index: 99;
    transform: translateX(${p => p.$mobileOpen ? '0' : '-100%'});
  }
`;

const Overlay = styled.div<{ $show: boolean }>`
  display: none;
  
  @media (max-width: 968px) {
    display: ${p => p.$show ? 'block' : 'none'};
    position: fixed;
    top: 65px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 98;
  }
`;

const SidebarHeader = styled.div`
  padding: 2rem 1.5rem;
  border-bottom: 1px solid #e0e7ef;
`;

const WelcomeText = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #0a3655;
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.p`
  font-size: 0.875rem;
  color: #5c6b7a;
`;

const RoleBadge = styled.span`
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, rgba(26, 35, 126, 0.1) 0%, rgba(0, 234, 255, 0.1) 100%);
  color: #1a237e;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 12px;
  text-transform: uppercase;
`;

const NavList = styled.nav`
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
`;

const NavItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border: none;
  background: ${p => p.$active ? 'rgba(26, 35, 126, 0.08)' : 'transparent'};
  color: ${p => p.$active ? '#1a237e' : '#0a3655'};
  font-size: 0.9375rem;
  font-weight: ${p => p.$active ? '600' : '500'};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background: rgba(26, 35, 126, 0.05);
    color: #1a237e;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${p => p.$active ? 'linear-gradient(180deg, #1a237e 0%, #00eaff 100%)' : 'transparent'};
    transition: background 0.2s ease;
  }
  
  &:hover::before {
    background: linear-gradient(180deg, #1a237e 0%, #00eaff 100%);
  }
`;

const NavIcon = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { userEmail, adminProfile, fetchAdminProfile } = useAuth();
  const { lang } = useLanguage();

  const t = (key: keyof typeof dict) => dict[key][lang];

  // Fetch admin profile on mount
  React.useEffect(() => {
    if (!adminProfile) {
      fetchAdminProfile();
    }
  }, [adminProfile, fetchAdminProfile]);

  const navigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const displayName = adminProfile 
    ? `${adminProfile.first_name} ${adminProfile.last_name}`.trim() || userEmail?.split("@")[0]
    : userEmail?.split("@")[0];

  return (
    <>
      <Overlay $show={mobileOpen} onClick={onClose} />
      <Sidebar $mobileOpen={mobileOpen}>
        <SidebarHeader>
          <WelcomeText>
            {t("welcome")}, {displayName}
          </WelcomeText>
          <UserEmail>{userEmail}</UserEmail>
          <RoleBadge>{t("admin")}</RoleBadge>
        </SidebarHeader>

        <NavList>
          <NavItem $active={pathname === "/admin"} onClick={() => navigate("/admin")}>
            <NavIcon><HomeIcon /></NavIcon>
            {lang === "zh" ? "首页" : "Home"}
          </NavItem>

          <NavItem $active={pathname === "/admin/businesses"} onClick={() => navigate("/admin/businesses")}>
            <NavIcon><BusinessIcon /></NavIcon>
            {t("businessManagement")}
          </NavItem>

          <NavItem $active={pathname === "/admin/customers"} onClick={() => navigate("/admin/customers")}>
            <NavIcon><CustomersIcon /></NavIcon>
            {t("customerManagement")}
          </NavItem>

          <NavItem $active={pathname === "/admin/agents"} onClick={() => navigate("/admin/agents")}>
            <NavIcon><AgentIcon /></NavIcon>
            {lang === "zh" ? "代理管理" : "Agent Management"}
          </NavItem>

          <NavItem $active={pathname === "/admin/registrations"} onClick={() => navigate("/admin/registrations")}>
            <NavIcon><RegistrationIcon /></NavIcon>
            {lang === "zh" ? "注册管理" : "Registration Management"}
          </NavItem>

          <NavItem $active={pathname === "/admin/admins"} onClick={() => navigate("/admin/admins")}>
            <NavIcon><AdminIcon /></NavIcon>
            {lang === "zh" ? "管理员管理" : "Admin Management"}
          </NavItem>

          <NavItem $active={pathname === "/admin/reports"} onClick={() => navigate("/admin/reports")}>
            <NavIcon><ReportsIcon /></NavIcon>
            {lang === "zh" ? "报告与分析" : "Reports & Analytics"}
          </NavItem>

          <NavItem $active={pathname === "/admin/settings"} onClick={() => navigate("/admin/settings")}>
            <NavIcon><SettingsIcon /></NavIcon>
            {lang === "zh" ? "系统设置" : "System Settings"}
          </NavItem>
        </NavList>
      </Sidebar>
    </>
  );
}

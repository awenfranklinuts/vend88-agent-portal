"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { useAuth, hasPermission } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import { formatRole } from "@/lib/roleFormatter";
import { ADMIN_MODULES, ADMIN_SECTIONS, canAccessModule, type AdminModule } from "@/config/adminModules";
import { HomeIcon } from "@/components/icons/AdminModuleIcons";

const Sidebar = styled.aside<{ $mobileOpen: boolean }>`
  width: 310px;
  background: white;
  box-shadow: 2px 0 8px rgba(30, 64, 175, 0.08);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  position: fixed;
  left: 0;
  top: 65px;
  bottom: 0;
  overflow-y: auto;
  z-index: 90;
  
  @media (max-width: 968px) {
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

const TeamName = styled.p`
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: #1a237e;
  font-weight: 600;
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

const NavItem = styled(Link)<{ $active?: boolean }>`
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
  text-decoration: none;
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

const NavGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavParent = styled.div<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: ${p => p.$active ? 'rgba(26, 35, 126, 0.08)' : 'transparent'};
  color: ${p => p.$active ? '#1a237e' : '#0a3655'};
  font-size: 0.9375rem;
  font-weight: ${p => p.$active ? '600' : '500'};
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

const SectionLabel = styled.div`
  padding: 1.25rem 1.5rem 0.375rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8a97a6;
`;

const NavParentLabel = styled.span`
  flex: 1;
`;

const ChevronIcon = styled.span<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  transform: rotate(${p => p.$expanded ? '90deg' : '0deg'});
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const SubNavList = styled.div<{ $expanded: boolean }>`
  overflow: hidden;
  max-height: ${p => p.$expanded ? '200px' : '0'};
  transition: max-height 0.2s ease;
`;

const SubNavItem = styled(Link)<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1.5rem 0.625rem 3.5rem;
  background: ${p => p.$active ? 'rgba(26, 35, 126, 0.08)' : 'transparent'};
  color: ${p => p.$active ? '#1a237e' : '#5c6b7a'};
  font-size: 0.875rem;
  font-weight: ${p => p.$active ? '600' : '500'};
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(26, 35, 126, 0.05);
    color: #1a237e;
  }
`;

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

/* ─── Skeleton styles for loading state ─── */
const shimmer = `
  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  }
`;

const SkeletonPulse = styled.div`
  ${shimmer}
  background: linear-gradient(90deg, #e8ecf1 25%, #f0f3f7 50%, #e8ecf1 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
`;

const SkeletonNavItem = styled(SkeletonPulse)`
  height: 40px;
  margin: 4px 16px;
`;

const SkeletonHeaderLine = styled(SkeletonPulse)`
  height: 14px;
  margin: 4px 0;
`;
export default function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname() ?? "";
  const { userEmail, adminProfile, fetchAdminProfile } = useAuth();
  const { lang } = useLanguage();

  const isInModule = (module: AdminModule) => pathname === module.href || pathname.startsWith(`${module.href}/`);

  // Groups start expanded when the current page is inside them
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({});
  const activeGroupId = ADMIN_MODULES.find(m => m.children && isInModule(m))?.id;

  React.useEffect(() => {
    if (activeGroupId) setExpandedGroups(prev => ({ ...prev, [activeGroupId]: true }));
  }, [activeGroupId]);

  const toggleGroup = (id: string) => setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));

  const t = (key: keyof typeof dict) => dict[key][lang];

  // Fetch admin profile on mount
  React.useEffect(() => {
    if (!adminProfile) {
      fetchAdminProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayName = adminProfile 
    ? `${adminProfile.first_name} ${adminProfile.last_name}`.trim() || userEmail?.split("@")[0]
    : userEmail?.split("@")[0];

  // Show skeleton while adminProfile is loading
  if (!adminProfile) {
    return (
      <>
        <Overlay $show={mobileOpen} onClick={onClose} />
        <Sidebar $mobileOpen={mobileOpen}>
          <SidebarHeader>
            <SkeletonHeaderLine style={{ width: '70%', height: '16px' }} />
            <SkeletonHeaderLine style={{ width: '90%', height: '12px' }} />
            <SkeletonHeaderLine style={{ width: '50%', height: '20px', marginTop: '4px' }} />
          </SidebarHeader>
          <NavList>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <SkeletonNavItem key={i} />
            ))}
          </NavList>
        </Sidebar>
      </>
    );
  }

  const renderModule = (module: AdminModule) => {
    const Icon = module.icon;

    if (!module.children) {
      return (
        <NavItem key={module.id} href={module.href} $active={isInModule(module)} onClick={onClose} prefetch={true}>
          <NavIcon><Icon /></NavIcon>
          {module.label[lang]}
        </NavItem>
      );
    }

    const expanded = expandedGroups[module.id] ?? false;
    return (
      <NavGroup key={module.id}>
        <NavParent $active={isInModule(module)} onClick={() => toggleGroup(module.id)}>
          <NavIcon><Icon /></NavIcon>
          <NavParentLabel>{module.label[lang]}</NavParentLabel>
          <ChevronIcon $expanded={expanded}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </ChevronIcon>
        </NavParent>
        <SubNavList $expanded={expanded}>
          {module.children
            .filter(child => hasPermission(adminProfile, child.permission))
            .map(child => {
              const ChildIcon = child.icon;
              return (
                <SubNavItem key={child.href} href={child.href} $active={pathname === child.href} onClick={onClose} prefetch={true}>
                  <NavIcon><ChildIcon /></NavIcon>
                  {child.label[lang]}
                </SubNavItem>
              );
            })}
        </SubNavList>
      </NavGroup>
    );
  };

  return (
    <>
      <Overlay $show={mobileOpen} onClick={onClose} />
      <Sidebar $mobileOpen={mobileOpen}>
        <SidebarHeader>
          <WelcomeText>
            {t("welcome")}, {displayName}
          </WelcomeText>
          <UserEmail>{userEmail}</UserEmail>
          {adminProfile?.team?.name && <TeamName>{adminProfile.team.name}</TeamName>}
          <RoleBadge>{formatRole(adminProfile?.role)}</RoleBadge>
        </SidebarHeader>

        <NavList>
          <NavItem href="/admin" $active={pathname === "/admin"} onClick={onClose} prefetch={true}>
            <NavIcon><HomeIcon /></NavIcon>
            {lang === "zh" ? "首页" : "Home"}
          </NavItem>

          {ADMIN_SECTIONS.map(section => {
            const modules = ADMIN_MODULES.filter(m => m.section === section.id && canAccessModule(adminProfile, m));
            if (modules.length === 0) return null;
            return (
              <React.Fragment key={section.id}>
                <SectionLabel>{section.label[lang]}</SectionLabel>
                {modules.map(renderModule)}
              </React.Fragment>
            );
          })}
        </NavList>
      </Sidebar>
    </>
  );
}

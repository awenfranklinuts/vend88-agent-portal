"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";

const HeaderContainer = styled.header<{ $scrolled: boolean }>`
  background: ${p => p.$scrolled 
    ? 'rgba(255, 255, 255, 0.8)' 
    : 'rgba(255, 255, 255, 1)'};
  backdrop-filter: ${p => p.$scrolled ? 'blur(12px) saturate(180%)' : 'none'};
  -webkit-backdrop-filter: ${p => p.$scrolled ? 'blur(12px) saturate(180%)' : 'none'};
  box-shadow: 0 2px 8px rgba(30, 64, 175, ${p => p.$scrolled ? '0.12' : '0.08'});
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
`;

const HeaderContent = styled.div`
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 968px) {
    padding: 1rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  
  @media (max-width: 968px) {
    gap: 1rem;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  
  @media (max-width: 968px) {
    gap: 0.5rem;
  }
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #0a3655;
  margin: 0;
  padding-left: 1rem;
  border-left: 2px solid rgba(26, 35, 126, 0.3);
  
  @media (max-width: 968px) {
    font-size: 1.25rem;
    padding-left: 0.75rem;
    display: none;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #0a3655;
  
  @media (max-width: 968px) {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  span {
    width: 24px;
    height: 2px;
    background: currentColor;
    transition: all 0.3s ease;
  }
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #5c6b7a;
  
  @media (max-width: 968px) {
    display: none;
  }
`;

const BreadcrumbItem = styled.span<{ $active?: boolean }>`
  color: ${p => p.$active ? '#1a237e' : '#5c6b7a'};
  font-weight: ${p => p.$active ? '600' : '400'};
  
  &:not(:last-child)::after {
    content: '›';
    margin-left: 0.5rem;
    color: #b0bec5;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 968px) {
    gap: 0.75rem;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 968px) {
    gap: 0.75rem;
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a237e 0%, #00eaff 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 968px) {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 968px) {
    display: none;
  }
`;

const UserEmail = styled.span`
  font-size: 0.875rem;
  color: #0a3655;
  font-weight: 500;
`;

const UserRole = styled.span`
  font-size: 0.75rem;
  color: #5c6b7a;
  text-transform: capitalize;
`;

const IconButton = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #5c6b7a;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(26, 35, 126, 0.05);
    color: #1a237e;
  }
  
  @media (max-width: 968px) {
    width: 36px;
    height: 36px;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff6b35;
  border: 2px solid white;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background: linear-gradient(90deg, #1a237e 0%, #00eaff 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(30, 64, 175, 0.2);
    }
  }
  
  &.logout {
    background: #fee2e2;
    color: #991b1b;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
      background: #fecaca;
      transform: translateY(-1px);
    }
    
    @media (max-width: 968px) {
      padding: 0.5rem;
      
      span {
        display: none;
      }
    }
  }
`;

const LangDropdown = styled.div`
  position: relative;
`;

const LangButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border: 2px solid rgba(60,90,120,0.12);
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-weight: 600;
  color: #2b7be3;
  transition: all 200ms ease;
  font-size: 0.9rem;
  
  &:hover {
    border-color: #2b7be3;
    box-shadow: 0 4px 12px rgba(43,123,227,0.15);
    transform: translateY(-2px);
  }
`;

const DropdownMenu = styled.div<{ $show: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border: 2px solid rgba(60,90,120,0.12);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(30, 64, 175, 0.15);
  overflow: hidden;
  opacity: ${p => p.$show ? 1 : 0};
  visibility: ${p => p.$show ? 'visible' : 'hidden'};
  transform: ${p => p.$show ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all 200ms ease;
  min-width: 140px;
  z-index: 10;
`;

const MenuItem = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: ${p => p.$active ? 'rgba(43,123,227,0.1)' : 'transparent'};
  color: ${p => p.$active ? '#2b7be3' : '#3c5a78'};
  text-align: left;
  cursor: pointer;
  font-weight: ${p => p.$active ? '700' : '500'};
  transition: background 150ms ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(43,123,227,0.08);
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(60,90,120,0.06);
  }
`;

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3"
    style={{ 
      transition: 'transform 200ms ease',
      transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
    }}
  >
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

interface HeaderProps {
  currentPage?: string;
  onMenuToggle?: () => void;
}

export default function Header({ currentPage = "Home", onMenuToggle }: HeaderProps) {
  const router = useRouter();
  const { token, userEmail, role, adminProfile, fetchAdminProfile, logout } = useAuth();
  const { lang, setLang } = useLanguage();
  const [showLangMenu, setShowLangMenu] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [hasNotifications] = React.useState(true); // Mock notification state
  
  const t = (key: keyof typeof dict) => dict[key][lang];
  
  // Fetch admin profile on mount if role is admin
  React.useEffect(() => {
    if (token && role === "admin" && !adminProfile) {
      fetchAdminProfile();
    }
  }, [token, role, adminProfile, fetchAdminProfile]);
  
  // Get user initials
  const getUserInitials = () => {
    if (adminProfile && adminProfile.first_name && adminProfile.last_name) {
      return `${adminProfile.first_name.charAt(0)}${adminProfile.last_name.charAt(0)}`.toUpperCase();
    }
    if (!userEmail) return "U";
    const name = userEmail.split("@")[0];
    return name.substring(0, 2).toUpperCase();
  };
  
  // Get display name
  const getDisplayName = () => {
    if (adminProfile && adminProfile.first_name && adminProfile.last_name) {
      return `${adminProfile.first_name} ${adminProfile.last_name}`;
    }
    return userEmail || "";
  };
  
  // Handle scroll for glassmorphism effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLangMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-lang-dropdown]')) {
          setShowLangMenu(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showLangMenu]);

  return (
    <HeaderContainer $scrolled={scrolled}>
      <HeaderContent>
        <LeftSection>
          <HamburgerButton onClick={onMenuToggle}>
            <span />
            <span />
            <span />
          </HamburgerButton>
          
          <LogoSection onClick={() => {
            if (token) {
              if (role === "admin") {
                router.push("/admin");
              } else if (role === "agent") {
                router.push("/agent");
              }
            } else {
              router.push("/");
            }
          }}>
            <Image
              src="/images/brand.png"
              alt="VEND88"
              width={120}
              height={40}
              style={{ width: 'auto', height: '40px' }}
            />
            <Logo>Agent Portal</Logo>
          </LogoSection>
          
          {token && (
            <Breadcrumbs>
              <BreadcrumbItem>{role === "admin" ? t("admin") : t("agent")}</BreadcrumbItem>
              <BreadcrumbItem $active>{currentPage}</BreadcrumbItem>
            </Breadcrumbs>
          )}
        </LeftSection>
        
        <Nav>
          {token ? (
            <>
              <IconButton onClick={() => alert('Notifications')}>
                <BellIcon />
                {hasNotifications && <NotificationBadge />}
              </IconButton>
              
              <UserSection>
                <UserAvatar title={getDisplayName()}>
                  {getUserInitials()}
                </UserAvatar>
                <UserInfo>
                  <UserEmail>{getDisplayName()}</UserEmail>
                  <UserRole>{role}</UserRole>
                </UserInfo>
              </UserSection>
              
              <Button className="logout" onClick={handleLogout}>
                <LogoutIcon />
                <span>{t("logout")}</span>
              </Button>
            </>
          ) : (
            <Button className="primary" onClick={() => router.push("/login")}>
              {t("login")}
            </Button>
          )}
          
          <LangDropdown data-lang-dropdown>
            <LangButton onClick={() => setShowLangMenu(!showLangMenu)}>
              <GlobeIcon />
              <span>{lang === "en" ? "EN" : "中文"}</span>
              <ChevronIcon open={showLangMenu} />
            </LangButton>
            <DropdownMenu $show={showLangMenu}>
              <MenuItem 
                $active={lang === "en"} 
                onClick={() => { 
                  setLang("en"); 
                  setShowLangMenu(false); 
                }}
              >
                🇦🇺 English
              </MenuItem>
              <MenuItem 
                $active={lang === "zh"} 
                onClick={() => { 
                  setLang("zh"); 
                  setShowLangMenu(false); 
                }}
              >
                🇨🇳 中文
              </MenuItem>
            </DropdownMenu>
          </LangDropdown>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
}

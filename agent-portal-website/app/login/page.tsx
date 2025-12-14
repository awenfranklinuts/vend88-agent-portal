"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styled from "styled-components";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import { getApiUrl, API_CONFIG } from "@/config/api";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%);
  padding: 1rem;
`;

const LoginBox = styled.div`
  background: white;
  padding: 5rem;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(30, 64, 175, 0.12);
  width: 100%;
  height: 95vh;
  max-width: 95vw;
  display: flex;
  align-items: center;
  gap: 5rem;

  @media (max-width: 968px) {
    flex-direction: column;
    gap: 2rem;
    height: auto;
    max-width: 450px;
    padding: 2rem;
  }
`;

const LoginImageSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 10%;
    height: 80%;
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(26, 35, 126, 0.1) 20%,
      rgba(0, 234, 255, 0.2) 50%,
      rgba(26, 35, 126, 0.1) 80%,
      transparent
    );
  }

  @media (max-width: 968px) {
    display: none;
  }
`;

const LoginFormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 3rem;

  @media (max-width: 968px) {
    padding-left: 0;
  }
`;

const BrandLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const MobilePermissionLogo = styled.div`
  display: none;
  
  @media (max-width: 968px) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }
`;

const VendText = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: #0b2b4a;
  
  span {
    color: #ff6b35;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: #0a3655;
  margin-bottom: 0;
  padding-left: 1rem;
  border-left: 2px solid rgba(26, 35, 126, 0.3);
  
  @media (max-width: 968px) {
    padding-left: 0;
    border-left: none;
    text-align: center;
  }
`;

const LoginModeIndicator = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, rgba(26, 35, 126, 0.05) 0%, rgba(0, 234, 255, 0.05) 100%);
  border-radius: 10px;
  border: 1px solid rgba(26, 35, 126, 0.1);
  
  span {
    font-size: 0.875rem;
    color: #5c6b7a;
    font-weight: 500;
    
    strong {
      color: #1a237e;
      font-weight: 700;
    }
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 2rem;
  text-align: center;
`;

const FormContainer = styled.div`
  animation: fadeIn 0.6s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    left: 0.875rem;
    width: 20px;
    height: 20px;
    background-size: contain;
    opacity: 0.5;
    z-index: 1;
  }

  &.email::before {
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%235c6b7a" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>');
  }

  &.password::before {
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%235c6b7a" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>');
  }
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #222831;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 0.875rem 0.875rem 3rem;
  border: 2px solid #e0e7ef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #1a237e;
    box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #b0bec5;
  }
`;

const Button = styled.button`
  background: #3b82f6;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-top: 0.5rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(59,130,246,0.24);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    background: #93c5fd;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
`;

const InfoMessage = styled.div`
  background: #dbeafe;
  color: #1e40af;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
`;

const SwitchRole = styled.a`
  display: inline-block;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #1a237e;
  text-decoration: underline;
  font-weight: 600;
  transition: color 0.2s;
  cursor: pointer;
  text-align: right;
  
  &:hover {
    color: #00eaff;
  }
`;

const RememberForgotRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
`;

const RememberMe = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #5c6b7a;
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #1a237e;
  }
`;

const ForgotPassword = styled.a`
  font-size: 0.875rem;
  color: #1a237e;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  
  &:hover {
    color: #00eaff;
    text-decoration: underline;
  }
`;

const LanguageSwitcher = styled.div`
  position: absolute;
  top: 4rem;
  right: 5rem;
  z-index: 20;
  
  @media (max-width: 968px) {
    top: 2rem;
    right: 2rem;
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

export default function LoginPage() {
  const router = useRouter();
  const { setToken, setUserEmail, setRole } = useAuth();
  const { lang, setLang } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRoleState] = useState<"agent" | "admin">("agent");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<keyof typeof dict | "">("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showForgotPasswordMessage, setShowForgotPasswordMessage] = useState(false);

  const t = (key: keyof typeof dict) => dict[key][lang];

  // Initialize role from sessionStorage after mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedRole = sessionStorage.getItem('loginRole');
      if (savedRole === 'admin') {
        setRoleState('admin');
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted, role:", role);
    setErrorKey("");
    setErrorMessage("");
    setShowForgotPasswordMessage(false);
    setIsLoading(true);

    // Only allow admin login for now
    if (role !== "admin") {
      console.log("Agent login not available");
      setErrorKey("agentLoginNotAvailable");
      setIsLoading(false);
      return;
    }

    console.log("Attempting admin login...");
    // Use proxy to bypass SSL certificate errors
    const apiUrl = '/api/login';
    console.log("API URL:", apiUrl);
    try {
      const response = await axios.post(apiUrl, {
        email: email,
        password: password,
      }, {
        timeout: 15000, // 15 second timeout
      });

      console.log("Login response:", response.data);

      if (response.data.status_code === 200 && response.data.token) {
        // Set authentication data
        const userToken = response.data.token;
        console.log("Setting token:", userToken);
        setToken(userToken);
        setUserEmail(email);
        setRole(role);
        
        // Clear the saved role from sessionStorage on successful login
        sessionStorage.removeItem('loginRole');
        
        console.log("Login successful, redirecting to:", role === "admin" ? "/admin" : "/agent");
        
        // Small delay to ensure state is saved, then redirect
        setTimeout(() => {
          const redirectPath = role === "admin" ? "/admin" : "/agent";
          console.log("Navigating to:", redirectPath);
          router.push(redirectPath);
        }, 100);
      } else {
        // Handle specific error messages
        const message = response.data.message || "";
        if (message.toLowerCase().includes("not belong to an active user")) {
          setErrorKey("emailNotRegistered");
        } else if (message.toLowerCase().includes("invalid password")) {
          setErrorKey("incorrectPassword");
        } else if (message.toLowerCase().includes("login successful")) {
          // Ignore success message from API since we're redirecting
          return;
        } else {
          if (message) {
            setErrorMessage(message);
          } else {
            setErrorKey("loginFailedCredentials");
          }
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status
      });
      
      const apiErrorMessage = err.response?.data?.message || "";
      
      // Network errors (cannot reach server)
      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setErrorMessage(`Cannot reach server at ${API_CONFIG.BASE_URL}. Please check if the backend is running.`);
      } else if (apiErrorMessage.toLowerCase().includes("not belong to an active user")) {
        setErrorKey("emailNotRegistered");
      } else if (apiErrorMessage.toLowerCase().includes("invalid password")) {
        setErrorKey("incorrectPassword");
      } else if (err.response?.status === 401) {
        setErrorKey("invalidCredentials");
      } else if (err.response?.status === 404) {
        setErrorMessage(`Endpoint not found: ${getApiUrl(API_CONFIG.ENDPOINTS.LOGIN)}`);
      } else if (err.response?.status >= 500) {
        setErrorKey("serverErrorTryAgain");
      } else if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
        setErrorMessage("Request timeout. Server is taking too long to respond.");
      } else if (apiErrorMessage) {
        // Don't show 'Login successful' as error
        if (!apiErrorMessage.toLowerCase().includes("login successful")) {
          setErrorMessage(apiErrorMessage);
        }
      } else {
        setErrorMessage(`Connection error: ${err.message || 'Unable to connect to server'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LoginBox>
        <LoginImageSection>
          <Image
            src="/images/login.png"
            alt="Login illustration"
            width={350}
            height={350}
            priority
            style={{ width: '100%', height: 'auto', maxWidth: '350px' }}
          />
        </LoginImageSection>

        <LoginFormSection>
          <LanguageSwitcher>
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
          </LanguageSwitcher>

          <MobilePermissionLogo>
            <Image
              src="/images/login.png"
              alt="Permission Management"
              width={200}
              height={200}
              style={{ width: '100%', height: 'auto', maxWidth: '200px' }}
            />
          </MobilePermissionLogo>

          <BrandLogo>
            <Image
              src="/images/brand.png"
              alt="VEND88"
              width={160}
              height={55}
              style={{ width: 'auto', height: '55px' }}
            />
            <Title>Agent Portal</Title>
          </BrandLogo>
          
          <LoginModeIndicator>
            <span>{t("loggingInAs")} <strong>{role === "agent" ? t("agent") : t("admin")}</strong></span>
          </LoginModeIndicator>
          
          <FormContainer>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>{t("email")}</Label>
                <InputWrapper className="email">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("enterAccount")}
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label>{t("password")}</Label>
                <InputWrapper className="password">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("enterPassword")}
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <RememberForgotRow>
                <RememberMe>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  {t("rememberMe")}
                </RememberMe>
                <ForgotPassword onClick={(e) => {
                  e.preventDefault();
                  setShowForgotPasswordMessage(true);
                  setErrorKey("");
                  setErrorMessage("");
                  setTimeout(() => setShowForgotPasswordMessage(false), 5000);
                }}>
                  {t("forgotPassword")}
                </ForgotPassword>
              </RememberForgotRow>

              {showForgotPasswordMessage && (
                <ErrorMessage>
                  {t("contactAdminResetPassword")}
                </ErrorMessage>
              )}
              
              {(errorKey || errorMessage) && (
                <ErrorMessage>
                  {errorKey ? t(errorKey) : errorMessage}
                </ErrorMessage>
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? t("loggingIn") : t("login")}
              </Button>
            </Form>
            
            <SwitchRole onClick={() => {
              const newRole = role === "agent" ? "admin" : "agent";
              sessionStorage.setItem('loginRole', newRole);
              window.location.reload();
            }}>
              {role === "agent" ? t("switchToAdminLogin") : t("switchToAgentLogin")}
            </SwitchRole>
          </FormContainer>
        </LoginFormSection>
      </LoginBox>
    </Container>
  );
}

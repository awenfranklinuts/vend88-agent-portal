"use client";

import { useState, useEffect, memo, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styled from "styled-components";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import { getApiUrl, API_CONFIG } from "@/config/api";
import crypto from "crypto-js";

// Add lazy loading for images
import dynamic from 'next/dynamic';

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
    margin-top: 4rem;
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

const HoneypotField = styled.input`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  &:active:not(:disabled)::before {
    width: 300px;
    height: 300px;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 28px rgba(59,130,246,0.3);
    background: #2563eb;
  }
  
  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    border-color: #2b7be3;
    box-shadow: 0 4px 12px rgba(43,123,227,0.15);
    transform: translateY(-2px);
    background: rgba(43,123,227,0.05);
  }
  
  &:hover svg {
    transform: rotate(180deg) scale(1.1);
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
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
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #2b7be3;
    transform: scaleY(0);
    transition: transform 0.2s ease;
  }
  
  &:hover {
    background: rgba(43,123,227,0.08);
    padding-left: 1.25rem;
  }
  
  &:hover::before {
    transform: scaleY(1);
  }
  
  &:active {
    background: rgba(43,123,227,0.15);
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

// Security utilities
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>"']/g, '');
};

// Optimize device fingerprint generation - only compute once
const useDeviceFingerprint = () => {
  return useMemo(() => {
    if (typeof window === 'undefined') return '';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('fingerprint', 2, 2);
    }
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage,
      canvas.toDataURL()
    ].join('|');
    return btoa(fingerprint).substring(0, 32);
  }, []);
};

const checkRateLimit = (email: string): { allowed: boolean; waitTime: number } => {
  if (typeof window === 'undefined') return { allowed: true, waitTime: 0 };
  
  const now = Date.now();
  const key = `login_attempts_${email}`;
  const lockKey = `login_locked_${email}`;
  
  // Check if account is locked
  const lockData = sessionStorage.getItem(lockKey);
  if (lockData) {
    const { until } = JSON.parse(lockData);
    if (now < until) {
      return { allowed: false, waitTime: Math.ceil((until - now) / 1000) };
    } else {
      sessionStorage.removeItem(lockKey);
      sessionStorage.removeItem(key);
    }
  }
  
  const attemptsData = sessionStorage.getItem(key);
  if (!attemptsData) return { allowed: true, waitTime: 0 };
  
  const { attempts, firstAttempt } = JSON.parse(attemptsData);
  
  // Reset if first attempt was more than 15 minutes ago
  if (now - firstAttempt > 15 * 60 * 1000) {
    sessionStorage.removeItem(key);
    return { allowed: true, waitTime: 0 };
  }
  
  // Lock account after 5 failed attempts
  if (attempts >= 5) {
    const lockUntil = now + 15 * 60 * 1000; // 15 minutes
    sessionStorage.setItem(lockKey, JSON.stringify({ until: lockUntil }));
    return { allowed: false, waitTime: 900 };
  }
  
  // Implement exponential backoff
  if (attempts >= 3) {
    const backoffTime = Math.pow(2, attempts - 3) * 5000; // 5s, 10s, 20s...
    const lastAttempt = JSON.parse(attemptsData).lastAttempt || 0;
    const timeSinceLastAttempt = now - lastAttempt;
    
    if (timeSinceLastAttempt < backoffTime) {
      return { allowed: false, waitTime: Math.ceil((backoffTime - timeSinceLastAttempt) / 1000) };
    }
  }
  
  return { allowed: true, waitTime: 0 };
};

const recordFailedAttempt = (email: string) => {
  if (typeof window === 'undefined') return;
  
  const now = Date.now();
  const key = `login_attempts_${email}`;
  const attemptsData = sessionStorage.getItem(key);
  
  if (!attemptsData) {
    sessionStorage.setItem(key, JSON.stringify({
      attempts: 1,
      firstAttempt: now,
      lastAttempt: now
    }));
  } else {
    const data = JSON.parse(attemptsData);
    sessionStorage.setItem(key, JSON.stringify({
      attempts: data.attempts + 1,
      firstAttempt: data.firstAttempt,
      lastAttempt: now
    }));
  }
};

const clearFailedAttempts = (email: string) => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(`login_attempts_${email}`);
  sessionStorage.removeItem(`login_locked_${email}`);
};

// Create a centralized error logger
const logError = (error: any, context: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, {
      message: error.message,
      code: error.code,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
      timestamp: new Date().toISOString()
    });
  }
  
  // In production, send to error tracking service (e.g., Sentry)
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    // Example: Sentry.captureException(error);
  }
};

// Add a loading overlay with spinner
const LoadingOverlay = styled.div<{ $show: boolean }>`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  opacity: ${p => p.$show ? 1 : 0};
  visibility: ${p => p.$show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 10;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e0e7ef;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const { setToken, setUserEmail, setRole } = useAuth();
  const { lang, setLang } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRoleState] = useState<"agent" | "admin">("agent");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<keyof typeof dict | "">("")
  const [errorMessage, setErrorMessage] = useState("");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showForgotPasswordMessage, setShowForgotPasswordMessage] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [requestId, setRequestId] = useState("");
  
  // Call the hook at the top level, not inside callbacks
  const deviceFingerprint = useDeviceFingerprint();

  const t = (key: keyof typeof dict) => dict[key][lang];

  // Check for existing authentication on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');
      const userRole = localStorage.getItem('role');
      const sessionTimeout = sessionStorage.getItem('sessionTimeout');
      
      // If we have a valid token and session hasn't expired
      if (token && userEmail && userRole) {
        const now = Date.now();
        const timeout = sessionTimeout ? parseInt(sessionTimeout) : 0;
        
        // Check if session is still valid
        if (!sessionTimeout || now < timeout) {
          // Session is valid, redirect to appropriate dashboard
          console.log("Valid session found, redirecting to dashboard");
          const redirectPath = userRole === "admin" ? "/admin" : "/agent";
          router.push(redirectPath);
          return;
        } else {
          // Session expired, clear auth data
          console.log("Session expired, clearing auth data");
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('role');
          sessionStorage.removeItem('sessionTimeout');
        }
      }
    }
  }, [router]);

  // Initialize role from sessionStorage after mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedRole = sessionStorage.getItem('loginRole');
      if (savedRole === 'admin') {
        setRoleState('admin');
      }
      
      // Load saved email if remember me was checked
      const savedEmail = localStorage.getItem('rememberedEmail');
      const wasRemembered = localStorage.getItem('rememberMe') === 'true';
      if (savedEmail && wasRemembered) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
      
      // Generate unique request ID
      setRequestId(crypto.lib.WordArray.random(16).toString());
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

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Alt + L to focus login button
      if (e.altKey && e.key === 'l') {
        e.preventDefault();
        document.querySelector('button[type="submit"]')?.focus();
      }
      // Escape to clear form
      if (e.key === 'Escape') {
        setEmail('');
        setPassword('');
        setErrorKey('');
        setErrorMessage('');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Generate and validate CSRF token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let csrfToken = sessionStorage.getItem('csrf_token');
      if (!csrfToken) {
        csrfToken = crypto.lib.WordArray.random(32).toString();
        sessionStorage.setItem('csrf_token', csrfToken);
      }
    }
  }, []);

  // Use callback for event handlers
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted, role:", role);
    setErrorKey("");
    setErrorMessage("");
    setShowForgotPasswordMessage(false);
    
    // Security Check 1: Honeypot detection (bot prevention)
    if (honeypot) {
      console.warn("Honeypot triggered - potential bot detected");
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Fake delay
      setErrorKey("loginFailedCredentials");
      setIsLoading(false);
      return;
    }
    
    // Security Check 2: Input sanitization
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = password; // Don't sanitize password to preserve special chars
    
    // Security Check 3: Basic validation
    if (!sanitizedEmail || !sanitizedPassword) {
      setErrorKey("loginFailedCredentials");
      return;
    }
    
    // Security Check 4: Rate limiting
    const rateCheck = checkRateLimit(sanitizedEmail);
    if (!rateCheck.allowed) {
      setErrorMessage(`Too many failed attempts. Please wait ${rateCheck.waitTime} seconds before trying again.`);
      return;
    }
    
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
    
    // Security Check 5: Use device fingerprint from hook (already called at top level)
    // const deviceFingerprint = useDeviceFingerprint(); // REMOVED - already called above
    
    // Security Check 6: Generate request timestamp and nonce
    const timestamp = Date.now();
    const nonce = crypto.lib.WordArray.random(16).toString();
    
    try {
      const response = await axios.post(apiUrl, {
        email: sanitizedEmail,
        password: sanitizedPassword,
      }, {
        timeout: 15000, // 15 second timeout
        headers: {
          'X-Request-ID': requestId,
          'X-Device-Fingerprint': deviceFingerprint,
          'X-Timestamp': timestamp.toString(),
          'X-Nonce': nonce,
          'X-Client-Version': '1.0.0',
          'X-CSRF-Token': sessionStorage.getItem('csrf_token') || '',
        },
        withCredentials: true, // Enable cookies for CSRF protection if backend supports it
      });

      console.log("Login response:", response.data);

      if (response.data.status_code === 200 && response.data.token) {
        // Security: Clear failed login attempts on success
        clearFailedAttempts(sanitizedEmail);
        
        // Set authentication data
        const userToken = response.data.token;
        console.log("Setting token:", userToken);
        setToken(userToken);
        setUserEmail(sanitizedEmail);
        setRole(role);
        
        // Handle remember me functionality (only store email, never password)
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', sanitizedEmail);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberMe');
        }
        
        // Clear the saved role from sessionStorage on successful login
        sessionStorage.removeItem('loginRole');
        
        // Security: Set session timeout (30 minutes of inactivity)
        const sessionTimeout = Date.now() + (30 * 60 * 1000);
        sessionStorage.setItem('sessionTimeout', sessionTimeout.toString());
        
        console.log("Login successful, redirecting to:", role === "admin" ? "/admin" : "/agent");
        
        // Small delay to ensure state is saved, then redirect
        setTimeout(() => {
          const redirectPath = role === "admin" ? "/admin" : "/agent";
          console.log("Navigating to:", redirectPath);
          router.push(redirectPath);
        }, 100);
      } else {
        // Security: Record failed attempt
        recordFailedAttempt(sanitizedEmail);
        
        // Security: Use generic error messages to prevent username enumeration
        // Don't reveal whether email exists or password is wrong
        setErrorKey("invalidCredentials");
      }
    } catch (err: any) {
      logError(err, 'Login Attempt');
      console.error("Login error:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Security: Record failed attempt
      recordFailedAttempt(sanitizedEmail);
      
      // Security: Use generic error messages to prevent information leakage
      // Network errors (cannot reach server)
      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setErrorMessage("Cannot reach server. Please check your connection.");
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        // Generic message - don't reveal if email exists or password is wrong
        setErrorKey("invalidCredentials");
      } else if (err.response?.status === 429) {
        setErrorMessage("Too many requests. Please try again later.");
      } else if (err.response?.status >= 500) {
        setErrorKey("serverErrorTryAgain");
      } else if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
        setErrorMessage("Request timeout. Please try again.");
      } else {
        // Generic error message
        setErrorKey("invalidCredentials");
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, password, role, rememberMe, honeypot, requestId, deviceFingerprint]);

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
            <Form onSubmit={handleSubmit} role="form" aria-label={t("login")} style={{ position: 'relative' }}>
              {/* Honeypot field - hidden from users, catches bots */}
              <HoneypotField
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              
              <FormGroup role="group" aria-labelledby="email-label">
                <Label id="email-label">{t("email")}</Label>
                <InputWrapper className="email">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("enterAccount")}
                    required
                    autoComplete="username"
                    aria-required="true"
                    aria-invalid={!!errorKey || !!errorMessage}
                    aria-describedby={errorKey || errorMessage ? "error-message" : undefined}
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
                    autoComplete="current-password"
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
                <ErrorMessage id="error-message" role="alert" aria-live="assertive">
                  {errorKey ? t(errorKey) : errorMessage}
                </ErrorMessage>
              )}

              <Button 
                type="submit" 
                disabled={isLoading}
                aria-busy={isLoading}
                aria-label={isLoading ? t("loggingIn") : t("login")}
              >
                {isLoading ? t("loggingIn") : t("login")}
              </Button>

              <LoadingOverlay $show={isLoading}>
                <Spinner />
              </LoadingOverlay>
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

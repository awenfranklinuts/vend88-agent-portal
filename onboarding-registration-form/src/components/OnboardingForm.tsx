import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import en from "../locales/en.json";
import zh from "../locales/zh.json";
import ThankYouCard from "./ThankYouCard";
import Image from "next/image";
import axios from "axios";

type LocaleMap = typeof en;
const locales = { en, zh } as const;
type LocaleKey = keyof typeof locales;

type DynamicFormField = {
  id: string;
  label?: string;
  type?: "text" | "email" | "phone" | "select" | "multiple_choice" | "textarea" | "number" | "date" | "address";
  required?: boolean;
  options?: string[];
  choiceMode?: "single" | "multiple";
};

const BUILTIN_FIELD_IDS = new Set<string>([
  "contact_email",
  "contact_name",
  "contact_phone",
  "messaging_app_type",
  "quote_number",
  "business_name",
  "abn",
  "registered_address",
  "registered_suburb",
  "registered_postcode",
  "registered_state",
  "registered_country",
  "eftpos_integration",
  "alipay_option",
  "ready_by",
  "heard_about",
  "heard_other",
  "menu_files",
  "menu_send_later",
  "notes",
]);

const appear = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideOut = keyframes`
  from { 
    opacity: 1; 
    transform: translateX(0) scale(1); 
  }
  to { 
    opacity: 0; 
    transform: translateX(-50%) scale(0.9); 
  }
`;

const slideIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(50%) scale(0.9); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0) scale(1); 
  }
`;

const pulse = keyframes`
  0%, 100% { 
    box-shadow: 0 8px 20px rgba(43,123,227,0.18), 0 0 0 0 rgba(43,123,227,0.4);
  }
  50% { 
    box-shadow: 0 12px 28px rgba(43,123,227,0.25), 0 0 0 8px rgba(43,123,227,0);
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
`;

const pulseWarning = keyframes`
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 0 0 12px rgba(231, 76, 60, 0);
  }
`;

const StatusCard = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  animation: ${fadeIn} 500ms ease both;
`;

const StatusIcon = styled.div<{ $type?: 'error' | 'loading' }>`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  display: inline-block;
  ${props => props.$type === 'loading' && `
    animation: ${spin} 2s linear infinite;
  `}
  ${props => props.$type === 'error' && `
    animation: ${shake} 0.6s ease-in-out;
  `}
`;

const WarningIconWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  margin-bottom: 1.5rem;
  animation: ${shake} 0.6s ease-in-out, ${fadeIn} 500ms ease both;
`;

const WarningIconCircle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.15), rgba(255, 107, 107, 0.1));
  border-radius: 50%;
  animation: ${pulseWarning} 2s ease-in-out infinite;
`;

const WarningIconSvg = styled.svg`
  position: relative;
  z-index: 1;
  width: 64px;
  height: 64px;
  filter: drop-shadow(0 4px 12px rgba(231, 76, 60, 0.3));
`;

const StatusTitle = styled.div<{ $type?: 'error' | 'loading' }>`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${props => props.$type === 'error' ? '#e74c3c' : '#2b7be3'};
`;

const StatusMessage = styled.div`
  color: #567;
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
`;

const InfoBox = styled.div`
  background: linear-gradient(135deg, rgba(43,123,227,0.08), rgba(94,200,255,0.05));
  border: 1.5px solid rgba(43,123,227,0.2);
  border-radius: 12px;
  padding: 1.5rem;
  font-size: 0.95rem;
  color: #456;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(43,123,227,0.08);
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(43,123,227,0.15);
  border-top-color: #2b7be3;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: 0 auto 1.5rem;
`;

const GlobalStyle = createGlobalStyle`
  html {
    min-height: 100%;
    margin: 0;
    font-family: 'Stack Sans Text', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(180deg, rgba(30, 64, 175, 0.05) 0%, rgba(59, 130, 246, 0.02) 60%, rgba(147, 197, 253, 0.03) 100%);
    background-image:
      radial-gradient(circle at 10% 10%, rgba(59, 130, 246, 0.08), transparent 12%),
      radial-gradient(circle at 90% 90%, rgba(147, 197, 253, 0.06), transparent 10%),
      linear-gradient(180deg, rgba(30, 64, 175, 0.05) 0%, rgba(59, 130, 246, 0.02) 60%, rgba(147, 197, 253, 0.03) 100%);
    background-attachment: fixed;
  }
  
  body {
    margin: 0;
    min-height: 100vh;
  }
  
  #root { 
    min-height: 100vh; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
  }
`;

const Container = styled.section`
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
  animation: ${appear} 400ms ease both;
  &.slide-out {
    animation: ${slideOut} 600ms cubic-bezier(0.4, 0.0, 0.2, 1) both;
  }
  &.slide-in {
    animation: ${slideIn} 600ms cubic-bezier(0.4, 0.0, 0.2, 1) both;
  }
`;

const Card = styled.div`
  width: 920px;
  max-width: 96%;
  background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9));
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 12px 30px rgba(30, 64, 175, 0.12), inset 0 1px 0 rgba(255,255,255,0.7);
  border: 1px solid rgba(147, 197, 253, 0.2);
  transition: transform 240ms ease, box-shadow 240ms ease;
  &:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(30, 64, 175, 0.18); }
`;

const HeroHeader = styled.div`
  text-align: center;
  padding: 3rem 1.5rem 2rem;
  background: linear-gradient(135deg, rgba(43,123,227,0.08), rgba(94,200,255,0.05));
  margin: -2rem -2rem 2.5rem;
  border-radius: 16px 16px 0 0;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 640px) {
    padding: 2rem 1rem 1.5rem;
    padding-top: 4rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2b7be3, #5ec8ff, #2b7be3);
    background-size: 200% 100%;
    animation: gradientShift 3s ease infinite;
  }

  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

const LogosContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 640px) {
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
`;

const LogoImage = styled.img`
  height: 40px;
  object-fit: contain;
`;

const LogoDivider = styled.div`
  width: 1px;
  height: 30px;
  background: rgba(43,123,227,0.2);
`;

const LangDropdownFixed = styled.div`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 20;
  
  @media (max-width: 640px) {
    top: 0.75rem;
    right: 0.75rem;
    left: 0.75rem;
    display: flex;
    justify-content: flex-end;
  }
`;

const HeroTitle = styled.h1`
  margin: 0 0 0.75rem;
  color: #0b2b4a;
  font-size: 2.2rem;
  letter-spacing: 0.5px;
  font-weight: 900;
  line-height: 1.2;
  background: linear-gradient(135deg, #0b2b4a 0%, #2b7be3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${appear} 600ms ease both;
  animation-delay: 200ms;

  @media (max-width: 640px) {
    font-size: 1.75rem;
  }
`;

const HeroSubtitle = styled.p`
  margin: 0 0 1rem;
  color: #567;
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 560px;
  margin: 0 auto;
  animation: ${appear} 600ms ease both;
  animation-delay: 300ms;

  @media (max-width: 640px) {
    font-size: 0.95rem;
  }
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.9);
  border: 1.5px solid rgba(43,123,227,0.2);
  border-radius: 24px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #2b7be3;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(43,123,227,0.12);
  animation: ${appear} 600ms ease both;
  animation-delay: 400ms;
  
  &::before {
    content: '✓';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #2b7be3, #5ec8ff);
    color: white;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 700;
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h2`
  margin: 0;
  color: #0b2b4a;
  font-size: 1.75rem;
  letter-spacing: 0.2px;
  font-weight: 800;
  background: linear-gradient(135deg, #0b2b4a 0%, #2b7be3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Badge = styled.span`
  padding: 0.35rem 0.75rem;
  background: linear-gradient(135deg, rgba(43,123,227,0.1), rgba(94,200,255,0.08));
  border: 1.5px solid rgba(43,123,227,0.2);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #2b7be3;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProgressBar = styled.div`
  height: 4px;
  background: rgba(43,123,227,0.1);
  border-radius: 2px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: 30%;
    background: linear-gradient(90deg, #2b7be3, #5ec8ff);
    animation: ${appear} 600ms ease;
  }
`;

const Subtitle = styled.p`
  margin: 0;
  color: #567;
  font-size: 0.95rem;
  padding-left: 60px;
`;

const LanguageSelect = styled.select`
  padding: 0.45rem 0.6rem;
  border-radius: 8px;
  border: 1px solid rgba(60,90,120,0.12);
  background: #fff;
  font-weight: 600;
  color: #0b2b4a;
  cursor: pointer;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  @media (max-width: 920px) { 
    grid-template-columns: 1fr; 
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  position: relative;
`;

const Label = styled.label`
  font-weight: 600;
  color: #3c5a78;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid rgba(60,90,120,0.12);
  background: linear-gradient(180deg, #fff, #fbfdff);
  transition: border-color 160ms ease, box-shadow 160ms ease;
  &:focus { outline: none; border-color: #2b7be3; box-shadow: 0 6px 18px rgba(43,123,227,0.12); }
  &.error { 
    border-color: #e74c3c; 
  }
  &.error:focus { 
    border-color: #e74c3c; 
    box-shadow: 0 6px 18px rgba(231,76,60,0.15); 
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid rgba(60,90,120,0.12);
  min-height: 120px;
  resize: vertical;
  transition: border-color 160ms ease, box-shadow 160ms ease;
  &:focus { outline: none; border-color: #2b7be3; box-shadow: 0 6px 18px rgba(43,123,227,0.12); }
  &.error { 
    border-color: #e74c3c; 
  }
  &.error:focus { 
    border-color: #e74c3c; 
    box-shadow: 0 6px 18px rgba(231,76,60,0.15); 
  }
`;

const Select = styled.select`
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid rgba(60,90,120,0.12);
  background: linear-gradient(180deg, #fff, #fbfdff);
  cursor: pointer;
  transition: border-color 160ms ease, box-shadow 160ms ease;
  font-size: 1rem;
  color: #3c5a78;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  
  /* Improve mobile appearance */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233c5a78' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
  
  @media (max-width: 640px) {
    font-size: 16px;
    padding: 0.9rem 1rem;
    padding-right: 2.5rem;
  }
  
  &:focus { 
    outline: none; 
    border-color: #2b7be3; 
    box-shadow: 0 6px 18px rgba(43,123,227,0.12);
  }
  
  &.error { 
    border-color: #e74c3c; 
  }
  
  &.error:focus { 
    border-color: #e74c3c; 
    box-shadow: 0 6px 18px rgba(231,76,60,0.15); 
  }
  
  /* Style for options */
  option {
    padding: 0.75rem;
    background: white;
    color: #3c5a78;
    font-size: 1rem;
    
    @media (max-width: 640px) {
      font-size: 16px;
      padding: 1rem;
    }
  }
`;

const ErrorText = styled.div`
  font-size: 0.8rem;
  color: #e74c3c;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  animation: ${appear} 300ms ease;
`;

const FileUploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #2b7be3, #5ec8ff);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
  border: none;
  
  input[type="file"] {
    display: none;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(43,123,227,0.25);
  }
  
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: rgba(43,123,227,0.05);
  border-radius: 6px;
  font-size: 0.85rem;
  color: #3c5a78;
`;

const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  transition: color 150ms ease;
  
  &:hover {
    color: #c0392b;
  }
`;

const Side = styled.aside`
  display:flex;
  flex-direction:column;
  gap:0.75rem;
`;

const CardBox = styled.div`
  padding:1rem;
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,249,255,0.98));
  border-radius:12px;
  border: 1px solid rgba(60,90,120,0.06);
`;

const Submit = styled.button`
  margin-top: 1rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #2b7be3 0%, #5ec8ff 100%);
  color: white;
  font-weight: 700;
  font-size: 1.05rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(43,123,227,0.18);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(43,123,227,0.25);
    background: linear-gradient(135deg, #1e6ad9 0%, #4ab8f0 100%);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active { 
    transform: translateY(0px);
    box-shadow: 0 6px 16px rgba(43,123,227,0.2);
  }
  
  &:disabled { 
    opacity: 0.7;
    cursor: not-allowed; 
    transform: none;
    box-shadow: 0 4px 12px rgba(43,123,227,0.12);
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      margin-left: 10px;
      border: 2px solid white;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @media (max-width: 640px) {
    width: 100%;
    padding: 1.1rem 1.5rem;
  }
`;

const SubmitWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const SubmitHint = styled.div`
  font-size: 0.85rem;
  color: #567;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  svg {
    width: 16px;
    height: 16px;
    color: #10b981;
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

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(43,123,227,0.03), rgba(94,200,255,0.02));
  border-radius: 12px;
  border: 1px solid rgba(43,123,227,0.08);
`;

const GroupTitle = styled.div`
  font-weight: 700;
  color: #3c5a78;
  font-size: 1rem;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    width: 4px;
    height: 18px;
    background: linear-gradient(180deg, #2b7be3, #5ec8ff);
    border-radius: 2px;
  }
`;

const AccordionSection = styled.div<{ $expanded: boolean }>`
  border-radius: 12px;
  transition: max-height 300ms ease, opacity 300ms ease;
  background: ${p => p.$expanded ? 'rgba(43,123,227,0.03)' : 'transparent'};
  border: 1px solid ${p => p.$expanded ? 'rgba(43,123,227,0.08)' : 'rgba(43,123,227,0.05)'};
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  cursor: pointer;
  font-weight: 600;
  color: #0b2b4a;
  background: rgba(255,255,255,0.9);
  transition: background 200ms ease;
  font-size: 0.95rem;
  border-radius: 11px 11px 0 0;
  
  @media (max-width: 640px) {
    padding: 0.9rem 1rem;
    font-size: 0.9rem;
  }
  
  &:hover {
    background: rgba(255,255,255,1);
  }
`;

const AccordionContent = styled.div<{ $expanded: boolean }>`
  padding: ${p => p.$expanded ? '1rem 1.25rem 1.5rem' : '0 1.25rem'};
  max-height: ${p => p.$expanded ? '3000px' : '0'};
  opacity: ${p => p.$expanded ? 1 : 0};
  overflow: ${p => p.$expanded ? 'visible' : 'hidden'};
  transition: padding 300ms ease, max-height 400ms ease, opacity 300ms ease;
  
  @media (max-width: 640px) {
    padding: ${p => p.$expanded ? '1rem 1rem 1.25rem' : '0 1rem'};
  }
`;

const ReferenceImagesContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
  
  @media (max-width: 640px) {
    gap: 0.5rem;
  }
`;

const ReferenceImageWrapper = styled.div`
  flex: 1;
  min-width: 140px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(43,123,227,0.15);
  box-shadow: 0 4px 12px rgba(43,123,227,0.1);
  transition: all 200ms ease;
  background: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(43,123,227,0.2);
    border-color: rgba(43,123,227,0.3);
  }
`;

const ReferenceImage = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 60%;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ImageCaption = styled.div`
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: #567;
  text-align: center;
  background: rgba(43,123,227,0.03);
  font-weight: 600;
`;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.vend88.com';

export default function OnboardingForm() {
  const router = useRouter();
  const { token } = router.query;
  
  const browserLang =
    typeof navigator !== "undefined" && navigator.language.startsWith("zh")
      ? "zh"
      : "en";
  const [lang, setLang] = useState<LocaleKey>(browserLang as LocaleKey);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  
  // Token validation states
  const [tokenValidating, setTokenValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [formFields, setFormFields] = useState<DynamicFormField[]>([]);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string | string[]>>({});

  // Immediate redirect if no token - before any rendering
  useEffect(() => {
    if (router.isReady && (!token || typeof token !== 'string')) {
      window.location.replace('https://vend88.com.au');
    }
  }, [router.isReady, token]);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token || typeof token !== 'string') {
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/registration/validate-token/${token}`);
        // Support both { data: { valid, used, expired } } and flat { valid, used, expired }
        const result = response.data.data || response.data;
        
        if ((response.data.success || result.valid) && result.valid && !result.used && !result.expired) {
          setTokenValid(true);
          setTokenError(null);
          setFormFields(result.form_fields || []);
        } else {
          const reason = result.reason || 
            (result.used 
              ? (lang === "zh" ? "此注册表单已提交。每个链接只能使用一次。如需更改，请联系管理员。" : "This registration form has already been submitted. Each link can only be used once. Please contact the admin if you need to make changes.")
              : result.expired
              ? (lang === "zh" ? "注册令牌已过期。请联系管理员获取新链接。" : "Registration token has expired. Please contact the admin for a new link.")
              : (lang === "zh" ? "无效的注册令牌。" : "Invalid registration token."));
          setTokenError(reason);
          setTokenValid(false);
        }
      } catch (err: any) {
        console.error("Token validation error:", err);
        setTokenError(
          err.response?.data?.error || 
          (lang === "zh" ? "验证令牌时出错。请稍后重试。" : "Error validating token. Please try again later.")
        );
        setTokenValid(false);
      } finally {
        setTokenValidating(false);
      }
    };

    if (router.isReady) {
      validateToken();
    }
  }, [token, router.isReady, lang]);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value as LocaleKey);
  };
  const dict = locales[lang];

  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    quoteNumber: "",
    abn: "",
    registeredAddress: "",
    registeredSuburb: "",
    registeredPostcode: "",
    registeredState: "",
    registeredCountry: "Australia",
    phone: "",
    messagingAppType: "", // Add this
    messagingAppId: "",    // Add this
    notes: "",
  });
  const [eftposIntegration, setEftposIntegration] = useState<"yes" | "no" | "">("");
  const [alipayOption, setAlipayOption] = useState<string>("");
  const [alipayOther, setAlipayOther] = useState<string>("");
  const [readyBy, setReadyBy] = useState<string>("");
  const [heardAbout, setHeardAbout] = useState<string>("");
  const [heardOther, setHeardOther] = useState<string>("");
  const [menuFiles, setMenuFiles] = useState<File[]>([]);
  const [menuSendLater, setMenuSendLater] = useState<boolean>(false);
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const isFieldEnabled = (fieldId: string) =>
    formFields.length === 0 || formFields.some((f) => f.id === fieldId);

  const customFields = formFields.filter((f) => !BUILTIN_FIELD_IDS.has(f.id));

  const getCustomFieldErrorKey = (fieldId: string) => `custom_${fieldId}`;

  const handleCustomFieldChange = (fieldId: string, value: string | string[]) => {
    setCustomFieldValues((prev) => ({ ...prev, [fieldId]: value }));
    const errorKey = getCustomFieldErrorKey(fieldId);
    if (fieldErrors[errorKey]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
    if (error) {
      setError(null);
    }
  };

  const getSubmittedFieldValue = (fieldId: string): string | boolean | string[] | null => {
    switch (fieldId) {
      case "contact_email":
        return form.email;
      case "contact_name":
        return form.ownerName;
      case "contact_phone":
        return form.phone;
      case "messaging_app_type":
        return form.messagingAppType || null;
      case "quote_number":
        return form.quoteNumber;
      case "business_name":
        return form.businessName;
      case "abn":
        return form.abn;
      case "registered_address":
        return form.registeredAddress;
      case "registered_suburb":
        return form.registeredSuburb;
      case "registered_postcode":
        return form.registeredPostcode;
      case "registered_state":
        return form.registeredState;
      case "registered_country":
        return form.registeredCountry;
      case "eftpos_integration":
        return eftposIntegration || null;
      case "alipay_option":
        return alipayOption || null;
      case "ready_by":
        return readyBy || null;
      case "heard_about":
        return heardAbout || null;
      case "heard_other":
        return heardOther || null;
      case "menu_files":
        return menuFiles.map((file) => file.name);
      case "menu_send_later":
        return menuSendLater;
      case "notes":
        return form.notes || null;
      default:
        return customFieldValues[fieldId] ?? null;
    }
  };

  const validateABN = (abn: string): boolean => {
    const cleanABN = abn.replace(/\s/g, '');
    return /^\d{11}$/.test(cleanABN);
  };

  const validateAustralianMobile = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s/g, '').replace(/\+61/, '0');
    return /^04\d{8}$/.test(cleanPhone);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    // Clear general error message when user starts fixing errors
    if (error) {
      setError(null);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setMenuFiles(prev => [...prev, ...newFiles]);
      setMenuSendLater(false);
      if (fieldErrors.menuUpload) {
        setFieldErrors(prev => {
          const next = { ...prev };
          delete next.menuUpload;
          return next;
        });
      }
    }
  };
  
  const removeFile = (index: number) => {
    setMenuFiles(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setForm({ 
      businessName: "", 
      ownerName: "", 
      email: "", 
      quoteNumber: "", 
      abn: "", 
      registeredAddress: "", 
      registeredSuburb: "",
      registeredPostcode: "",
      registeredState: "", 
      registeredCountry: "Australia", 
      phone: "",
      messagingAppType: "", // Add this
      messagingAppId: "",    // Add this
      notes: "" 
    });
    setEftposIntegration("");
    setAlipayOption("");
    setAlipayOther("");
    setReadyBy("");
    setHeardAbout("");
    setHeardOther("");
    setMenuFiles([]);
    setMenuSendLater(false);
    setTermsAgreed(false);
    setFieldErrors({});
    setShowThankYou(false);
    setIsSliding(false);
  };
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);
    
    const errors: Record<string, string> = {};
    
    if (!form.email.trim()) {
      errors.email = lang === "en" ? "Email address is required" : "电子邮箱为必填项";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = lang === "en" ? "Please enter a valid email address" : "请输入有效的电子邮箱";
    }
    
    if (!form.ownerName.trim()) {
      errors.ownerName = lang === "en" ? "Full name is required" : "全名为必填项";
    }
    
    if (!form.quoteNumber.trim()) {
      errors.quoteNumber = lang === "en" ? "Quote or invoice number is required" : "报价单或发票号码为必填项";
    }
    
    if (!form.businessName.trim()) {
      errors.businessName = lang === "en" ? "Business trading name is required" : "公司交易名称为必填项";
    }
    
    if (!form.abn.trim()) {
      errors.abn = lang === "en" ? "ABN is required" : "ABN 为必填项";
    } else if (!validateABN(form.abn)) {
      errors.abn = lang === "en" ? "ABN must be exactly 11 digits" : "ABN 必须为 11 位数字";
    }
    
    if (!form.registeredAddress.trim()) {
      errors.registeredAddress = lang === "en" ? "Street address is required" : "街道地址为必填项";
    }
    
    if (!form.registeredSuburb.trim()) {
      errors.registeredSuburb = lang === "en" ? "City/Suburb is required" : "城市/郊区为必填项";
    }
    
    if (!form.registeredPostcode.trim()) {
      errors.registeredPostcode = lang === "en" ? "Postcode is required" : "邮政编码为必填项";
    } else if (!/^\d{4}$/.test(form.registeredPostcode)) {
      errors.registeredPostcode = lang === "en" ? "Postcode must be exactly 4 digits" : "邮政编码必须为 4 位数字";
    }
    
    if (!form.registeredState) {
      errors.registeredState = lang === "en" ? "Please select a state/territory" : "请选择州/领地";
    }
    
    if (!form.registeredCountry) {
      errors.registeredCountry = lang === "en" ? "Please select a country" : "请选择国家";
    }
    
    if (!form.phone.trim()) {
      errors.phone = lang === "en" ? "Contact phone number is required" : "联系电话为必填项";
    } else if (form.registeredCountry === "Australia" && !validateAustralianMobile(form.phone)) {
      errors.phone = lang === "en" 
        ? "Please enter a valid Australian mobile (e.g., 04XX XXX XXX or +61 4XX XXX XXX)" 
        : "请输入有效的澳大利亚手机号码（例如：04XX XXX XXX 或 +61 4XX XXX XXX）";
    }
    
    if (!eftposIntegration) {
      errors.eftposIntegration = lang === "en" ? "Please select Yes or No" : "请选择是或否";
    }
    
    if (!alipayOption) {
      errors.alipayOption = lang === "en" ? "Please select an option from the dropdown" : "请从下拉列表中选择一个选项";
    }
    
    if (alipayOption === "other" && !alipayOther.trim()) {
      errors.alipayOther = lang === "en" ? "Please describe your payment provider" : "请描述您的支付提供商";
    }
    
    if (!readyBy.trim()) {
      errors.readyBy = lang === "en" ? "Expected deployment date is required" : "预期部署时间为必填项";
    }
    
    if (!heardAbout) {
      errors.heardAbout = lang === "en" ? "Please tell us how you heard about us" : "请告诉我们您是如何了解我们的";
    }
    
    if (heardAbout === "other" && !heardOther.trim()) {
      errors.heardOther = lang === "en" ? "Please describe how you heard about us" : "请描述您是如何了解我们的";
    }
    
    if (menuFiles.length === 0 && !menuSendLater) {
      errors.menuUpload = lang === "en" 
        ? "Please upload menu files or check 'I will send it later'" 
        : "请上传菜单文件或勾选\"我稍后再发送\"";
    }
    
    if (!termsAgreed) {
      errors.terms = lang === "en" 
        ? "You must agree to the terms and conditions before submitting" 
        : "提交前您必须同意条款和条件";
    }

    // Validate required custom fields
    customFields.forEach((cf) => {
      if (cf.required) {
        const val = customFieldValues[cf.id];
        const isEmpty = !val || (Array.isArray(val) ? val.length === 0 : val.trim() === '');
        if (isEmpty) {
          const label = cf.label || cf.id.replace(/_/g, ' ');
          errors[cf.id] = lang === "en" ? `${label} is required` : `${label}为必填项`;
        }
      }
    });

    // Remove validation errors for fields not enabled by the form template
    if (formFields.length > 0) {
      const fieldIdMap: Record<string, string> = {
        email: 'contact_email',
        ownerName: 'contact_name',
        phone: 'contact_phone',
        quoteNumber: 'quote_number',
        businessName: 'business_name',
        abn: 'abn',
        registeredAddress: 'registered_address',
        registeredSuburb: 'registered_suburb',
        registeredPostcode: 'registered_postcode',
        registeredState: 'registered_state',
        registeredCountry: 'registered_country',
        eftposIntegration: 'eftpos_integration',
        alipayOption: 'alipay_option',
        alipayOther: 'alipay_option',
        readyBy: 'ready_by',
        heardAbout: 'heard_about',
        heardOther: 'heard_about',
        menuUpload: 'menu_files',
      };
      Object.keys(errors).forEach(key => {
        const fieldId = fieldIdMap[key];
        if (fieldId && !isFieldEnabled(fieldId)) {
          delete errors[key];
        }
      });
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const errorCount = Object.keys(errors).length;
      setError(
        lang === "en" 
          ? `Please fix ${errorCount} error${errorCount === 1 ? '' : 's'} above before submitting` 
          : `提交前请修正上述 ${errorCount} 个错误`
      );
      
      // Scroll to first error
      setTimeout(() => {
        const firstErrorField = document.querySelector('.error');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      return;
    }

    setLoading(true);
  
    try {
      const formData = {
        token: token,
        contact_email: form.email,
        contact_name: form.ownerName,
        contact_phone: form.phone,
        messaging_app_type: form.messagingAppType || null,
        messaging_app_id: form.messagingAppId || null,
        quote_number: form.quoteNumber,
        business_name: form.businessName,
        abn: form.abn,
        registered_address: form.registeredAddress,
        registered_suburb: form.registeredSuburb,
        registered_postcode: form.registeredPostcode,
        registered_state: form.registeredState,
        registered_country: form.registeredCountry,
        eftpos_integration: eftposIntegration,
        alipay_option: alipayOption,
        alipay_other: alipayOption === "other" ? alipayOther : null,
        ready_by: readyBy,
        heard_about: heardAbout,
        heard_other: heardAbout === "other" ? heardOther : null,
        menu_files: menuFiles.map(file => ({
          filename: file.name,
          // Note: You'll need to convert files to base64 for actual upload
          // For now, just send filename
          mime_type: file.type
        })),
        menu_send_later: menuSendLater,
        notes: form.notes,
        custom_fields: Object.keys(customFieldValues).length > 0 ? customFieldValues : undefined,
      };

      console.log('=== SUBMITTING FORM DATA ===');
      console.log('Form Data:', JSON.stringify(formData, null, 2));
      
      const response = await axios.post(
        `${API_BASE_URL}/registration/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('=== API RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
      console.log('Full Response:', response);

      if (response.data.success) {
        setLoading(false);
        setIsSliding(true);
        setTimeout(() => {
          setShowThankYou(true);
          setIsSliding(false);
        }, 600);
      } else {
        throw new Error(response.data.error || "Submission failed");
      }
    } catch (err: any) {
      setLoading(false);
      console.error("=== SUBMISSION ERROR ===");
      console.error("Error:", err);
      console.error("Error Response:", err.response);
      console.error("Error Status:", err.response?.status);
      console.error("Error Data:", JSON.stringify(err.response?.data, null, 2));
      
      if (err.response?.status === 409) {
        setError(lang === "zh" ? "此令牌已被使用。每个注册链接只能使用一次。" : "This token has already been used. Each registration link can only be used once.");
      } else if (err.response?.status === 400) {
        setError(lang === "zh" ? "无效或过期的令牌。" : "Invalid or expired token.");
      } else {
        setError(
          err.response?.data?.error || 
          (lang === "zh" ? "提交失败。请稍后重试。" : "Submission failed. Please try again later.")
        );
      }
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-lang-dropdown]')) {
        setShowLangMenu(false);
      }
    };
    if (showLangMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showLangMenu]);



  if (showThankYou) {
    return (
      <>
        <GlobalStyle />
        <Container className="slide-in">
          <ThankYouCard lang={lang} />
        </Container>
      </>
    );
  }
  
  // Show white screen if no token (will redirect immediately)
  if (!router.isReady || !token) {
    return (
      <>
        <GlobalStyle />
        <Container />
      </>
    );
  }
  
  // Show loading UI while validating token
  if (tokenValidating) {
    return (
      <>
        <GlobalStyle />
        <Container>
          <Card>
            <StatusCard>
              <Spinner />
              <StatusTitle $type="loading">
                {lang === "zh" ? "验证注册链接" : "Validating Registration Link"}
              </StatusTitle>
              <StatusMessage>
                {lang === "zh" ? "请稍候，我们正在验证您的注册令牌..." : "Please wait while we verify your registration token..."}
              </StatusMessage>
            </StatusCard>
          </Card>
        </Container>
      </>
    );
  }
  
  // Show error if token is invalid
  if (!tokenValid || tokenError) {
    return (
      <>
        <GlobalStyle />
        <Container>
          <Card>
            <StatusCard>
              <WarningIconWrapper>
                <WarningIconCircle />
                <WarningIconSvg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M12 2L2 20h20L12 2z" 
                    fill="#FFA500"
                    stroke="#FF6B00"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M12 9v4M12 17h.01" 
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </WarningIconSvg>
              </WarningIconWrapper>
              <StatusTitle $type="error">
                {lang === "zh" ? "无效的注册链接" : "Invalid Registration Link"}
              </StatusTitle>
              <StatusMessage>
                {tokenError}
              </StatusMessage>
              <InfoBox>
                {lang === "zh" 
                  ? "如果您认为这是错误，请联系管理员获取新的注册链接。"
                  : "If you believe this is an error, please contact the admin for a new registration link."}
              </InfoBox>
            </StatusCard>
          </Card>
        </Container>
      </>
    );
  }
  
  return (
    <>
      <GlobalStyle />
      <Container className={isSliding ? "slide-out" : ""}>
        <Card>
          <>
            <HeroHeader>
              <LangDropdownFixed>
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
              </LangDropdownFixed>

              <LogosContainer>
                <Image 
                  src="/logos/vend88.png" 
                  alt="Vend88"
                  width={150}
                  height={50}
                  style={{ height: '50px', width: 'auto', maxWidth: '40vw' }}
                  onError={() => console.error('Vend88 logo failed to load')}
                />
                <LogoDivider />
                <Image 
                  src="/logos/pospal.png" 
                  alt="PosPal"
                  width={180}
                  height={70}
                  style={{ height: '70px', width: 'auto', maxWidth: '40vw' }}
                  onError={() => console.error('PosPal logo failed to load')}
                />
              </LogosContainer>

              <HeroTitle>{dict.onboarding.title}</HeroTitle>
              
              <HeroSubtitle>
                {lang === "en" 
                  ? "Please fill out this registration form to begin your onboarding process" 
                  : "请填写此注册表以开始您的入驻流程"}
              </HeroSubtitle>
            </HeroHeader>

            <Grid>
              <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <Field style={{ display: isFieldEnabled('contact_email') ? undefined : 'none' }}>
                        <Label>{dict.onboarding.email} *</Label>
                        <Input 
                          className={fieldErrors.email ? "error" : ""}
                          type="email" 
                          name="email" 
                          value={form.email} 
                          onChange={handleChange} 
                          placeholder={dict.onboarding.emailPlaceholder} 
                        />
                        {fieldErrors.email && (
                          <ErrorText>
                            <span>⚠</span>
                            {fieldErrors.email}
                          </ErrorText>
                        )}
                      </Field>

                      <Field style={{ display: isFieldEnabled('contact_name') ? undefined : 'none' }}>
                        <Label>{dict.onboarding.fullName} *</Label>
                        <Input 
                          className={fieldErrors.ownerName ? "error" : ""}
                          name="ownerName" 
                          value={form.ownerName} 
                          onChange={handleChange} 
                          placeholder={dict.onboarding.fullNamePlaceholder} 
                        />
                        {fieldErrors.ownerName && (
                          <ErrorText>
                            <span>⚠</span>
                            {fieldErrors.ownerName}
                          </ErrorText>
                        )}
                      </Field>

                      <Field style={{ display: isFieldEnabled('contact_phone') ? undefined : 'none' }}>
                        <Label>{dict.onboarding.phone} *</Label>
                        <Input 
                          className={fieldErrors.phone ? "error" : ""}
                          name="phone" 
                          value={form.phone} 
                          onChange={handleChange} 
                          placeholder={dict.onboarding.phonePlaceholder}
                          type="tel"
                        />
                        {fieldErrors.phone && (
                          <ErrorText>
                            <span>⚠</span>
                            {fieldErrors.phone}
                          </ErrorText>
                        )}
                        <div style={{ fontSize: 11, color: "#789", marginTop: 4 }}>
                          {lang === "en" ? "Australian mobile: 04XX XXX XXX or +61 4XX XXX XXX" : "澳大利亚手机: 04XX XXX XXX 或 +61 4XX XXX XXX"}
                        </div>
                      </Field>

                      <Field style={{ display: isFieldEnabled('messaging_app_type') ? undefined : 'none' }}>
                        <Label>{lang === "en" ? "Messaging App Contact (Optional)" : "即时通讯联系方式（可选）"}</Label>
                        <Select 
                          name="messagingAppType"
                          value={form.messagingAppType || ""}
                          onChange={handleChange}
                        >
                          <option value="">{lang === "en" ? "-- Select app --" : "-- 选择应用 --"}</option>
                          <option value="wechat">{lang === "en" ? "WeChat ID" : "微信号"}</option>
                          <option value="whatsapp">{lang === "en" ? "WhatsApp Number" : "WhatsApp 号码"}</option>
                        </Select>
                        
                        {form.messagingAppType && (
                          <Input 
                            name="messagingAppId"
                            value={form.messagingAppId || ""}
                            onChange={handleChange}
                            placeholder={
                              form.messagingAppType === "wechat" 
                                ? (lang === "en" ? "Enter your WeChat ID" : "输入您的微信号")
                                : (lang === "en" ? "Enter your WhatsApp number" : "输入您的 WhatsApp 号码")
                            }
                            style={{ marginTop: 8 }}
                          />
                        )}
                        <div style={{ fontSize: 11, color: "#789", marginTop: 4 }}>
                          {lang === "en" 
                            ? "Provide an alternative way for us to reach you" 
                            : "提供其他联系方式以便我们与您联系"}
                        </div>
                      </Field>

                      <Field style={{ display: isFieldEnabled('quote_number') ? undefined : 'none' }}>
                        <Label>{dict.onboarding.quoteNumber} *</Label>
                        <Input 
                          className={fieldErrors.quoteNumber ? "error" : ""}
                          name="quoteNumber" 
                          value={form.quoteNumber} 
                          onChange={handleChange} 
                          placeholder={dict.onboarding.quoteNumberPlaceholder} 
                        />
                        {fieldErrors.quoteNumber && (
                          <ErrorText>
                            <span>⚠</span>
                            {fieldErrors.quoteNumber}
                          </ErrorText>
                        )}
                      </Field>

                      <Field style={{ display: isFieldEnabled('business_name') ? undefined : 'none' }}>
                        <Label>{dict.onboarding.businessName} *</Label>
                        <Input 
                          className={fieldErrors.businessName ? "error" : ""}
                          name="businessName" 
                          value={form.businessName} 
                          onChange={handleChange} 
                          placeholder={dict.onboarding.businessNamePlaceholder} 
                        />
                        {fieldErrors.businessName && (
                          <ErrorText>
                            <span>⚠</span>
                            {fieldErrors.businessName}
                          </ErrorText>
                        )}
                        <div style={{ fontSize: 12, color: "#567", marginTop: 6 }}>
                          {dict.onboarding.businessNameHint}
                        </div>
                      </Field>

                      <Field style={{ display: isFieldEnabled('abn') ? undefined : 'none' }}>
                        <Label>{dict.onboarding.abn} *</Label>
                        <Input 
                          className={fieldErrors.abn ? "error" : ""}
                          name="abn" 
                          value={form.abn} 
                          onChange={handleChange} 
                          placeholder={dict.onboarding.abnPlaceholder}
                        />
                        {fieldErrors.abn && (
                          <ErrorText>
                            <span>⚠</span>
                            {fieldErrors.abn}
                          </ErrorText>
                        )}
                        <div style={{ fontSize: 11, color: "#789", marginTop: 4 }}>
                          {lang === "en" ? "11-digit number" : "11 位数字"}
                        </div>
                      </Field>

                      <div style={{ fontSize: "12px", color: "#567", marginBottom: "8px", display: (isFieldEnabled('registered_address') || isFieldEnabled('registered_suburb') || isFieldEnabled('registered_postcode') || isFieldEnabled('registered_state') || isFieldEnabled('registered_country')) ? undefined : 'none' }}>
                        {dict.onboarding.storeAddressHint}
                      </div>
                      
                      <Field style={{ display: isFieldEnabled('registered_address') ? undefined : 'none' }}>
                        <Label>{lang === "en" ? "Street Address" : "街道地址"} *</Label>
                        <Input 
                          className={fieldErrors.registeredAddress ? "error" : ""}
                          name="registeredAddress" 
                          value={form.registeredAddress} 
                          onChange={handleChange} 
                          placeholder={lang === "en" ? "e.g., 123 Main Street" : "例如：123 主街"} 
                        />
                        {fieldErrors.registeredAddress && (
                          <ErrorText>
                            <span>⚠</span>
                            {fieldErrors.registeredAddress}
                          </ErrorText>
                        )}
                      </Field>

                      <Field style={{ display: isFieldEnabled('registered_suburb') ? undefined : 'none' }}>
                        <Label>{lang === "en" ? "City / Suburb" : "城市/郊区"} *</Label>
                        <Input 
                          className={fieldErrors.registeredSuburb ? "error" : ""}
                          name="registeredSuburb" 
                          value={form.registeredSuburb} 
                          onChange={handleChange} 
                          placeholder={lang === "en" ? "e.g., Sydney" : "例如：悉尼"} 
                        />
                        {fieldErrors.registeredSuburb && (
                          <ErrorText>
                            <span>⚠</span>
                            {fieldErrors.registeredSuburb}
                          </ErrorText>
                        )}
                      </Field>

                      <div style={{ display: (isFieldEnabled('registered_postcode') || isFieldEnabled('registered_state')) ? "grid" : "none", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }} className="mobile-stack">
                        <Field>
                          <Label>{lang === "en" ? "Postcode" : "邮政编码"} *</Label>
                          <Input 
                            className={fieldErrors.registeredPostcode ? "error" : ""}
                            name="registeredPostcode" 
                            value={form.registeredPostcode} 
                            onChange={handleChange} 
                            placeholder={lang === "en" ? "e.g., 2000" : "例如：2000"}
                            maxLength={4}
                          />
                          {fieldErrors.registeredPostcode && (
                            <ErrorText>
                              <span>⚠</span>
                              {fieldErrors.registeredPostcode}
                            </ErrorText>
                          )}
                        </Field>

                        <Field>
                          <Label>{dict.onboarding.registeredState} *</Label>
                          <Select 
                            className={fieldErrors.registeredState ? "error" : ""}
                            name="registeredState" 
                            value={form.registeredState} 
                            onChange={handleChange}
                          >
                            <option value="">{dict.onboarding.registeredStatePlaceholder}</option>
                            <option value="NSW">NSW</option>
                            <option value="VIC">VIC</option>
                            <option value="QLD">QLD</option>
                            <option value="WA">WA</option>
                            <option value="SA">SA</option>
                            <option value="TAS">TAS</option>
                            <option value="ACT">ACT</option>
                            <option value="NT">NT</option>
                          </Select>
                          {fieldErrors.registeredState && (
                            <ErrorText>
                              <span>⚠</span>
                              {fieldErrors.registeredState}
                            </ErrorText>
                          )}
                        </Field>
                      </div>

                      <Field style={{ display: isFieldEnabled('registered_country') ? undefined : 'none' }}>
                        <Label>{dict.onboarding.registeredCountry} *</Label>
                        <Select 
                          className={fieldErrors.registeredCountry ? "error" : ""}
                          name="registeredCountry" 
                          value={form.registeredCountry} 
                          onChange={handleChange}
                        >
                          <option value="Australia">Australia</option>
                        </Select>
                        {fieldErrors.registeredCountry && (
                          <ErrorText>
                            <span>⚠</span>
                            {fieldErrors.registeredCountry}
                          </ErrorText>
                        )}
                      </Field>

                      <Field style={{ display: isFieldEnabled('eftpos_integration') ? undefined : 'none' }}>
                        {/* Reference Images */}
                        <ReferenceImagesContainer>
                          <ReferenceImageWrapper>
                            <ReferenceImage>
                              <Image 
                                src="/pictures/tyro-card.png" 
                                alt="Tyro Card Terminal"
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </ReferenceImage>
                            <ImageCaption>
                              {lang === "en" ? "Tyro Card Terminal" : "Tyro 刷卡终端"}
                            </ImageCaption>
                          </ReferenceImageWrapper>
                          
                          <ReferenceImageWrapper>
                            <ReferenceImage>
                              <Image 
                                src="/pictures/tyro-payments.png" 
                                alt="Tyro Payment Process"
                                fill
                                style={{ objectFit: 'cover' }
                                }
                              />
                            </ReferenceImage>
                            <ImageCaption>
                              {lang === "en" ? "Payment Process" : "支付流程"}
                            </ImageCaption>
                          </ReferenceImageWrapper>
                        </ReferenceImagesContainer>
                        <Label>{dict.onboarding.eftposIntegration} *</Label>
                        <div style={{ display: "flex", gap: 12, marginTop: 6, paddingLeft: 4 }}>
                          <label style={{ cursor: 'pointer' }}>
                            <input 
                              type="radio" 
                              name="eftpos" 
                              checked={eftposIntegration === "yes"} 
                              onChange={() => {
                                setEftposIntegration("yes");
                                if (fieldErrors.eftposIntegration) {
                                  setFieldErrors(prev => {
                                    const next = { ...prev };
                                    delete next.eftposIntegration;
                                    return next;
                                  });
                                }
                              }} 
                            /> {lang === "en" ? "Yes" : "是"}
                          </label>
                          <label style={{ cursor: 'pointer' }}>
                            <input 
                              type="radio" 
                              name="eftpos" 
                              checked={eftposIntegration === "no"} 
                              onChange={() => {
                                setEftposIntegration("no");
                                if (fieldErrors.eftposIntegration) {
                                  setFieldErrors(prev => {
                                    const next = { ...prev };
                                    delete next.eftposIntegration;
                                    return next;
                                  });
                                }
                              }} 
                            /> {lang === "en" ? "No" : "否"}
                          </label>
                        </div>
                        {fieldErrors.eftposIntegration && (
                          <ErrorText>
                            <span>⚠</span>
                            {fieldErrors.eftposIntegration}
                          </ErrorText>
                        )}
                        <div style={{ fontSize: 12, color: "#567", marginTop: 6 }}>
                          {dict.onboarding.eftposHint}
                        </div>
                        
                        
                      </Field>
                      {/* Alipay/WeChat Payment Reference Images */}
                      <Field style={{ display: isFieldEnabled('alipay_option') ? undefined : 'none' }}>
                        <ReferenceImagesContainer>
                          <ReferenceImageWrapper>
                            <ReferenceImage>
                              <Image 
                                src="/pictures/alipay-payment.png" 
                                alt="Alipay Payment"
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </ReferenceImage>
                            <ImageCaption>
                              {lang === "en" ? "Alipay Payment" : "支付宝支付"}
                            </ImageCaption>
                          </ReferenceImageWrapper>
                          
                          <ReferenceImageWrapper>
                            <ReferenceImage>
                              <Image 
                                src="/pictures/wechat-payment.png" 
                                alt="WeChat Pay"
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </ReferenceImage>
                            <ImageCaption>
                              {lang === "en" ? "WeChat Pay" : "微信支付"}
                            </ImageCaption>
                          </ReferenceImageWrapper>
                        </ReferenceImagesContainer>
                      </Field>

                      <Field style={{ display: isFieldEnabled('alipay_option') ? undefined : 'none' }}>
                        <Label>{dict.onboarding.alipayPayment} *</Label>
                        <Select 
                          className={fieldErrors.alipayOption ? "error" : ""}
                          value={alipayOption} 
                          onChange={(e) => {
                            setAlipayOption(e.target.value);
                            if (fieldErrors.alipayOption) {
                              setFieldErrors(prev => {
                                const next = { ...prev };
                                delete next.alipayOption;
                                return next;
                              });
                            }
                          }}
                        >
                          <option value="">-- select --</option>
                          <option value="open">{dict.onboarding.alipayOpen}</option>
                          <option value="not-interested">{dict.onboarding.alipayNotInterested}</option>
                          <option value="superpay">{dict.onboarding.alipaySuperpay}</option>
                          <option value="royalpay">{dict.onboarding.alipayRoyalpay}</option>
                          <option value="other">{dict.onboarding.alipayOther}</option>
                        </Select>
                        {fieldErrors.alipayOption && (
                          <ErrorText>
                            <span>⚠</span>
                            {fieldErrors.alipayOption}
                          </ErrorText>
                        )}
                        {alipayOption === "other" && (
                          <>
                            <Input 
                              className={fieldErrors.alipayOther ? "error" : ""}
                              name="alipayOther" 
                              value={alipayOther} 
                              onChange={(e) => {
                                setAlipayOther(e.target.value);
                                if (fieldErrors.alipayOther) {
                                  setFieldErrors(prev => {
                                    const next = { ...prev };
                                    delete next.alipayOther;
                                    return next;
                                  });
                                }
                              }} 
                              placeholder={lang === "en" ? "Please describe" : "请描述"}
                              style={{ marginTop: 8 }} 
                            />
                            {fieldErrors.alipayOther && (
                              <ErrorText>
                                <span>⚠</span>
                                {fieldErrors.alipayOther}
                              </ErrorText>
                            )}
                          </>
                        )}
                      </Field>

                      <Field style={{ display: isFieldEnabled('ready_by') ? undefined : 'none' }}>
                        <Label>{dict.onboarding.readyBy} *</Label>
                        <Textarea 
                          className={fieldErrors.readyBy ? "error" : ""}
                          name="readyBy" 
                          value={readyBy} 
                          onChange={(e) => {
                            setReadyBy(e.target.value);
                            if (fieldErrors.readyBy) {
                              setFieldErrors(prev => {
                                const next = { ...prev };
                                delete next.readyBy;
                                return next;
                              });
                            }
                          }} 
                          placeholder={dict.onboarding.readyByPlaceholder} 
                        />
                        {fieldErrors.readyBy && (
                          <ErrorText>
                            <span>⚠</span>
                            {fieldErrors.readyBy}
                          </ErrorText>
                        )}
                        <div style={{ fontSize: 12, color: "#567", marginTop: 6 }}>
                          {dict.onboarding.readyByHint}
                        </div>
                      </Field>

                      <Field style={{ display: isFieldEnabled('heard_about') ? undefined : 'none' }}>
                        <Label>{dict.onboarding.heardAbout} *</Label>
                        <Select 
                          className={fieldErrors.heardAbout ? "error" : ""}
                          value={heardAbout} 
                          onChange={(e) => {
                            setHeardAbout(e.target.value);
                            if (fieldErrors.heardAbout) {
                              setFieldErrors(prev => {
                                const next = { ...prev };
                                delete next.heardAbout;
                                return next;
                              });
                            }
                          }}
                        >
                          <option value="">-- select --</option>
                          <option value="friend">{dict.onboarding.heardFriend}</option>
                          <option value="google">{dict.onboarding.heardGoogle}</option>
                          <option value="wechat">{dict.onboarding.heardWechat}</option>
                          <option value="saw">{dict.onboarding.heardSaw}</option>
                          <option value="other">{dict.onboarding.heardOther}</option>
                        </Select>
                        {fieldErrors.heardAbout && (
                          <ErrorText>
                            <span>⚠</span>
                            {fieldErrors.heardAbout}
                          </ErrorText>
                        )}
                        {heardAbout === "other" && (
                          <>
                            <Input 
                              className={fieldErrors.heardOther ? "error" : ""}
                              name="heardOther" 
                              value={heardOther} 
                              onChange={(e) => {
                                setHeardOther(e.target.value);
                                if (fieldErrors.heardOther) {
                                  setFieldErrors(prev => {
                                    const next = { ...prev };
                                    delete next.heardOther;
                                    return next;
                                  });
                                }
                              }} 
                              placeholder={lang === "en" ? "Please describe" : "请描述"}
                              style={{ marginTop: 8 }} 
                            />
                            {fieldErrors.heardOther && (
                              <ErrorText>
                                <span>⚠</span>
                                {fieldErrors.heardOther}
                              </ErrorText>
                            )}
                          </>
                        )}
                      </Field>

                      <Field style={{ display: isFieldEnabled('menu_files') ? undefined : 'none' }}>
                        <Label>{dict.onboarding.menuUpload} *</Label>
                        <div style={{ fontSize: 12, color: "#567", marginBottom: 8 }}>
                          {dict.onboarding.menuUploadHint}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <FileUploadButton className={menuSendLater ? "disabled" : ""}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="17 8 12 3 7 8"></polyline>
                              <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            {lang === "en" ? "Choose Files" : "选择文件"}
                            <input 
                              type="file" 
                              accept=".pdf,.doc,.docx,.xls,.xlsx" 
                              onChange={handleFileChange}
                              disabled={menuSendLater}
                              multiple
                            />
                          </FileUploadButton>
                          <div style={{ fontSize: 11, color: "#789", fontStyle: "italic" }}>
                            {dict.onboarding.multipleFilesNote}
                          </div>
                          
                          {menuFiles.length > 0 && (
                            <FileList>
                              {menuFiles.map((file, index) => (
                                <FileItem key={index}>
                                  <span>📄 {file.name}</span>
                                  <RemoveFileButton onClick={() => removeFile(index)}>✕</RemoveFileButton>
                                </FileItem>
                              ))}
                            </FileList>
                          )}

                          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <input 
                              type="checkbox" 
                              checked={menuSendLater} 
                              onChange={(e) => {
                                setMenuSendLater(e.target.checked);
                                if (e.target.checked) setMenuFiles([]);
                                if (fieldErrors.menuUpload) {
                                  setFieldErrors(prev => {
                                    const next = { ...prev };
                                    delete next.menuUpload;
                                    return next;
                                  });
                                }
                              }} 
                            />
                            <span style={{ fontSize: 14 }}>{dict.onboarding.menuSendLater}</span>
                          </label>
                          {fieldErrors.menuUpload && (
                            <ErrorText>
                              <span>⚠</span>
                              {fieldErrors.menuUpload}
                            </ErrorText>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: "#567", marginTop: 6 }}>
                          {dict.onboarding.menuContactInfo}
                        </div>
                      </Field>

                      <Field style={{ display: isFieldEnabled('notes') ? undefined : 'none' }}>
                        <Label>{dict.onboarding.notes}</Label>
                        <Textarea name="notes" value={form.notes} onChange={handleChange} placeholder={dict.onboarding.notesPlaceholder} />
                      </Field>

                      {/* Custom Fields */}
                      {customFields.length > 0 && customFields.map((cf) => {
                        const fieldId = cf.id;
                        const label = cf.label || fieldId.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
                        const isRequired = cf.required;
                        const value = customFieldValues[fieldId] ?? '';

                        return (
                          <Field key={fieldId}>
                            <Label>{label}{isRequired ? ' *' : ''}</Label>
                            {cf.type === 'textarea' ? (
                              <Textarea
                                value={typeof value === 'string' ? value : ''}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleCustomFieldChange(fieldId, e.target.value)}
                                placeholder={label}
                              />
                            ) : cf.type === 'select' && cf.options ? (
                              <Select
                                value={typeof value === 'string' ? value : ''}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleCustomFieldChange(fieldId, e.target.value)}
                              >
                                <option value="">{lang === 'zh' ? '请选择...' : 'Please select...'}</option>
                                {cf.options.map((opt: string) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </Select>
                            ) : cf.type === 'multiple_choice' && cf.options ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {cf.options.map((opt: string) => {
                                  const selected = Array.isArray(value) ? value : [];
                                  const isMulti = cf.choiceMode === 'multiple';
                                  return (
                                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                      <input
                                        type={isMulti ? 'checkbox' : 'radio'}
                                        name={fieldId}
                                        checked={isMulti ? selected.includes(opt) : value === opt}
                                        onChange={() => {
                                          if (isMulti) {
                                            const next = selected.includes(opt)
                                              ? selected.filter((v: string) => v !== opt)
                                              : [...selected, opt];
                                            handleCustomFieldChange(fieldId, next);
                                          } else {
                                            handleCustomFieldChange(fieldId, opt);
                                          }
                                        }}
                                      />
                                      <span>{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            ) : (
                              <Input
                                type={cf.type === 'number' ? 'number' : cf.type === 'date' ? 'date' : cf.type === 'email' ? 'email' : 'text'}
                                value={typeof value === 'string' ? value : ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCustomFieldChange(fieldId, e.target.value)}
                                placeholder={label}
                              />
                            )}
                            {fieldErrors[fieldId] && (
                              <ErrorText>
                                <span>⚠</span>
                                {fieldErrors[fieldId]}
                              </ErrorText>
                            )}
                          </Field>
                        );
                      })}
                </div>

                {/* Terms and Submit - Outside accordion */}
                <Field>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input 
                      type="checkbox" 
                      checked={termsAgreed} 
                      onChange={(e) => {
                        setTermsAgreed(e.target.checked);
                        if (fieldErrors.terms) {
                          setFieldErrors(prev => {
                            const next = { ...prev };
                            delete next.terms;
                            return next;
                          });
                        }
                      }} 
                    />
                    <span>{dict.onboarding.termsAgreed} *</span>
                  </label>
                  {fieldErrors.terms && (
                    <ErrorText>
                      <span>⚠</span>
                      {fieldErrors.terms}
                    </ErrorText>
                  )}
                </Field>
                {/* Need Help Card */}
                <CardBox style={{ marginBottom: '1rem' }}>
                  <Label>{dict.onboarding.helpTitle}</Label>
                  <div style={{ color: "#567", fontSize: 0.95 + "rem", marginTop: 6 }}>{dict.onboarding.helpText}</div>
                </CardBox>
                <SubmitWrapper>
                  <Submit type="submit" disabled={loading}>
                    {loading ? (
                      <span>{dict.onboarding.sending}</span>
                    ) : (
                      <>
                        <span>{dict.onboarding.submit}</span>
                        <span style={{ marginLeft: '8px' }}>→</span>
                      </>
                    )}
                  </Submit>
                  
                  {!loading && termsAgreed && (
                    <SubmitHint>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {lang === "en" ? "Ready to submit" : "准备提交"}
                    </SubmitHint>
                  )}
                  
                  {error && (
                    <ErrorText style={{ justifyContent: 'center', marginTop: 0 }}>
                      <span>⚠</span>
                      {error}
                    </ErrorText>
                  )}
                </SubmitWrapper>
              </Form>

              <Side>
                {/* Side content removed - now above form */}
              </Side>
            </Grid>
          </>
        </Card>
      </Container>
    </>
  );
}
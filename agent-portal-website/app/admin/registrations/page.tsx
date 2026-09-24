"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import axios from "axios";
import { useAuth, isPortalUser, hasPermission, canSeeAllTeams } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../../components/layout/AdminSidebar";
import { getApiUrl, API_CONFIG } from "@/config/api";
import { FormFieldSelector, type FormField } from "@/components/FormFieldSelector";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%);
  display: flex;
  padding-top: 65px;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0rem 2rem 2rem 2rem;
  margin-left: 320px;
  overflow-y: auto;
  
  @media (max-width: 968px) {
    padding: 0 1rem 1rem 1rem;
    margin-left: 0;
  }
`;

const ContentHeader = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 968px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1.5rem;
  }
`;

const HeaderLeft = styled.div``;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 0.5rem;
  
  @media (max-width: 968px) {
    font-size: 1.5rem;
  }
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: #5c6b7a;
  
  @media (max-width: 968px) {
    font-size: 0.875rem;
  }
`;

const GenerateButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 968px) {
    width: 100%;
    padding: 1rem;
    font-size: 0.9375rem;
  }
`;

const RefreshButton = styled.button`
  padding: 0.625rem;
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  height: 42px;
  
  &:hover:not(:disabled) {
    background: #eff6ff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    transition: transform 0.6s ease-in-out;
  }
  
  &:disabled svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @media (max-width: 968px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
  }
`;

const SearchFilterContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  animation: slideDown 0.4s ease;
  transition: all 0.3s ease;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
      max-height: 0;
    }
    to {
      opacity: 1;
      transform: translateY(0);
      max-height: 200px;
    }
  }
  
  @media (max-width: 968px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus {
    outline: none;
    border-color: #1a237e;
    box-shadow: 0 0 0 4px rgba(26, 35, 126, 0.12);
    transform: translateY(-2px);
  }
  
  &:hover {
    border-color: #1a237e;
    box-shadow: 0 2px 8px rgba(26, 35, 126, 0.08);
  }
  
  &::placeholder {
    color: #9ca3af;
    transition: color 0.2s ease;
  }
  
  &:focus::placeholder {
    color: #d1d5db;
  }
  
  @media (max-width: 968px) {
    width: 100%;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  background: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #1a237e;
    box-shadow: 0 0 0 4px rgba(26, 35, 126, 0.12);
    transform: translateY(-2px);
  }
  
  &:hover {
    border-color: #1a237e;
    box-shadow: 0 2px 8px rgba(26, 35, 126, 0.08);
  }
  
  @media (max-width: 968px) {
    width: 100%;
  }
`;

const ClearButton = styled.button`
  padding: 0.75rem 1rem;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  animation: slideInRight 0.3s ease;
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  &:hover {
    background: #d1d5db;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  @media (max-width: 968px) {
    width: 100%;
  }
`;

const TabContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  overflow: hidden;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 2px solid #e0e7ef;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  background: ${p => p.$active ? 'rgba(26, 35, 126, 0.05)' : 'transparent'};
  color: ${p => p.$active ? '#1a237e' : '#5c6b7a'};
  font-size: 1rem;
  font-weight: ${p => p.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  white-space: nowrap;
  
  &:hover {
    background: rgba(26, 35, 126, 0.05);
    color: #1a237e;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  ${p => p.$active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: #3b82f6;
      animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
      from {
        width: 0;
        left: 50%;
      }
      to {
        width: 100%;
        left: 0;
      }
    }
  `}
  
  @media (max-width: 968px) {
    padding: 0.875rem 0.5rem;
    font-size: 0.75rem;
  }
`;

const TabContent = styled.div`
  padding: 2rem;
  animation: fadeIn 0.4s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @media (max-width: 968px) {
    padding: 1rem;
    overflow-x: auto;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @media (max-width: 968px) {
    min-width: 800px;
  }
`;

const Thead = styled.thead`
  background: #f7faff;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0a3655;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 968px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid #e0e7ef;
  transition: background 0.2s ease;
  animation: fadeInRow 0.3s ease;
  
  @keyframes fadeInRow {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  &:hover {
    background: #f7faff;
  }
`;

const Td = styled.td`
  padding: 1rem;
  color: #0a3655;
  font-size: 0.9375rem;
  
  @media (max-width: 968px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.8125rem;
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: default;
  
  &:hover {
    transform: scale(1.05);
  }
  
  ${p => {
    switch(p.$status) {
      case 'pending':
        return 'background: #fef3c7; color: #92400e;';
      case 'submitted':
        return 'background: #dbeafe; color: #1e40af;';
      case 'approved':
        return 'background: #d1fae5; color: #065f46;';
      case 'rejected':
        return 'background: #fee2e2; color: #991b1b;';
      case 'expired':
        return 'background: #e5e7eb; color: #374151;';
      case 'cancelled':
        return 'background: #fee2e2; color: #991b1b;';
      default:
        return 'background: #e5e7eb; color: #374151;';
    }
  }}
`;

const ActionButton = styled.button<{ $variant?: 'approve' | 'reject' | 'view' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-right: 0.5rem;
  white-space: nowrap;
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
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  &:active::before {
    width: 200px;
    height: 200px;
  }
  
  ${p => {
    switch(p.$variant) {
      case 'approve':
        return `
          background: #d1fae5;
          color: #065f46;
          &:hover { 
            background: #a7f3d0;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
          }
          &:active {
            transform: translateY(0);
          }
        `;
      case 'reject':
        return `
          background: #fee2e2;
          color: #991b1b;
          &:hover { 
            background: #fecaca;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
          }
          &:active {
            transform: translateY(0);
          }
        `;
      default:
        return `
          background: #dbeafe;
          color: #1e40af;
          &:hover { 
            background: #bfdbfe;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
          }
          &:active {
            transform: translateY(0);
          }
        `;
    }
  }}
  
  @media (max-width: 968px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
    margin-right: 0.25rem;
    margin-bottom: 0.25rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #5c6b7a;
  animation: fadeInScale 0.5s ease;
  
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.6;
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const EmptyText = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #0a3655;
`;

const EmptySubtext = styled.p`
  font-size: 0.9375rem;
  color: #9ca3af;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
`;

const Modal = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${p => p.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  @media (max-width: 968px) {
    padding: 1.5rem;
    max-width: calc(100vw - 2rem);
    max-height: 95vh;
    border-radius: 12px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1rem;
  
  @media (max-width: 968px) {
    font-size: 1.25rem;
  }
`;

const ModalText = styled.p`
  color: #5c6b7a;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const LinkBox = styled.div`
  background: #f7faff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e0e7ef;
  margin-bottom: 1rem;
  word-break: break-all;
  font-family: monospace;
  font-size: 0.875rem;
  color: #1a237e;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const ModalButton = styled.button<{ $primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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
  
  &:active::before {
    width: 300px;
    height: 300px;
  }
  
  ${p => p.$primary ? `
    background: #3b82f6;
    color: white;
    &:hover {
      background: #2563eb;
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35);
    }
    &:active {
      transform: translateY(0) scale(0.98);
    }
  ` : `
    background: #e5e7eb;
    color: #374151;
    &:hover {
      background: #d1d5db;
      transform: translateY(-1px);
    }
    &:active {
      transform: translateY(0) scale(0.98);
    }
  `}
  
  @media (max-width: 968px) {
    width: 100%;
    padding: 0.875rem 1.5rem;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 1.25rem;
  color: #5c6b7a;
  padding: 4rem;
`;

const DetailSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  
  @media (max-width: 968px) {
    font-size: 1rem;
  }
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
  
  @media (max-width: 968px) {
    font-size: 0.75rem;
  }
`;

const DetailValue = styled.div`
  font-size: 1rem;
  color: #0a3655;
  line-height: 1.6;
  word-break: break-word;
  
  @media (max-width: 968px) {
    font-size: 0.9375rem;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e7ef;
  margin: 1.5rem 0;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  @media (max-width: 968px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }
`;

const EditInput = styled.input`
  padding: 0.75rem;
  border: 1.5px solid rgba(43,123,227,0.2);
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0a3655;
  background: white;
  transition: all 200ms ease;

  &:focus {
    outline: none;
    border-color: #2b7be3;
    box-shadow: 0 0 0 3px rgba(43,123,227,0.1);
  }
`;

const EditTextarea = styled.textarea`
  padding: 0.75rem;
  border: 1.5px solid rgba(43,123,227,0.2);
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0a3655;
  background: white;
  resize: vertical;
  font-family: inherit;
  transition: all 200ms ease;

  &:focus {
    outline: none;
    border-color: #2b7be3;
    box-shadow: 0 0 0 3px rgba(43,123,227,0.1);
  }
`;

const EditSelect = styled.select`
  padding: 0.75rem;
  border: 1.5px solid rgba(43,123,227,0.2);
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0a3655;
  background: white;
  cursor: pointer;
  transition: all 200ms ease;

  &:focus {
    outline: none;
    border-color: #2b7be3;
    box-shadow: 0 0 0 3px rgba(43,123,227,0.1);
  }
`;

const FileDownloadLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: rgba(43,123,227,0.05);
  border: 1px solid rgba(43,123,227,0.15);
  border-radius: 8px;
  margin-top: 0.5rem;
  color: #1e40af;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:first-child {
    margin-top: 0;
  }

  &:hover {
    background: rgba(43,123,227,0.1);
    border-color: rgba(43,123,227,0.25);
    transform: translateX(2px);
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const FileName = styled.span`
  font-weight: 500;
  font-size: 0.9375rem;
`;

const FileMetadata = styled.span`
  font-size: 0.75rem;
  color: #5c6b7a;
  margin-left: 0.5rem;
`;

const DownloadButton = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1e40af;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(43,123,227,0.1);
  }
`;

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

// Helper function to format file size
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

interface Registration {
  _id?: string; // MongoDB ID from backend
  id: string;
  form_id?: string; // Backend API uses form_id (e.g., V88-REG-001)
  token?: string;
  // The customer-facing form link, built by the backend from where the form is
  // actually hosted. Never rebuild it here from the portal's own origin.
  link?: string | null;
  generated_by?: string;
  generatedBy?: string; // Keep for backwards compatibility
  // Attribution: the portal user credited with this registration, and their team
  owner_user_id?: string | null;
  attributed_to_name?: string;
  team_id?: string | null;
  team_name?: string;
  generated_at?: string;
  generatedAt?: string; // Keep for backwards compatibility
  expires_at?: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'expired' | 'cancelled';
  linked_customer_id?: string;
  linkedCustomerId?: string; // Keep for backwards compatibility
  // Contact Information
  contact_email?: string;
  contactEmail?: string; // Keep for backwards compatibility
  contact_name?: string;
  owner_name?: string;
  ownerName?: string; // Keep for backwards compatibility
  contact_phone?: string;
  contactPhone?: string; // Keep for backwards compatibility
  messaging_app_id?: string;
  messagingAppId?: string; // Keep for backwards compatibility
  messaging_app_type?: string;
  messagingAppType?: string; // Keep for backwards compatibility
  // Business Information
  quoteNumber?: string;
  business_name?: string;
  businessName?: string; // Keep for backwards compatibility
  abn?: string;
  // Registered Address
  registeredAddress?: string;
  registeredSuburb?: string;
  registeredPostcode?: string;
  registeredState?: string;
  registeredCountry?: string;
  // Payment & Integration
  eftpos_integration?: string;
  eftposIntegration?: string; // Keep for backwards compatibility
  alipay_option?: string;
  alipayOption?: string; // Keep for backwards compatibility
  alipay_other?: string;
  alipayOther?: string; // Keep for backwards compatibility
  // Additional Information
  readyBy?: string;
  heard_about?: string;
  heardAbout?: string; // Keep for backwards compatibility
  heard_other?: string;
  heardOther?: string; // Keep for backwards compatibility
  menu_files?: any[];
  menuFiles?: (string | { filename: string; url: string; size?: number; uploadedAt?: string })[]; // Keep for backwards compatibility
  menu_send_later?: boolean;
  menuSendLater?: boolean; // Keep for backwards compatibility
  notes?: string;
  submitted_at?: string;
  submittedAt?: string; // Keep for backwards compatibility
  approved_at?: string;
  approvedAt?: string; // Keep for backwards compatibility
  approved_by?: string;
  approvedBy?: string; // Keep for backwards compatibility
  rejection_reason?: string;
  rejectionReason?: string; // Keep for backwards compatibility
  rejected_at?: string;
  rejectedAt?: string; // Keep for backwards compatibility
  rejected_by?: string;
  rejectedBy?: string; // Keep for backwards compatibility
  cancelled_at?: string;
  cancelledAt?: string; // Keep for backwards compatibility
  cancelled_by?: string;
  cancelledBy?: string; // Keep for backwards compatibility
  created_at?: string;
}

// Sortable Header Component
const SortableHeader = styled.th<{ $active?: boolean }>`
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0a3655;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;
  
  ${p => p.$active && `
    background: #e0e7ef;
  `}
  
  &:hover {
    background: #e0e7ef;
  }
  
  @media (max-width: 968px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
  }
`;

const SortIcon = styled.span<{ $direction?: 'asc' | 'desc' }>`
  display: inline-block;
  margin-left: 0.5rem;
  font-size: 0.75rem;
  opacity: ${p => p.$direction ? 1 : 0.3};
  transition: opacity 0.2s ease;
  
  ${SortableHeader}:hover & {
    opacity: 1;
  }
`;

const CheckboxTh = styled.th`
  padding: 1rem;
  width: 50px;
  
  @media (max-width: 968px) {
    padding: 0.75rem 0.5rem;
    width: 40px;
  }
`;

const CheckboxTd = styled.td`
  padding: 1rem;
  width: 50px;
  
  @media (max-width: 968px) {
    padding: 0.75rem 0.5rem;
    width: 40px;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3b82f6;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.2);
  }
  
  &:active {
    transform: scale(0.9);
  }
  
  &:checked {
    animation: checkBounce 0.3s ease;
  }
  
  @keyframes checkBounce {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e0e7ef;
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

const PaginationInfo = styled.div`
  color: #5c6b7a;
  font-size: 0.875rem;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const PageButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e0e7ef;
  border-radius: 6px;
  background: ${p => p.$active ? '#3b82f6' : 'white'};
  color: ${p => p.$active ? 'white' : '#0a3655'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${p => p.$disabled ? 0.5 : 1};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
    background: ${p => p.$active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(59, 130, 246, 0.1)'};
    transform: translate(-50%, -50%);
    transition: width 0.4s, height 0.4s;
  }
  
  &:active:not(:disabled)::before {
    width: 100px;
    height: 100px;
  }
  
  &:hover:not(:disabled) {
    background: ${p => p.$active ? '#2563eb' : '#f7faff'};
    border-color: ${p => p.$active ? '#2563eb' : '#3b82f6'};
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0) scale(0.95);
  }
`;

const BulkActionBar = styled.div<{ $show: boolean }>`
  display: ${p => p.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #f7faff;
  border-bottom: 1px solid #e0e7ef;
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

const BulkActionText = styled.span`
  color: #0a3655;
  font-size: 0.875rem;
  font-weight: 500;
`;

const BulkActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 968px) {
    width: 100%;
    flex-direction: column;
  }
`;

export default function RegistrationsPage() {
  const router = useRouter();
  const { token, role, isLoading, userEmail, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'submitted' | 'all'>('submitted');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);
  // Track whether the registrations data is currently being fetched
  const [isDataLoading, setIsDataLoading] = useState(false);
  // Track whether we've completed the initial registrations fetch
  const [hasFetched, setHasFetched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<string>('all'); // all, NSW, VIC, QLD, etc.
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [registrationsToReject, setRegistrationsToReject] = useState<string[]>([]);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [registrationToRevoke, setRegistrationToRevoke] = useState<string | null>(null);
  
  // Store admin names for display
  const [adminNames, setAdminNames] = useState<{ [email: string]: string }>({});
  
  // Form field selector state
  const [showFormFieldSelector, setShowFormFieldSelector] = useState(false);
  const [selectedFormFields, setSelectedFormFields] = useState<FormField[]>([]);
  const [isGeneratingWithFields, setIsGeneratingWithFields] = useState(false);

  // Template picker state
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [templateInitialFields, setTemplateInitialFields] = useState<FormField[] | undefined>(undefined);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined);
  
  // Table enhancements state
  const [sortField, setSortField] = useState<string>('submittedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    } else if (!isLoading && token && !isPortalUser(role)) {
      router.push("/login");
    }
  }, [token, role, isLoading, router]);

  // Fetch registrations from API (currently using mock data)
  useEffect(() => {
    if (token) {
      fetchRegistrationData();
    }
  }, [token]);

  // Reset to first page when switching tabs
  useEffect(() => {
    setCurrentPage(1);
    setSelectedRows(new Set());
  }, [activeTab]);

  const fetchRegistrationData = async () => {
    setIsDataLoading(true);
    try {
      
      // Fetch from new backend API
      const response = await axios.get('/api/registration/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });


      const registrations = response.data.data || response.data.registrations || [];
      if (response.data.status_code === 200 || response.data.success || Array.isArray(registrations)) {
        
        
        if (registrations.length > 0) {
        }
        
        // Normalize the data - ensure id field is set
        const normalizedRegistrations = registrations.map((reg: any) => {
          const normalizedId = reg.id || reg._id || reg.form_id || `temp_${Math.random()}`;
          
          return {
            ...reg,
            id: normalizedId,
            // Ensure status has a value
            status: reg.status || 'pending',
            // Normalize field names from snake_case to camelCase for filtering
            registeredState: reg.registeredState || reg.registered_state,
            registeredSuburb: reg.registeredSuburb || reg.registered_suburb,
            registeredPostcode: reg.registeredPostcode || reg.registered_postcode,
            registeredAddress: reg.registeredAddress || reg.registered_address,
            businessName: reg.businessName || reg.business_name,
            contactEmail: reg.contactEmail || reg.contact_email,
            contactPhone: reg.contactPhone || reg.contact_phone,
            ownerName: reg.ownerName || reg.owner_name || reg.contact_name,
            submittedAt: reg.submittedAt || reg.submitted_at,
            linkedCustomerId: reg.linkedCustomerId || reg.linked_customer_id,
          };
        });
        
        
        setAllRegistrations(normalizedRegistrations);
        setRegistrations(normalizedRegistrations);
      } else {
        console.error('[Fetch] Failed to fetch registrations:', response.data);
        showToast('Failed to fetch registrations', 'error');
      }
    } catch (error: any) {
      console.error('[Fetch] Error fetching registrations:', error);
      console.error('[Fetch] Error response:', error.response?.data);
      showToast('Failed to fetch registrations', 'error');
    } finally {
      setIsDataLoading(false);
      setHasFetched(true);
    }
  };

  const handleViewDetails = (registration: Registration) => {
    router.push(`/admin/registrations/${registration.id}`);
  };

  const handleGenerateForm = async () => {
    // Show template picker modal — fetch available templates first
    setShowTemplatePicker(true);
    setLoadingTemplates(true);
    try {
      const res = await axios.get('/api/form-templates/list', {
        params: { status: 'active' },
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableTemplates(res.data.data || []);
    } catch {
      setAvailableTemplates([]);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handlePickTemplate = (template: any) => {
    // Use the template's fields as initial fields in the FormFieldSelector
    setTemplateInitialFields(template.fields);
    setSelectedTemplateId(template.id);
    setShowTemplatePicker(false);
    setShowFormFieldSelector(true);
  };

  const handleCreateFromScratch = () => {
    setTemplateInitialFields(undefined);
    setSelectedTemplateId(undefined);
    setShowTemplatePicker(false);
    setShowFormFieldSelector(true);
  };

  const handleFormFieldsConfirm = async (selectedFields: FormField[]) => {
    setIsGeneratingWithFields(true);
    try {
      // Real API integration
      const adminEmail = adminProfile?.email || userEmail || 'admin@vend88.com';
      // Use API proxy to avoid CORS issues
      const apiUrl = '/api/registration/generate';
      

      const response = await axios.post(
        apiUrl,
        { 
          admin_email: adminEmail,
          template_id: selectedTemplateId || null,
          form_fields: selectedFields.map(f => ({
            id: f.id,
            label: f.label,
            required: f.required,
            type: f.type
          }))
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      
      if (response.data.success && response.data.data) {
        // Remove /register path to use root URL which doesn't have redirect issues
        const link = response.data.data.link.replace('/register?', '?');
        setGeneratedLink(link);
        setSelectedTemplateId(undefined);
        setShowFormFieldSelector(false);
        setShowGenerateModal(true);
        
        // Refresh the list after a short delay to ensure backend has saved the data
        setTimeout(() => {
          fetchRegistrationData();
        }, 500);
      } else {
        console.error('âŒ Response indicates failure:', response.data);
        const errorMessage = response.data.error || response.data.message || 'Failed to generate form';
        showToast(errorMessage, 'error');
      }
    } catch (error: any) {
      console.error('=== Generate Form Error ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error message:', error.message);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message
        || 'Failed to generate form. Please try again.';
      
      showToast(`Failed to generate form: ${errorMessage}`, 'error');
    } finally {
      setIsGeneratingWithFields(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsLinkCopied(true);
    setTimeout(() => {
      setIsLinkCopied(false);
    }, 2000);
  };

  const handleCopyRegistrationLink = (registration: Registration) => {
    // Only the backend knows where the onboarding form is hosted, so the link it
    // sends is the one that gets copied. Building one from window.location here
    // produced a portal URL with no page behind it - a 404 for the customer.
    if (registration.link) {
      navigator.clipboard.writeText(registration.link);
      showToast(lang === 'zh' ? '链接已复制到剪贴板' : 'Link copied to clipboard', 'success');
    } else {
      showToast(lang === 'zh' ? '无法获取链接' : 'Unable to retrieve link', 'error');
    }
  };

  const handleReject = (ids: string | string[]) => {
    setRegistrationsToReject(Array.isArray(ids) ? ids : [ids]);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (registrationsToReject.length === 0) return;

    const ids = registrationsToReject;
    const reason = rejectionReason || 'Rejected by admin';
    const failures: string[] = [];

    // One request per registration: the endpoint takes a single id, and a bulk
    // reject used to send only the first of the selected rows while clearing the
    // whole selection - so the rest silently stayed submitted.
    for (const id of ids) {
      try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_REJECT.replace(':id', id)), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ token: token || '', reason }),
        });
        if (!response.ok) failures.push(id);
      } catch (error) {
        console.error('Failed to reject registration', id, error);
        failures.push(id);
      }
    }

    setShowRejectModal(false);
    setRegistrationsToReject([]);
    setRejectionReason('');
    await fetchRegistrationData();

    const succeeded = ids.length - failures.length;
    if (succeeded > 0) {
      showToast(
        ids.length === 1
          ? (lang === 'zh' ? '已拒绝' : 'Rejected successfully')
          : `${succeeded} ${lang === 'zh' ? '条已拒绝' : 'rejected'}`,
        'success'
      );
    }
    if (failures.length > 0) {
      showToast(
        `${failures.length} ${lang === 'zh' ? '条拒绝失败' : 'failed to reject'}`,
        'error'
      );
    }
  };

  const handleRevoke = (id: string) => {
    setRegistrationToRevoke(id);
    setShowRevokeModal(true);
  };

  const handleConfirmRevoke = async () => {
    if (!registrationToRevoke) return;
    
    const id = registrationToRevoke;
    try {
      // Attempt real backend revoke first, sending admin token in request body
      const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_REVOKE.replace(':id', id));
      const payload = { token, reason: '' };
      let result: any = null;

      try {
        const axiosResp = await axios.post(apiUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        result = axiosResp.data;
      } catch (err: any) {
        // No mock fallback: the mock's in-memory list never holds real ids, so it
        // always answered "Registration not found" and hid the actual failure.
        console.error('[Revoke] Backend call failed:', err);
        result = err.response?.data || { error: 'Failed to reach the server' };
      }

      if (result && (result.success || result.status_code === 200)) {
        // Refresh the list
        fetchRegistrationData();
        showToast(lang === 'zh' ? '已撤销！' : 'Revoked successfully!', 'success');
        // Close revoke modal
        setShowRevokeModal(false);
        setRegistrationToRevoke(null);
      } else {
        showToast(result?.message || result?.error || 'Failed to revoke', 'error');
      }
    } catch (error) {
      console.error('Failed to revoke registration:', error);
      showToast('Failed to revoke. Please try again.', 'error');
    }
  };

  // Bulk revoke multiple registration links (used by BulkActionBar)
  const handleBulkRevoke = async (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const successes: string[] = [];
    const failures: { id: string; error?: any }[] = [];

    for (const id of ids) {
      try {
        const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_REVOKE.replace(':id', id));
        const payload = { token, reason: '' };
        let result: any = null;

        try {
          const axiosResp = await axios.post(apiUrl, payload, {
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          result = axiosResp.data;
        } catch (err: any) {
          console.error(`[BulkRevoke] Backend call failed for ${id}:`, err);
          result = err.response?.data || { error: 'Failed to reach the server' };
        }

        if (result && (result.success || result.status_code === 200)) {
          successes.push(id);
        } else {
          failures.push({ id, error: result });
        }
      } catch (err) {
        failures.push({ id, error: err });
      }
    }

    // Refresh once after processing all
    fetchRegistrationData();

    if (successes.length > 0) {
      showToast(`${successes.length} ${lang === 'zh' ? '条链接已撤销' : 'links revoked'}`, 'success');
    }
    if (failures.length > 0) {
      console.error('[BulkRevoke] failures:', failures);
      showToast(`${failures.length} ${lang === 'zh' ? '条链接撤销失败' : 'links failed'}`, 'error');
    }
  };

  // Helper functions to get values from either field format
  const getBusinessName = (reg: Registration) => reg.business_name || reg.businessName || '';
  const getContactEmail = (reg: Registration) => reg.contact_email || reg.contactEmail || '';
  const getContactName = (reg: Registration) => reg.contact_name || reg.owner_name || reg.ownerName || '';
  const getContactPhone = (reg: Registration) => reg.contact_phone || reg.contactPhone || '';
  const getSubmittedAt = (reg: Registration) => reg.submitted_at || reg.submittedAt || '';
  const getGeneratedBy = (reg: Registration) => reg.generated_by || reg.generatedBy || '';
  const getGeneratedAt = (reg: Registration) => reg.generated_at || reg.generatedAt || reg.created_at || '';
  
  // Helper to get admin name from email
  const getAdminName = (email: string) => {
    if (!email) return '';
    
    // Check if we have this admin's name in our cache
    if (adminNames[email]) {
      return adminNames[email];
    }
    
    // If it's the current admin, use their profile
    if (adminProfile && (email === adminProfile.email || email === userEmail)) {
      const fullName = `${adminProfile.first_name} ${adminProfile.last_name}`.trim();
      if (fullName) {
        // Cache it for future use
        setAdminNames(prev => ({ ...prev, [email]: fullName }));
        return fullName;
      }
    }
    
    // Fallback: extract name from email (e.g., john.doe@vend88.com -> John Doe)
    const namePart = email.split('@')[0];
    const formattedName = namePart
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
    
    return formattedName;
  };

  const filteredRegistrations = allRegistrations.filter(reg => {
    // Filter by tab status
    if (activeTab === 'pending' && reg.status !== 'pending') return false;
    if (activeTab === 'submitted' && reg.status !== 'submitted') return false;
    
    // Filter by state
    if (filterState !== 'all' && reg.registeredState !== filterState) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesBusinessName = getBusinessName(reg).toLowerCase().includes(query);
      const matchesEmail = getContactEmail(reg).toLowerCase().includes(query);
      const matchesOwner = getContactName(reg).toLowerCase().includes(query);
      const matchesPhone = getContactPhone(reg).toLowerCase().includes(query);
      const matchesABN = reg.abn?.toLowerCase().includes(query);
      const matchesFormId = (reg.form_id || reg.id)?.toLowerCase().includes(query);
      
      if (!matchesBusinessName && !matchesEmail && !matchesOwner && !matchesPhone && !matchesABN && !matchesFormId) {
        return false;
      }
    }
    
    return true;
  });

  // Sort registrations
  const sortedRegistrations = [...filteredRegistrations].sort((a, b) => {
    let aVal: any = '';
    let bVal: any = '';
    
    switch (sortField) {
      case 'businessName':
        aVal = getBusinessName(a);
        bVal = getBusinessName(b);
        break;
      case 'contactEmail':
        aVal = getContactEmail(a);
        bVal = getContactEmail(b);
        break;
      case 'submittedAt':
        const aSubmitted = getSubmittedAt(a);
        const bSubmitted = getSubmittedAt(b);
        aVal = aSubmitted ? new Date(aSubmitted).getTime() : 0;
        bVal = bSubmitted ? new Date(bSubmitted).getTime() : 0;
        break;
      case 'status':
        aVal = a.status || '';
        bVal = b.status || '';
        break;
      default:
        return 0;
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRegistrations = sortedRegistrations.slice(startIndex, startIndex + itemsPerPage);
  
  // Debug logging

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRows(new Set()); // Clear selection when changing pages
  };

  // Handle row selection
  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(paginatedRegistrations.map(reg => reg.id));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  // Check if all visible rows are selected
  const allSelected = paginatedRegistrations.length > 0 && 
    paginatedRegistrations.every(reg => selectedRows.has(reg.id));

  // If auth is loading show a full-page loader to avoid flashing before redirect.
  if (isLoading) {
    return (
      <Container>
        <LoadingText>Loading...</LoadingText>
      </Container>
    );
  }

  if (!token || !isPortalUser(role)) {
    return null;
  }

  if (!hasPermission(adminProfile, 'manage_registration_forms') && !hasPermission(adminProfile, 'manage_form_templates')) {
    router.push('/admin');
    return null;
  }

  // Approval provisions a real account and stays with administrators; team
  // users generate and revoke their own links only.
  const canApprove = hasPermission(adminProfile, 'manage_registrations');
  const showTeamColumn = canSeeAllTeams(adminProfile);

  return (
    <MainLayout currentPage={lang === "zh" ? "注册管理" : "Registration Management"} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <ContentHeader>
            <HeaderLeft>
              <PageTitle>{lang === "zh" ? "注册管理" : "Registration Management"}</PageTitle>
              <PageDescription>
                {lang === "zh"
                  ? "生成注册表单并管理客户注册审批"
                  : "Generate registration forms and manage customer approvals"}
              </PageDescription>
            </HeaderLeft>
            <GenerateButton onClick={handleGenerateForm} disabled={isGenerating}>
              <PlusIcon />
              {isGenerating 
                ? (lang === "zh" ? "生成中..." : "Generating...") 
                : (lang === "zh" ? "生成新表单" : "Generate New Form")}
            </GenerateButton>
          </ContentHeader>

          <SearchFilterContainer>
            <SearchInput
              type="text"
              placeholder={lang === "zh" ? "搜索店铺名称、邮箱、联系人、电话或ABN..." : "Search store name, email, contact, phone or ABN..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FilterSelect value={filterState} onChange={(e) => setFilterState(e.target.value)}>
              <option value="all">{lang === "zh" ? "所有州" : "All States"}</option>
              <option value="NSW">NSW</option>
              <option value="VIC">VIC</option>
              <option value="QLD">QLD</option>
              <option value="WA">WA</option>
              <option value="SA">SA</option>
              <option value="TAS">TAS</option>
              <option value="ACT">ACT</option>
              <option value="NT">NT</option>
            </FilterSelect>
            {(searchQuery || filterState !== 'all') && (
              <ClearButton onClick={() => { setSearchQuery(''); setFilterState('all'); }}>
                {lang === "zh" ? "清除" : "Clear"}
              </ClearButton>
            )}
            <RefreshButton onClick={() => fetchRegistrationData()} disabled={isDataLoading} title={isDataLoading ? (lang === "zh" ? "刷新中..." : "Refreshing...") : (lang === "zh" ? "刷新" : "Refresh")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 10 18.995 7.26822 17.3662 5.63824C15.7373 4.00827 13.4864 3 11 3C6.02944 3 2 7.02944 2 12C2 16.9706 6.02944 21 11 21C15.1031 21 18.5649 18.2543 19.6482 14.5M21 10V4M21 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </RefreshButton>
          </SearchFilterContainer>

          <TabContainer>
            <TabButtons>
              <TabButton $active={activeTab === 'submitted'} onClick={() => setActiveTab('submitted')}>
                {lang === "zh" ? "待审批" : "Pending Approval"} ({allRegistrations.filter(r => r.status === 'submitted').length})
              </TabButton>
              <TabButton $active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
                {lang === "zh" ? "未填写" : "Not Filled"} ({allRegistrations.filter(r => r.status === 'pending').length})
              </TabButton>
              <TabButton $active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
                {lang === "zh" ? "全部" : "All"} ({allRegistrations.length})
              </TabButton>
            </TabButtons>

            <TabContent>
              {(!hasFetched || isDataLoading) ? (
                <Table>
                  <Thead>
                    <Tr>
                      <CheckboxTh />
                      <Th>{lang === "zh" ? "店铺名称" : "Store Name"}</Th>
                      <Th>{lang === "zh" ? "联系邮箱" : "Contact Email"}</Th>
                      {showTeamColumn && <Th>{lang === "zh" ? "团队" : "Team"}</Th>}
                      <Th>{lang === "zh" ? "生成时间" : "Generated"}</Th>
                      <Th>{lang === "zh" ? "状态" : "Status"}</Th>
                      <Th>{lang === "zh" ? "操作" : "Actions"}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Tr key={`skeleton-${i}`}>
                        <CheckboxTd>
                          <div style={{ background: '#e9eef6', height: 18, width: 18, borderRadius: 4 }} />
                        </CheckboxTd>
                        <Td>
                          <div style={{ background: '#e9eef6', height: 16, width: '60%', borderRadius: 8 }} />
                        </Td>
                        <Td>
                          <div style={{ background: '#e9eef6', height: 16, width: '75%', borderRadius: 8 }} />
                        </Td>
                        <Td>
                          <div style={{ background: '#e9eef6', height: 16, width: '40%', borderRadius: 8 }} />
                        </Td>
                        <Td>
                          <div style={{ background: '#e9eef6', height: 24, width: 96, borderRadius: 12 }} />
                        </Td>
                        <Td>
                          <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ background: '#e9eef6', height: 32, width: 72, borderRadius: 8 }} />
                            <div style={{ background: '#e9eef6', height: 32, width: 72, borderRadius: 8 }} />
                            <div style={{ background: '#e9eef6', height: 32, width: 72, borderRadius: 8 }} />
                          </div>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : filteredRegistrations.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>
                    {searchQuery || filterState !== 'all' ? '🔍' : activeTab === 'submitted' ? '✅' : activeTab === 'pending' ? '📋' : '📋'}
                  </EmptyIcon>
                  <EmptyText>
                    {searchQuery || filterState !== 'all' 
                      ? (lang === "zh" ? "未找到匹配结果" : "No matching results")
                      : activeTab === 'submitted' 
                        ? (lang === "zh" ? "暂无待审批" : "No Pending Approvals")
                        : activeTab === 'pending'
                          ? (lang === "zh" ? "暂无未填写表单" : "No Unfilled Forms")
                          : (lang === "zh" ? "暂无记录" : "No Records")}
                  </EmptyText>
                  <EmptySubtext>
                    {searchQuery || filterState !== 'all'
                      ? (lang === "zh" 
                          ? "尝试调整您的搜索条件或筛选器以查找您要查找的内容"
                          : "Try adjusting your search terms or filters to find what you're looking for")
                      : activeTab === 'submitted' 
                        ? (lang === "zh" ? "目前没有需要审批的注册申请" : "There are currently no registrations awaiting approval")
                        : activeTab === 'pending'
                          ? (lang === "zh" ? "所有生成的表单都已填写完成" : "All generated forms have been completed")
                          : (lang === "zh" ? "点击上方按钮生成新的注册表单" : "Click the button above to generate a new registration form")}
                  </EmptySubtext>
                </EmptyState>
              ) : (
                <>
                  <BulkActionBar $show={selectedRows.size > 0}>
                    <BulkActionText>
                      {selectedRows.size} {lang === "zh" ? "已选择" : "selected"}
                    </BulkActionText>
                    <BulkActionButtons>
                      {/* No bulk approve: each approval needs its own login
                          credentials and customer decision, so approving is done
                          one registration at a time on its detail page. */}
                      {activeTab === 'submitted' && canApprove && (
                        <ActionButton $variant="reject" onClick={() => {
                          handleReject(Array.from(selectedRows));
                          setSelectedRows(new Set());
                        }}>
                          {lang === "zh" ? "拒绝所选" : "Reject Selected"}
                        </ActionButton>
                      )}
                      {activeTab === 'pending' && (
                        <ActionButton $variant="reject" onClick={async () => {
                          const ids = Array.from(selectedRows);
                          setSelectedRows(new Set());
                          await handleBulkRevoke(ids);
                        }}>
                          {lang === "zh" ? "撤销所选" : "Revoke Selected"}
                        </ActionButton>
                      )}
                      {activeTab === 'all' && (
                        <>
                          {canApprove && (
                          <ActionButton $variant="reject" onClick={() => {
                            const submittedIds = paginatedRegistrations
                              .filter(r => selectedRows.has(r.id) && r.status === 'submitted')
                              .map(r => r.id);
                            if (submittedIds.length > 0) handleReject(submittedIds);
                            setSelectedRows(new Set());
                          }}>
                            {lang === "zh" ? "拒绝已提交" : "Reject Submitted"}
                          </ActionButton>
                          )}
                          <ActionButton $variant="reject" onClick={() => {
                            const pendingIds = paginatedRegistrations
                              .filter(r => selectedRows.has(r.id) && r.status === 'pending')
                              .map(r => r.id);
                            pendingIds.forEach(id => handleRevoke(id));
                            setSelectedRows(new Set());
                          }}>
                            {lang === "zh" ? "撤销未填写" : "Revoke Pending"}
                          </ActionButton>
                        </>
                      )}
                    </BulkActionButtons>
                  </BulkActionBar>
                  
                  <Table>
                    <Thead>
                      <Tr>
                        <CheckboxTh>
                          <Checkbox
                            checked={allSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                        </CheckboxTh>
                        <SortableHeader 
                          $active={sortField === 'businessName'}
                          onClick={() => handleSort('businessName')}
                        >
                          {lang === "zh" ? "店铺名称" : "Store Name"}
                          <SortIcon $direction={sortField === 'businessName' ? sortDirection : undefined}>
                            {sortField === 'businessName' && sortDirection === 'asc' ? '↑' : '↓'}
                          </SortIcon>
                        </SortableHeader>
                        <SortableHeader 
                          $active={sortField === 'contactEmail'}
                          onClick={() => handleSort('contactEmail')}
                        >
                          {lang === "zh" ? "联系邮箱" : "Contact Email"}
                          <SortIcon $direction={sortField === 'contactEmail' ? sortDirection : undefined}>
                            {sortField === 'contactEmail' && sortDirection === 'asc' ? '↑' : '↓'}
                          </SortIcon>
                        </SortableHeader>
                        {showTeamColumn && <Th>{lang === "zh" ? "团队" : "Team"}</Th>}
                        <SortableHeader 
                          $active={sortField === 'submittedAt'}
                          onClick={() => handleSort('submittedAt')}
                        >
                          {lang === "zh" ? "生成时间" : "Generated"}
                          <SortIcon $direction={sortField === 'submittedAt' ? sortDirection : undefined}>
                            {sortField === 'submittedAt' && sortDirection === 'asc' ? '↑' : '↓'}
                          </SortIcon>
                        </SortableHeader>
                        <SortableHeader 
                          $active={sortField === 'status'}
                          onClick={() => handleSort('status')}
                        >
                          {lang === "zh" ? "状态" : "Status"}
                          <SortIcon $direction={sortField === 'status' ? sortDirection : undefined}>
                            {sortField === 'status' && sortDirection === 'asc' ? '↑' : '↓'}
                          </SortIcon>
                        </SortableHeader>
                        <Th>{lang === "zh" ? "操作" : "Actions"}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {paginatedRegistrations.map(reg => (
                      <Tr key={reg.id}>
                        <CheckboxTd>
                          <Checkbox
                            checked={selectedRows.has(reg.id)}
                            onChange={() => handleSelectRow(reg.id)}
                          />
                        </CheckboxTd>
                        <Td>{getBusinessName(reg) || '-'}</Td>
                        <Td>{getContactEmail(reg) || '-'}</Td>
                        {showTeamColumn && (
                          <Td>
                            <div>{reg.team_name || <span style={{ color: '#9ca3af' }}>Vend88</span>}</div>
                            {reg.attributed_to_name && (
                              <div style={{ fontSize: '0.8125rem', color: '#5c6b7a' }}>{reg.attributed_to_name}</div>
                            )}
                          </Td>
                        )}
                        <Td>
                          <div>{getGeneratedAt(reg) ? new Date(getGeneratedAt(reg)).toLocaleDateString() : '-'}</div>
                          <div style={{ fontSize: '0.8125rem', color: '#5c6b7a', marginTop: '0.25rem' }}>
                            {getGeneratedBy(reg) ? `By ${getAdminName(getGeneratedBy(reg))}` : '-'}
                          </div>
                        </Td>
                        <Td>
                          <StatusBadge $status={reg.status}>
                            {reg.status}
                          </StatusBadge>
                        </Td>
                        <Td>
                          {reg.status === 'submitted' && (
                            <>
                              <ActionButton $variant="view" onClick={() => handleViewDetails(reg)}>
                                {lang === "zh" ? "查看" : "View"}
                              </ActionButton>
                              {canApprove && (
                                <>
                                  {/* Approval needs the login credentials and the
                                      customer decision that only the detail page
                                      collects, so this opens that page's dialog
                                      rather than trying to approve from here. */}
                                  <ActionButton $variant="approve" onClick={() => router.push(`/admin/registrations/${reg.id}?approve=1`)}>
                                    {lang === "zh" ? "审核批准" : "Review & approve"}
                                  </ActionButton>
                                  <ActionButton $variant="reject" onClick={() => handleReject(reg.id)}>
                                    {lang === "zh" ? "拒绝" : "Reject"}
                                  </ActionButton>
                                </>
                              )}
                            </>
                          )}
                          {reg.status === 'pending' && (
                            <>
                              <ActionButton $variant="view" onClick={() => handleCopyRegistrationLink(reg)}>
                                {lang === "zh" ? "复制链接" : "Copy Link"}
                              </ActionButton>
                              <ActionButton $variant="reject" onClick={() => handleRevoke(reg.id)}>
                                {lang === "zh" ? "撤销链接" : "Revoke Link"}
                              </ActionButton>
                            </>
                          )}
                          {reg.status === 'approved' && (
                            <ActionButton $variant="view" onClick={() => handleViewDetails(reg)}>
                              {lang === "zh" ? "查看" : "View"}
                            </ActionButton>
                          )}
                          {reg.status === 'rejected' && (
                            <ActionButton $variant="view" onClick={() => handleViewDetails(reg)}>
                              {lang === "zh" ? "查看" : "View"}
                            </ActionButton>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                
                {filteredRegistrations.length > 0 && (
                  <PaginationContainer>
                    <PaginationInfo>
                      {lang === "zh" 
                        ? `显示 ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, sortedRegistrations.length)} 条,共 ${sortedRegistrations.length} 条`
                        : `Showing ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, sortedRegistrations.length)} of ${sortedRegistrations.length}`
                      }
                    </PaginationInfo>
                    <PaginationControls>
                      <PageButton 
                        onClick={() => handlePageChange(currentPage - 1)}
                        $disabled={currentPage === 1}
                        disabled={currentPage === 1}
                      >
                        {lang === "zh" ? "上一页" : "Previous"}
                      </PageButton>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PageButton
                              key={page}
                              $active={page === currentPage}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </PageButton>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} style={{ padding: '0 0.25rem' }}>...</span>;
                        }
                        return null;
                      })}
                      
                      <PageButton 
                        onClick={() => handlePageChange(currentPage + 1)}
                        $disabled={currentPage === totalPages}
                        disabled={currentPage === totalPages}
                      >
                        {lang === "zh" ? "下一页" : "Next"}
                      </PageButton>
                    </PaginationControls>
                  </PaginationContainer>
                )}
              </>
              )}
            </TabContent>
          </TabContainer>
        </MainContent>
      </Container>

      <Modal $show={showGenerateModal} onClick={() => setShowGenerateModal(false)}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "表单生成成功" : "Form Generated Successfully"}</ModalTitle>
          <ModalText>
            {lang === "zh" ? "请将以下链接发送给客户。此链接仅可使用一次。" : "Send the following link to your customer. This link can only be used once."}
          </ModalText>
          <LinkBox>{generatedLink}</LinkBox>
          <ModalActions>
            <ModalButton onClick={() => setShowGenerateModal(false)}>
              {lang === "zh" ? "关闭" : "Close"}
            </ModalButton>
            <ModalButton $primary onClick={handleCopyLink} style={isLinkCopied ? { background: '#10b981' } : {}}>
              {isLinkCopied ? <SaveIcon /> : <CopyIcon />}
              {isLinkCopied 
                ? (lang === "zh" ? "已复制!" : "Copied!") 
                : (lang === "zh" ? "复制链接" : "Copy Link")}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Reject Modal - Independent */}
      {showRejectModal && (
        <Modal $show={showRejectModal} onClick={() => setShowRejectModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <ModalTitle>
              {registrationsToReject.length > 1
                ? (lang === 'zh' ? `拒绝 ${registrationsToReject.length} 条注册` : `Reject ${registrationsToReject.length} registrations`)
                : (lang === 'zh' ? '拒绝注册' : 'Reject Registration')}
            </ModalTitle>
            <ModalText>
              {/* One reason covers the whole selection - the rows are rejected together. */}
              {lang === 'zh' 
                ? '请输入拒绝原因(可选):'
                : 'Enter rejection reason (optional):'}
            </ModalText>
            <EditTextarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={lang === 'zh' ? '拒绝原因...' : 'Rejection reason...'}
              rows={3}
              style={{ width: '100%', marginBottom: '1.5rem' }}
            />
            <ModalActions>
              <ModalButton onClick={() => {
                setShowRejectModal(false);
                setRegistrationsToReject([]);
                setRejectionReason('');
              }}>
                {lang === 'zh' ? '取消' : 'Cancel'}
              </ModalButton>
              <ModalButton $primary onClick={handleConfirmReject} style={{ background: '#ef4444' }}>
                {lang === 'zh' ? '确认拒绝' : 'Confirm Reject'}
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}

      {/* Revoke Confirmation Modal - Independent */}
      {showRevokeModal && (
        <Modal $show={showRevokeModal} onClick={() => setShowRevokeModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <ModalTitle>{lang === 'zh' ? '撤销注册链接' : 'Revoke Registration Link'}</ModalTitle>
            <ModalText>
              {lang === 'zh' 
                ? '确定要撤销此注册链接吗?撤销后该链接将无法使用。'
                : 'Are you sure you want to revoke this registration link? Once revoked, the link cannot be used.'}
            </ModalText>
            <ModalActions>
              <ModalButton onClick={() => {
                setShowRevokeModal(false);
                setRegistrationToRevoke(null);
              }}>
                {lang === 'zh' ? '取消' : 'Cancel'}
              </ModalButton>
              <ModalButton $primary onClick={handleConfirmRevoke} style={{ background: '#ef4444' }}>
                {lang === 'zh' ? '确认撤销' : 'Confirm Revoke'}
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}

      {/* Template Picker Modal */}
      {showTemplatePicker && (
        <Modal $show={showTemplatePicker} onClick={() => setShowTemplatePicker(false)}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <ModalTitle>{lang === 'zh' ? '选择表单模板' : 'Choose a Form Template'}</ModalTitle>
            <ModalText style={{ marginBottom: '1.5rem' }}>
              {lang === 'zh'
                ? '选择已保存的模板快速生成表单,或从头创建新表单。'
                : 'Pick a saved template to generate quickly, or create a form from scratch.'}
            </ModalText>

            {/* Create from Scratch option */}
            <div
              onClick={handleCreateFromScratch}
              style={{
                padding: '1rem 1.25rem',
                border: '2px dashed #e0e7ef',
                borderRadius: '12px',
                cursor: 'pointer',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#1a237e';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(26,35,126,0.03)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#e0e7ef';
                (e.currentTarget as HTMLDivElement).style.background = 'transparent';
              }}
            >
              <span style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: '#1a237e', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', fontWeight: 700, flexShrink: 0,
              }}>+</span>
              <div>
                <div style={{ fontWeight: 700, color: '#0a3655', fontSize: '0.9375rem' }}>
                  {lang === 'zh' ? 'ä»Ž头创建' : 'Create from Scratch'}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#5c6b7a' }}>
                  {lang === 'zh' ? '手动选择所有表单字段' : 'Manually select all form fields'}
                </div>
              </div>
            </div>

            {/* Template list */}
            {loadingTemplates ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#5c6b7a' }}>
                {lang === 'zh' ? '加载模板...' : 'Loading templates...'}
              </div>
            ) : availableTemplates.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {availableTemplates.map((tpl: any) => (
                  <div
                    key={tpl.id}
                    onClick={() => handlePickTemplate(tpl)}
                    style={{
                      padding: '1rem 1.25rem',
                      border: '2px solid #e0e7ef',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = '#1a237e';
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(26,35,126,0.03)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = '#e0e7ef';
                      (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: '#0a3655', fontSize: '0.9375rem' }}>
                        {tpl.name}
                      </span>
                      <span style={{
                        fontSize: '0.6875rem', fontWeight: 700, color: '#5c6b7a',
                        background: '#f3f4f6', padding: '0.15rem 0.5rem', borderRadius: '6px',
                      }}>
                        v{tpl.version}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#5c6b7a', marginBottom: '0.5rem' }}>
                      {tpl.description || (lang === 'zh' ? '无描述' : 'No description')}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                      <span>{tpl.fields?.length || 0} {lang === 'zh' ? '个字段' : 'fields'}</span>
                      <span>
                        {tpl.visibility === 'all'
                          ? (lang === 'zh' ? '所有人可见' : 'Visible to all')
                          : tpl.visibility === 'admin_only'
                          ? (lang === 'zh' ? '仅管理员' : 'Admin only')
                          : (lang === 'zh' ? '指定角色' : 'Specific roles')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af', fontSize: '0.875rem' }}>
                {lang === 'zh' ? '暂无已保存的模板' : 'No saved templates available'}
              </div>
            )}

            <ModalActions style={{ marginTop: '1.5rem' }}>
              <ModalButton onClick={() => setShowTemplatePicker(false)}>
                {lang === 'zh' ? '取消' : 'Cancel'}
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}

      {/* Form Field Selector Modal */}
      <FormFieldSelector
        isOpen={showFormFieldSelector}
        onClose={() => setShowFormFieldSelector(false)}
        onConfirm={handleFormFieldsConfirm}
        isLoading={isGeneratingWithFields}
        initialFields={templateInitialFields}
      />
    </MainLayout>
  );
}

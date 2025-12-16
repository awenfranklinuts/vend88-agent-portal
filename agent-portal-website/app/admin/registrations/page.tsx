"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../../components/layout/AdminSidebar";
import { getApiUrl, API_CONFIG } from "@/config/api";
import * as MockAPI from "@/lib/mockRegistrationApi";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%);
  display: flex;
  padding-top: 65px;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0rem 2rem 2rem 2rem;
  margin-left: 280px;
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

const SkeletonBox = styled.div<{ width?: string; height?: string; margin?: string }>`
  height: ${p => p.height || '16px'};
  width: ${p => p.width || '100%'};
  margin: ${p => p.margin || '0'};
  background: linear-gradient(90deg, #e0e7ef 25%, #f0f4f8 50%, #e0e7ef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonRow = styled.tr`
  border-bottom: 1px solid #e0e7ef;
  animation: pulse 1.5s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`;

const SkeletonCell = styled.td`
  padding: 1rem;
  
  @media (max-width: 968px) {
    padding: 0.75rem 0.5rem;
  }
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
  generated_by?: string;
  generatedBy?: string; // Keep for backwards compatibility
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
  quote_number?: string;
  quoteNumber?: string; // Keep for backwards compatibility
  business_name?: string;
  businessName?: string; // Keep for backwards compatibility
  abn?: string;
  // Registered Address
  registered_address?: string;
  registeredAddress?: string; // Keep for backwards compatibility
  registered_suburb?: string;
  registeredSuburb?: string; // Keep for backwards compatibility
  registered_postcode?: string;
  registeredPostcode?: string; // Keep for backwards compatibility
  registered_state?: string;
  registeredState?: string; // Keep for backwards compatibility
  registered_country?: string;
  registeredCountry?: string; // Keep for backwards compatibility
  // Payment & Integration
  eftpos_integration?: string;
  eftposIntegration?: string; // Keep for backwards compatibility
  alipay_option?: string;
  alipayOption?: string; // Keep for backwards compatibility
  alipay_other?: string;
  alipayOther?: string; // Keep for backwards compatibility
  // Additional Information
  ready_by?: string;
  readyBy?: string; // Keep for backwards compatibility
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
  const { token, role, isLoading, customers: authCustomers, fetchCustomers: fetchCustomersFromAuth, userEmail, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'submitted' | 'all'>('submitted');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedRegistration, setEditedRegistration] = useState<Registration | null>(null);
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
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [registrationToReject, setRegistrationToReject] = useState<string | null>(null);
  const [approveError, setApproveError] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [registrationToApprove, setRegistrationToApprove] = useState<string | null>(null);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [registrationToRevoke, setRegistrationToRevoke] = useState<string | null>(null);
  
  // Store admin names for display
  const [adminNames, setAdminNames] = useState<{ [email: string]: string }>({});
  
  // Track counts for smart refresh
  const [previousCounts, setPreviousCounts] = useState<{ submitted: number; pending: number }>({ submitted: 0, pending: 0 });
  
  // Table enhancements state
  const [sortField, setSortField] = useState<string>('submittedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    } else if (!isLoading && token && role !== "admin") {
      router.push("/agent");
    }
  }, [token, role, isLoading, router]);

  // Fetch registrations from API (currently using mock data)
  useEffect(() => {
    if (token) {
      fetchRegistrationData();
      fetchCustomers();
    }
  }, [token]);

  // Auto-refresh table data every 30 seconds (only if submitted/pending counts change)
  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(() => {
      fetchRegistrationData(true); // Pass true to indicate this is auto-refresh
    }, 30000); // 30 seconds

    return () => {
      console.log('[Auto-refresh] Cleanup interval');
      clearInterval(refreshInterval);
    };
  }, [token, previousCounts]);

  // Sync customers from auth context
  useEffect(() => {
    if (authCustomers) {
      setCustomers(authCustomers);
    }
  }, [authCustomers]);

  // Clear error when a customer is selected
  useEffect(() => {
    if (selectedCustomerId) {
      setApproveError('');
    }
  }, [selectedCustomerId]);

  // Check if returning from customer creation
  useEffect(() => {
    const returnToRegId = sessionStorage.getItem('returnToRegistration');
    const newCustomerId = sessionStorage.getItem('newCustomerId');
    
    if (returnToRegId && newCustomerId && selectedRegistration?.id === returnToRegId) {
      // Auto-select the newly created customer
      setSelectedCustomerId(newCustomerId);
      handleLinkCustomer();
      // Clear session storage
      sessionStorage.removeItem('returnToRegistration');
      sessionStorage.removeItem('newCustomerId');
      sessionStorage.removeItem('registrationData');
    }
  }, [selectedRegistration, customers]);

  const fetchRegistrationData = async (isAutoRefresh = false) => {
    setIsDataLoading(true);
    try {
      console.log(isAutoRefresh ? '[Auto-refresh] Checking for updates...' : '[Fetch] Fetching registration data...');
      
      // Fetch from new backend API
      const response = await axios.get('/api/registration/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('[Fetch] Response status:', response.status);
      console.log('[Fetch] Response data:', response.data);

      if (response.data.status_code === 200 || response.data.success) {
        const registrations = response.data.registrations || response.data.data || [];
        
        console.log('[Fetch] Raw registrations array:', registrations);
        console.log('[Fetch] Array length:', registrations.length);
        
        if (registrations.length > 0) {
          console.log('[Fetch] First item structure:', registrations[0]);
          console.log('[Fetch] First item _id:', registrations[0]._id);
          console.log('[Fetch] First item form_id:', registrations[0].form_id);
          console.log('[Fetch] First item id:', registrations[0].id);
        }
        
        // Normalize the data - ensure id field is set
        const normalizedRegistrations = registrations.map((reg: any) => {
          const normalizedId = reg.id || reg._id || reg.form_id || `temp_${Math.random()}`;
          console.log('[Normalize]', reg.form_id || reg._id, '-> id:', normalizedId);
          
          return {
            ...reg,
            id: normalizedId,
            // Ensure status has a value
            status: reg.status || 'pending'
          };
        });
        
        console.log('[Fetch] Normalized registrations:', normalizedRegistrations.length, 'items');
        console.log('[Fetch] Sample normalized item:', normalizedRegistrations[0]);
        
        // Count submitted and pending registrations
        const submittedCount = normalizedRegistrations.filter((r: any) => r.status === 'submitted').length;
        const pendingCount = normalizedRegistrations.filter((r: any) => r.status === 'pending').length;
        
        // If this is an auto-refresh, only update if counts changed
        if (isAutoRefresh) {
          const hasChanges = submittedCount !== previousCounts.submitted || pendingCount !== previousCounts.pending;
          
          if (hasChanges) {
            console.log('[Auto-refresh] Changes detected!');
            console.log('[Auto-refresh] Submitted:', previousCounts.submitted, '->', submittedCount);
            console.log('[Auto-refresh] Pending:', previousCounts.pending, '->', pendingCount);
            setAllRegistrations(normalizedRegistrations);
            setRegistrations(normalizedRegistrations);
            setPreviousCounts({ submitted: submittedCount, pending: pendingCount });
          } else {
            console.log('[Auto-refresh] No changes in submitted/pending counts, skipping update');
          }
        } else {
          // Manual refresh or initial load - always update
          setAllRegistrations(normalizedRegistrations);
          setRegistrations(normalizedRegistrations);
          setPreviousCounts({ submitted: submittedCount, pending: pendingCount });
        }
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

  const fetchCustomers = async () => {
    try {
      if (fetchCustomersFromAuth) {
        await fetchCustomersFromAuth();
      }
      setCustomers(authCustomers || []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const handleLinkCustomer = (customerId?: string) => {
    const customerIdToLink = customerId || selectedCustomerId;
    
    if (!customerIdToLink) {
      alert(lang === 'zh' ? '请选择一个客户' : 'Please select a customer');
      return;
    }
    
    if (editedRegistration) {
      handleEditChange('linkedCustomerId', customerIdToLink);
    }
    
    // Clear error immediately when customer is linked
    setApproveError('');
  };

  const handleCreateAndLinkCustomer = () => {
    if (!selectedRegistration) return;
    
    // Create a temporary customer entry in the search field
    const tempCustomerDisplay = `${getContactName(selectedRegistration) || 'New Customer'} - ${getContactEmail(selectedRegistration) || ''}`;
    setCustomerSearchQuery(tempCustomerDisplay);
    
    // Generate a temporary customer ID (will be replaced with real ID after API call)
    const tempCustomerId = `temp_${Date.now()}`;
    
    // Store pending customer data
    sessionStorage.setItem('pendingCustomer', JSON.stringify({
      tempId: tempCustomerId,
      registrationId: selectedRegistration.id,
      name: getContactName(selectedRegistration),
      email: getContactEmail(selectedRegistration),
      phone: getContactPhone(selectedRegistration)
    }));
    
    // Set as selected (temporary) - customer card will show automatically
    setSelectedCustomerId(tempCustomerId);
    handleEditChange('linkedCustomerId', tempCustomerId);
  };

  const handleViewDetails = (registration: Registration) => {
    setSelectedRegistration(registration);
    setEditedRegistration(registration);
    setIsEditMode(false);
    setSelectedCustomerId(registration.linkedCustomerId || '');
    setCustomerSearchQuery('');
    setApproveError(''); // Clear any previous error when opening a form
    setShowDetailsModal(true);
  };

  const handleEditChange = (field: keyof Registration, value: any) => {
    if (editedRegistration) {
      setEditedRegistration({
        ...editedRegistration,
        [field]: value
      });
    }
  };

  const handleSaveEdit = async () => {
    if (editedRegistration) {
      try {
        // TODO: Replace with real API call when ready
        // const response = await axios.put(getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_UPDATE.replace(':id', editedRegistration.id)), editedRegistration);
        const response = await MockAPI.updateRegistration(editedRegistration.id, editedRegistration);
        
        if (response.success && response.data) {
          setSelectedRegistration(response.data);
          setIsEditMode(false);
          // Refresh the list
          fetchRegistrationData();
          showToast(lang === 'zh' ? '保存成功！' : 'Saved successfully!', 'success');
        } else {
          console.error('Failed to save:', response.error);
          showToast('Failed to save changes', 'error');
        }
      } catch (error) {
        console.error('Failed to save registration:', error);
        showToast('Failed to save changes', 'error');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditedRegistration(selectedRegistration);
    setIsEditMode(false);
  };

  const handleGenerateForm = async () => {
    setIsGenerating(true);
    try {
      // Real API integration
      const adminEmail = adminProfile?.email || userEmail || 'admin@vend88.com';
      // Use API proxy to avoid CORS issues
      const apiUrl = '/api/registration/generate';
      
      console.log('=== Generate Form Request ===');
      console.log('API URL:', apiUrl);
      console.log('Admin Email:', adminEmail);
      console.log('Token exists:', !!token);
      console.log('Token preview:', token?.substring(0, 20) + '...');

      const response = await axios.post(
        apiUrl,
        { 
          admin_email: adminEmail
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      console.log('=== Generate Form Response ===');
      console.log('Status:', response.status);
      console.log('Response data:', response.data);
      
      if (response.data.success && response.data.data) {
        // Remove /register path to use root URL which doesn't have redirect issues
        const link = response.data.data.link.replace('/register?', '?');
        setGeneratedLink(link);
        setShowGenerateModal(true);
        console.log('✅ Registration form generated successfully');
        
        // Refresh the list after a short delay to ensure backend has saved the data
        setTimeout(() => {
          console.log('[Generate] Refreshing registration list...');
          fetchRegistrationData();
        }, 500);
      } else {
        console.error('❌ Response indicates failure:', response.data);
        const errorMessage = response.data.error || response.data.message || 'Failed to generate form';
        alert(errorMessage);
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
      
      alert(`Failed to generate form: ${errorMessage}\n\nCheck browser console (F12) for details.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsLinkCopied(true);
    setTimeout(() => {
      setIsLinkCopied(false);
    }, 2000);
  };

  const handleApprove = (id: string) => {
    // Check if customer is linked when approving from details modal (only when viewing in modal)
    if (selectedRegistration?.id === id && showDetailsModal && !selectedCustomerId) {
      setApproveError(lang === 'zh' ? '请先关联客户后再批准' : 'Please link a customer before approving');
      return;
    }
    
    // Clear any previous error
    setApproveError('');
    
    // Show confirmation modal
    setRegistrationToApprove(id);
    setShowApproveModal(true);
  };

  const handleConfirmApprove = async () => {
    if (!registrationToApprove) return;
    
    const id = registrationToApprove;
      try {
        // Save the linked customer ID before approving
        const linkedCustomer = selectedCustomerId;

        if (token) {
          // Use real API: ensure customer is linked first
          const adminEmail = adminProfile?.email || userEmail || 'admin@vend88.com';

          if (linkedCustomer) {
            try {
              if (linkedCustomer.startsWith('temp_')) {
                // Create new customer via link-customer endpoint
                await axios.put(
                  getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_LINK.replace(':id', id)),
                  {
                    create_new: true,
                    customer_data: {
                      name: selectedRegistration ? getContactName(selectedRegistration) : undefined,
                      email: selectedRegistration ? getContactEmail(selectedRegistration) : undefined,
                      phone: selectedRegistration?.contactPhone,
                    }
                  },
                  { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
                );
              } else {
                // Link existing customer
                await axios.put(
                  getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_LINK.replace(':id', id)),
                  { customer_id: linkedCustomer },
                  { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
                );
              }
            } catch (err) {
              console.error('Failed to link customer before approval:', err);
              showToast('Failed to link customer. Please try again.', 'error');
              return;
            }
          }

          // Call approve endpoint
          try {
            const response = await axios.post(
              getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_APPROVE.replace(':id', id)),
              { approval_notes: '' },
              { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
            );

            if (response.data && response.data.success) {
              // Refresh the list
              fetchRegistrationData();
              showToast(lang === 'zh' ? '批准成功！' : 'Approved successfully!', 'success');
              if (selectedRegistration?.id === id) setShowDetailsModal(false);
            } else {
              showToast(response.data?.error || 'Failed to approve', 'error');
            }
          } catch (err) {
            console.error('Failed to approve via API:', err);
            showToast('Failed to approve. Please try again.', 'error');
          }
        } else {
          // Fallback to mock API for local dev
          const response = await MockAPI.approveRegistration(id, adminProfile?.email || userEmail || 'admin@vend88.com');

          if (response.success) {
            // Update the registration with linked customer ID
            if (linkedCustomer && response.data) {
              const updateResponse = await MockAPI.updateRegistration(id, { 
                linkedCustomerId: linkedCustomer 
              } as Partial<Registration>);
              if (updateResponse.success && updateResponse.data) {
                setSelectedRegistration(updateResponse.data);
                setEditedRegistration(updateResponse.data);
              }
            }

            // Refresh the list
            fetchRegistrationData();
            showToast(lang === 'zh' ? '批准成功！' : 'Approved successfully!', 'success');
            // Close modals
            setShowApproveModal(false);
            setRegistrationToApprove(null);
            if (selectedRegistration?.id === id) {
              setShowDetailsModal(false);
            }
          } else {
            showToast(response.error || 'Failed to approve', 'error');
          }
        }
      } catch (error) {
        console.error('Failed to approve registration:', error);
        showToast('Failed to approve. Please try again.', 'error');
      }
  };

  const handleReject = async (id: string) => {
    setRegistrationToReject(id);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (!registrationToReject) return;
    
    try {
      // TODO: Replace with real API call when ready
      // const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_REJECT.replace(':id', registrationToReject)), { reason: rejectionReason });
      const response = await MockAPI.rejectRegistration(registrationToReject, rejectionReason || undefined, 'admin@vend88.com');
      
      if (response.success) {
        // Refresh the list
        fetchRegistrationData();
        showToast(lang === 'zh' ? '已拒绝' : 'Rejected successfully', 'success');
        // Close modals
        setShowRejectModal(false);
        if (selectedRegistration?.id === registrationToReject) {
          setShowDetailsModal(false);
        }
        setRegistrationToReject(null);
        setRejectionReason('');
      } else {
        showToast(response.error || 'Failed to reject', 'error');
      }
    } catch (error) {
      console.error('Failed to reject registration:', error);
      showToast('Failed to reject. Please try again.', 'error');
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
      // TODO: Replace with real API call when ready
      // const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_REVOKE.replace(':id', id)));
      const response = await MockAPI.revokeRegistration(id, 'admin@vend88.com');
      
      if (response.success) {
        // Refresh the list
        fetchRegistrationData();
        showToast(lang === 'zh' ? '已撤销！' : 'Revoked successfully!', 'success');
        // Close details modal if open
        if (selectedRegistration?.id === id) {
          setShowDetailsModal(false);
        }
        // Close revoke modal
        setShowRevokeModal(false);
        setRegistrationToRevoke(null);
      } else {
        showToast(response.error || 'Failed to revoke', 'error');
      }
    } catch (error) {
      console.error('Failed to revoke registration:', error);
      showToast('Failed to revoke. Please try again.', 'error');
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
  
  // Additional helper functions for all fields
  const getQuoteNumber = (reg: Registration) => reg.quote_number || reg.quoteNumber || '';
  const getABN = (reg: Registration) => reg.abn || '';
  const getRegisteredAddress = (reg: Registration) => reg.registered_address || reg.registeredAddress || '';
  const getRegisteredSuburb = (reg: Registration) => reg.registered_suburb || reg.registeredSuburb || '';
  const getRegisteredPostcode = (reg: Registration) => reg.registered_postcode || reg.registeredPostcode || '';
  const getRegisteredState = (reg: Registration) => reg.registered_state || reg.registeredState || '';
  const getRegisteredCountry = (reg: Registration) => reg.registered_country || reg.registeredCountry || '';
  const getEftposIntegration = (reg: Registration) => reg.eftpos_integration || reg.eftposIntegration || '';
  const getAlipayOption = (reg: Registration) => reg.alipay_option || reg.alipayOption || '';
  const getAlipayOther = (reg: Registration) => reg.alipay_other || reg.alipayOther || '';
  const getReadyBy = (reg: Registration) => reg.ready_by || reg.readyBy || '';
  const getHeardAbout = (reg: Registration) => reg.heard_about || reg.heardAbout || '';
  const getHeardOther = (reg: Registration) => reg.heard_other || reg.heardOther || '';
  const getMessagingAppType = (reg: Registration) => reg.messaging_app_type || reg.messagingAppType || '';
  const getMessagingAppId = (reg: Registration) => reg.messaging_app_id || reg.messagingAppId || '';
  const getMenuFiles = (reg: Registration) => reg.menu_files || reg.menuFiles || [];
  const getMenuSendLater = (reg: Registration) => reg.menu_send_later || reg.menuSendLater || false;
  const getNotes = (reg: Registration) => reg.notes || '';
  
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
  console.log('[Table] All registrations count:', allRegistrations.length);
  console.log('[Table] Filtered registrations count:', filteredRegistrations.length);
  console.log('[Table] Sorted registrations count:', sortedRegistrations.length);
  console.log('[Table] Paginated registrations count:', paginatedRegistrations.length);
  console.log('[Table] Active tab:', activeTab);
  console.log('[Table] Current page:', currentPage, '/', totalPages);

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
      <MainLayout currentPage={lang === "zh" ? "注册管理" : "Registration Management"} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <Container>
          <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          <MainContent>
            {/* Skeleton Header */}
            <ContentHeader>
              <HeaderLeft>
                <SkeletonBox width="250px" height="32px" margin="0 0 0.5rem 0" />
                <SkeletonBox width="400px" height="16px" />
              </HeaderLeft>
              <SkeletonBox width="180px" height="44px" />
            </ContentHeader>

            {/* Skeleton Search/Filter */}
            <SearchFilterContainer>
              <SkeletonBox height="42px" />
              <SkeletonBox width="150px" height="42px" />
            </SearchFilterContainer>

            {/* Skeleton Tabs */}
            <TabContainer>
              <TabButtons>
                <SkeletonBox width="33%" height="48px" margin="0" style={{ borderRadius: 0 }} />
                <SkeletonBox width="33%" height="48px" margin="0" style={{ borderRadius: 0 }} />
                <SkeletonBox width="33%" height="48px" margin="0" style={{ borderRadius: 0 }} />
              </TabButtons>
              
              {/* Skeleton Table */}
              <TabContent>
                <Table>
                  <Thead>
                    <tr>
                      <Th style={{ width: '50px' }}></Th>
                      <Th>{lang === "zh" ? "表单 ID" : "Form ID"}</Th>
                      <Th>{lang === "zh" ? "联系邮箱" : "Contact Email"}</Th>
                      <Th>{lang === "zh" ? "业务名称" : "Business Name"}</Th>
                      <Th>{lang === "zh" ? "州" : "State"}</Th>
                      <Th>{lang === "zh" ? "提交时间" : "Submitted At"}</Th>
                      <Th>{lang === "zh" ? "操作" : "Actions"}</Th>
                    </tr>
                  </Thead>
                  <Tbody>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <SkeletonRow key={i}>
                        <SkeletonCell>
                          <SkeletonBox width="18px" height="18px" />
                        </SkeletonCell>
                        <SkeletonCell>
                          <SkeletonBox width="120px" height="14px" />
                        </SkeletonCell>
                        <SkeletonCell>
                          <SkeletonBox width="180px" height="14px" />
                        </SkeletonCell>
                        <SkeletonCell>
                          <SkeletonBox width="140px" height="14px" />
                        </SkeletonCell>
                        <SkeletonCell>
                          <SkeletonBox width="50px" height="14px" />
                        </SkeletonCell>
                        <SkeletonCell>
                          <SkeletonBox width="150px" height="14px" />
                        </SkeletonCell>
                        <SkeletonCell>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <SkeletonBox width="60px" height="32px" />
                            <SkeletonBox width="60px" height="32px" />
                          </div>
                        </SkeletonCell>
                      </SkeletonRow>
                    ))}
                  </Tbody>
                </Table>
              </TabContent>
            </TabContainer>
          </MainContent>
        </Container>
      </MainLayout>
    );
  }

  if (!token || role !== "admin") {
    return null;
  }

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
              placeholder={lang === "zh" ? "搜索业务名称、邮箱、联系人、电话或ABN..." : "Search business name, email, contact, phone or ABN..."}
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
                      <Th>{lang === "zh" ? "业务名称" : "Business Name"}</Th>
                      <Th>{lang === "zh" ? "联系邮箱" : "Contact Email"}</Th>
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
                    {searchQuery || filterState !== 'all' ? '🔍' : activeTab === 'submitted' ? '✅' : activeTab === 'pending' ? '📝' : '📋'}
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
                      {activeTab === 'submitted' && (
                        <>
                          <ActionButton $variant="approve" onClick={() => {
                            selectedRows.forEach(id => handleApprove(id));
                            setSelectedRows(new Set());
                          }}>
                            {lang === "zh" ? "批准所选" : "Approve Selected"}
                          </ActionButton>
                          <ActionButton $variant="reject" onClick={() => {
                            const firstId = Array.from(selectedRows)[0];
                            handleReject(firstId);
                            setSelectedRows(new Set());
                          }}>
                            {lang === "zh" ? "拒绝所选" : "Reject Selected"}
                          </ActionButton>
                        </>
                      )}
                      {activeTab === 'pending' && (
                        <ActionButton $variant="reject" onClick={() => {
                          selectedRows.forEach(id => handleRevoke(id));
                          setSelectedRows(new Set());
                        }}>
                          {lang === "zh" ? "撤销所选" : "Revoke Selected"}
                        </ActionButton>
                      )}
                      {activeTab === 'all' && (
                        <>
                          <ActionButton $variant="approve" onClick={() => {
                            const submittedIds = paginatedRegistrations
                              .filter(r => selectedRows.has(r.id) && r.status === 'submitted')
                              .map(r => r.id);
                            submittedIds.forEach(id => handleApprove(id));
                            setSelectedRows(new Set());
                          }}>
                            {lang === "zh" ? "批准已提交" : "Approve Submitted"}
                          </ActionButton>
                          <ActionButton $variant="reject" onClick={() => {
                            const submittedIds = paginatedRegistrations
                              .filter(r => selectedRows.has(r.id) && r.status === 'submitted')
                              .map(r => r.id);
                            const firstId = Array.from(submittedIds)[0];
                            if (firstId) handleReject(firstId);
                            setSelectedRows(new Set());
                          }}>
                            {lang === "zh" ? "拒绝已提交" : "Reject Submitted"}
                          </ActionButton>
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
                          {lang === "zh" ? "业务名称" : "Business Name"}
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
                              <ActionButton $variant="approve" onClick={() => handleApprove(reg.id)}>
                                {lang === "zh" ? "批准" : "Approve"}
                              </ActionButton>
                              <ActionButton $variant="reject" onClick={() => handleReject(reg.id)}>
                                {lang === "zh" ? "拒绝" : "Reject"}
                              </ActionButton>
                            </>
                          )}
                          {reg.status === 'pending' && (
                            <>
                              <ActionButton $variant="view">
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
                        ? `显示 ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, sortedRegistrations.length)} 条，共 ${sortedRegistrations.length} 条`
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
            {lang === "zh" 
              ? "请将以下链接发送给客户。此链接仅可使用一次。"
              : "Send the following link to your customer. This link can only be used once."}
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

      <Modal $show={showDetailsModal} onClick={() => setShowDetailsModal(false)}>
        <ModalContent onClick={e => e.stopPropagation()} style={{ maxHeight: '85vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <ModalTitle style={{ margin: 0 }}>{lang === "zh" ? "注册详情" : "Registration Details"}</ModalTitle>
            {!isEditMode && (
              <EditButton onClick={() => setIsEditMode(true)}>
                <EditIcon />
                {lang === "zh" ? "编辑" : "Edit"}
              </EditButton>
            )}
          </div>
          
          {selectedRegistration && editedRegistration && (
            <>
              <SectionTitle>{lang === "zh" ? "📧 联系信息" : "📧 Contact Information"}</SectionTitle>
              
              <DetailSection>
                <DetailLabel>{lang === "zh" ? "联系邮箱" : "Contact Email"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    type="email"
                    value={editedRegistration.contactEmail || editedRegistration.contact_email || ''}
                    onChange={(e) => handleEditChange('contactEmail', e.target.value)}
                  />
                ) : (
                  <DetailValue>{getContactEmail(selectedRegistration) || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "全名" : "Full Name"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    value={editedRegistration.ownerName || editedRegistration.contact_name || ''}
                    onChange={(e) => handleEditChange('ownerName', e.target.value)}
                  />
                ) : (
                  <DetailValue>{getContactName(selectedRegistration) || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "联系电话" : "Contact Phone"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    type="tel"
                    value={editedRegistration.contactPhone || editedRegistration.contact_phone || ''}
                    onChange={(e) => handleEditChange('contactPhone', e.target.value)}
                  />
                ) : (
                  <DetailValue>{getContactPhone(selectedRegistration) || '-'}</DetailValue>
                )}
              </DetailSection>

              {(getMessagingAppType(selectedRegistration) || isEditMode) && (
                <DetailSection>
                  <DetailLabel>
                    {lang === "zh" ? "即时通讯" : "Messaging App"}
                  </DetailLabel>
                  {isEditMode ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <EditSelect 
                        value={editedRegistration.messaging_app_type || editedRegistration.messagingAppType || ''}
                        onChange={(e) => handleEditChange('messagingAppType', e.target.value)}
                      >
                        <option value="">{lang === "zh" ? "-- 选择应用 --" : "-- Select app --"}</option>
                        <option value="wechat">{lang === "zh" ? "微信号" : "WeChat ID"}</option>
                        <option value="whatsapp">{lang === "zh" ? "WhatsApp 号码" : "WhatsApp Number"}</option>
                      </EditSelect>
                      {(editedRegistration.messaging_app_type || editedRegistration.messagingAppType) && (
                        <EditInput 
                          value={editedRegistration.messaging_app_id || editedRegistration.messagingAppId || ''}
                          onChange={(e) => handleEditChange('messagingAppId', e.target.value)}
                          placeholder={(editedRegistration.messaging_app_type || editedRegistration.messagingAppType) === 'wechat' 
                            ? (lang === "zh" ? "输入微信号" : "Enter WeChat ID")
                            : (lang === "zh" ? "输入 WhatsApp 号码" : "Enter WhatsApp number")
                          }
                        />
                      )}
                    </div>
                  ) : (
                    <DetailValue>
                      {getMessagingAppType(selectedRegistration) === 'wechat' ? 'WeChat' : 'WhatsApp'}: {getMessagingAppId(selectedRegistration)}
                    </DetailValue>
                  )}
                </DetailSection>
              )}

              <DetailSection>
                <DetailLabel style={{ color: '#991b1b', display: 'flex', gap: '0.5rem', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>*</span>
                    {lang === "zh" ? "关联客户（必填）" : "Link to Customer (Required)"}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#6b7280', 
                    fontWeight: 500,
                    textTransform: 'none',
                    letterSpacing: '0',
                    marginTop: '0.25rem',
                    fontStyle: 'italic'
                  }}>
                    {lang === "zh" ? "仅供内部使用 - 不会显示给客户" : "Internal Use Only - Not visible to customer"}
                  </div>
                </DetailLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {selectedCustomerId ? (
                    // Show selected customer with option to change
                    <div style={{ 
                      padding: '0.75rem',
                      border: selectedCustomerId.startsWith('temp_') && selectedRegistration?.status !== 'approved' ? '1.5px solid #fbbf24' : '1.5px solid #d1fae5',
                      borderRadius: '8px',
                      background: selectedCustomerId.startsWith('temp_') && selectedRegistration?.status !== 'approved' ? '#fffbeb' : '#f0fdf4',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: 600, 
                          color: selectedCustomerId.startsWith('temp_') && selectedRegistration?.status !== 'approved' ? '#92400e' : '#065f46',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          {selectedCustomerId.startsWith('temp_') ? (
                            <>
                              {selectedRegistration?.status !== 'approved' && <span>⚠️</span>}
                              <span>{getContactName(selectedRegistration) || 'New Customer'}</span>
                              {selectedRegistration?.status !== 'approved' && (
                                <span style={{ 
                                  fontSize: '0.75rem', 
                                  fontWeight: 500,
                                  background: '#f59e0b',
                                  color: 'white',
                                  padding: '0.125rem 0.5rem',
                                  borderRadius: '4px'
                                }}>
                                  {lang === "zh" ? "待创建" : "Pending"}
                                </span>
                              )}
                            </>
                          ) : (
                            customers.find((c: any) => c._id === selectedCustomerId)?.name || 'Selected Customer'
                          )}
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: selectedCustomerId.startsWith('temp_') && selectedRegistration?.status !== 'approved' ? '#b45309' : '#059669'
                        }}>
                          {selectedCustomerId.startsWith('temp_') 
                            ? (selectedRegistration ? getContactEmail(selectedRegistration) : '')
                            : customers.find((c: any) => c._id === selectedCustomerId)?.email || ''
                          }
                        </div>
                        {selectedCustomerId.startsWith('temp_') ? (
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: selectedRegistration?.status === 'approved' ? '#065f46' : '#92400e',
                            marginTop: '0.25rem',
                            fontStyle: 'italic'
                          }}>
                            {selectedRegistration?.status === 'approved' 
                              ? (lang === "zh" ? "✓ 新客户账号已创建" : "✓ New customer account created")
                              : (lang === "zh" ? "批准后将自动创建此客户账号" : "Customer account will be created upon approval")
                            }
                          </div>
                        ) : selectedRegistration?.status === 'approved' && (
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: '#065f46',
                            marginTop: '0.25rem',
                            fontStyle: 'italic'
                          }}>
                            {lang === "zh" ? "✓ 已关联到现有客户" : "✓ Linked to existing customer"}
                          </div>
                        )}
                      </div>
                      <ActionButton onClick={() => {
                        setSelectedCustomerId('');
                        setCustomerSearchQuery('');
                        if (selectedCustomerId.startsWith('temp_')) {
                          sessionStorage.removeItem('pendingCustomer');
                        }
                      }} style={{ margin: 0 }}>
                        {lang === "zh" ? "更改" : "Change"}
                      </ActionButton>
                    </div>
                  ) : (
                    <>
                      {/* Search bar with button on the right */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <EditInput
                            type="text"
                            placeholder={lang === "zh" ? "搜索客户名称或邮箱..." : "Search customer name or email..."}
                            value={customerSearchQuery}
                            onChange={(e) => setCustomerSearchQuery(e.target.value)}
                            style={{ 
                              borderColor: !selectedCustomerId ? '#fca5a5' : undefined,
                              paddingRight: '2.5rem',
                              width: '100%'
                            }}
                          />
                          <svg 
                            style={{ 
                              position: 'absolute', 
                              right: '0.75rem', 
                              top: '0.75rem',
                              pointerEvents: 'none',
                              opacity: 0.5
                            }} 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                          >
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                          </svg>
                          {customerSearchQuery && (
                            <div style={{
                              position: 'absolute',
                              top: 'calc(100% + 0.25rem)',
                              left: 0,
                              right: 0,
                              background: 'white',
                              border: '1.5px solid #e0e7ef',
                              borderRadius: '8px',
                              maxHeight: '200px',
                              overflowY: 'auto',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              zIndex: 10
                            }}>
                              {customers
                                .filter((customer: any) => {
                                  const searchLower = customerSearchQuery.toLowerCase();
                                  return customer.name?.toLowerCase().includes(searchLower) ||
                                         customer.email?.toLowerCase().includes(searchLower);
                                })
                                .slice(0, 10)
                                .map((customer: any) => (
                                  <div
                                    key={customer._id}
                                    onClick={() => {
                                      const customerId = customer._id;
                                      setSelectedCustomerId(customerId);
                                      setCustomerSearchQuery('');
                                      setApproveError(''); // Clear error when customer is selected
                                      handleLinkCustomer(customerId);
                                    }}
                                    style={{
                                      padding: '0.75rem',
                                      cursor: 'pointer',
                                      borderBottom: '1px solid #f0f0f0',
                                      transition: 'background 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f7faff'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                  >
                                    <div style={{ fontWeight: 600, color: '#0a3655' }}>{customer.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#5c6b7a' }}>{customer.email}</div>
                                  </div>
                                ))}
                              {customers.filter((customer: any) => {
                                const searchLower = customerSearchQuery.toLowerCase();
                                return customer.name?.toLowerCase().includes(searchLower) ||
                                       customer.email?.toLowerCase().includes(searchLower);
                              }).length === 0 && (
                                <div style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af' }}>
                                  {lang === "zh" ? "未找到客户" : "No customers found"}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <ActionButton 
                          onClick={handleCreateAndLinkCustomer} 
                          style={{ 
                            margin: 0,
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1rem'
                          }}
                        >
                          <PlusIcon />
                          {lang === "zh" ? "创建新客户" : "Create New"}
                        </ActionButton>
                      </div>
                      {!selectedCustomerId && (
                        <div style={{ fontSize: '0.8125rem', color: '#991b1b', marginTop: '-0.5rem' }}>
                          {lang === "zh" ? "* 批准前必须关联客户" : "* Must link customer before approval"}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </DetailSection>

              <Divider />

              <SectionTitle>{lang === "zh" ? "🏢 商业信息" : "🏢 Business Information"}</SectionTitle>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "报价单/发票号码" : "Quote/Invoice Number"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    value={editedRegistration.quote_number || editedRegistration.quoteNumber || ''}
                    onChange={(e) => handleEditChange('quoteNumber', e.target.value)}
                  />
                ) : (
                  <DetailValue>{getQuoteNumber(selectedRegistration) || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "公司交易名称" : "Business Trading Name"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    value={editedRegistration.businessName || editedRegistration.business_name || ''}
                    onChange={(e) => handleEditChange('businessName', e.target.value)}
                  />
                ) : (
                  <DetailValue>{getBusinessName(selectedRegistration) || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "ABN" : "ABN"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    value={editedRegistration.abn || ''}
                    onChange={(e) => handleEditChange('abn', e.target.value)}
                    maxLength={11}
                  />
                ) : (
                  <DetailValue>{getABN(selectedRegistration) || '-'}</DetailValue>
                )}
              </DetailSection>

              <Divider />

              <SectionTitle>{lang === "zh" ? "📍 注册地址" : "📍 Registered Address"}</SectionTitle>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "街道地址" : "Street Address"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    value={editedRegistration.registered_address || editedRegistration.registeredAddress || ''}
                    onChange={(e) => handleEditChange('registeredAddress', e.target.value)}
                  />
                ) : (
                  <DetailValue>{getRegisteredAddress(selectedRegistration) || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "城市/郊区" : "City/Suburb"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    value={editedRegistration.registered_suburb || editedRegistration.registeredSuburb || ''}
                    onChange={(e) => handleEditChange('registeredSuburb', e.target.value)}
                  />
                ) : (
                  <DetailValue>{getRegisteredSuburb(selectedRegistration) || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "邮政编码" : "Postcode"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    value={editedRegistration.registered_postcode || editedRegistration.registeredPostcode || ''}
                    onChange={(e) => handleEditChange('registeredPostcode', e.target.value)}
                    maxLength={4}
                  />
                ) : (
                  <DetailValue>{getRegisteredPostcode(selectedRegistration) || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "州/领地" : "State/Territory"}</DetailLabel>
                {isEditMode ? (
                  <EditSelect 
                    value={editedRegistration.registered_state || editedRegistration.registeredState || ''}
                    onChange={(e) => handleEditChange('registeredState', e.target.value)}
                  >
                    <option value="">{lang === "zh" ? "-- 选择 --" : "-- Select --"}</option>
                    <option value="NSW">NSW</option>
                    <option value="VIC">VIC</option>
                    <option value="QLD">QLD</option>
                    <option value="WA">WA</option>
                    <option value="SA">SA</option>
                    <option value="TAS">TAS</option>
                    <option value="ACT">ACT</option>
                    <option value="NT">NT</option>
                  </EditSelect>
                ) : (
                  <DetailValue>{getRegisteredState(selectedRegistration) || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "国家" : "Country"}</DetailLabel>
                {isEditMode ? (
                  <EditSelect 
                    value={editedRegistration.registered_country || editedRegistration.registeredCountry || 'Australia'}
                    onChange={(e) => handleEditChange('registeredCountry', e.target.value)}
                  >
                    <option value="Australia">Australia</option>
                  </EditSelect>
                ) : (
                  <DetailValue>{getRegisteredCountry(selectedRegistration) || '-'}</DetailValue>
                )}
              </DetailSection>

              <Divider />

              <SectionTitle>{lang === "zh" ? "💳 支付与集成" : "💳 Payment & Integration"}</SectionTitle>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "EFTPOS 集成" : "EFTPOS Integration"}</DetailLabel>
                {isEditMode ? (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <input 
                        type="radio"
                        checked={editedRegistration.eftposIntegration === 'yes'}
                        onChange={() => handleEditChange('eftposIntegration', 'yes')}
                      />
                      {lang === "zh" ? "是" : "Yes"}
                    </label>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <input 
                        type="radio"
                        checked={editedRegistration.eftposIntegration === 'no'}
                        onChange={() => handleEditChange('eftposIntegration', 'no')}
                      />
                      {lang === "zh" ? "否" : "No"}
                    </label>
                  </div>
                ) : (
                  <DetailValue>
                    {getEftposIntegration(selectedRegistration) === 'yes' 
                      ? (lang === "zh" ? "是" : "Yes") 
                      : getEftposIntegration(selectedRegistration) === 'no'
                      ? (lang === "zh" ? "否" : "No")
                      : '-'}
                  </DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "支付宝/微信支付" : "Alipay/WeChat Pay"}</DetailLabel>
                {isEditMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <EditSelect 
                      value={editedRegistration.alipay_option || editedRegistration.alipayOption || ''}
                      onChange={(e) => handleEditChange('alipayOption', e.target.value)}
                    >
                      <option value="">{lang === "zh" ? "-- 选择 --" : "-- Select --"}</option>
                      <option value="open">{lang === "zh" ? "开通" : "Open Account"}</option>
                      <option value="not-interested">{lang === "zh" ? "不感兴趣" : "Not Interested"}</option>
                      <option value="superpay">Superpay</option>
                      <option value="royalpay">Royalpay</option>
                      <option value="other">{lang === "zh" ? "其他" : "Other"}</option>
                    </EditSelect>
                    {editedRegistration.alipayOption === 'other' && (
                      <EditInput 
                        value={editedRegistration.alipayOther || ''}
                        onChange={(e) => handleEditChange('alipayOther', e.target.value)}
                        placeholder={lang === "zh" ? "请描述" : "Please describe"}
                      />
                    )}
                  </div>
                ) : (
                  <DetailValue>
                    {getAlipayOption(selectedRegistration) === 'open' && (lang === "zh" ? "开通" : "Open Account")}
                    {getAlipayOption(selectedRegistration) === 'not-interested' && (lang === "zh" ? "不感兴趣" : "Not Interested")}
                    {getAlipayOption(selectedRegistration) === 'superpay' && "Superpay"}
                    {getAlipayOption(selectedRegistration) === 'royalpay' && "Royalpay"}
                    {getAlipayOption(selectedRegistration) === 'other' && `${lang === "zh" ? "其他" : "Other"}: ${getAlipayOther(selectedRegistration)}`}
                    {!getAlipayOption(selectedRegistration) && '-'}
                  </DetailValue>
                )}
              </DetailSection>

              <Divider />

              <SectionTitle>{lang === "zh" ? "📋 附加信息" : "📋 Additional Information"}</SectionTitle>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "预期部署时间" : "Expected Deployment"}</DetailLabel>
                {isEditMode ? (
                  <EditTextarea 
                    value={editedRegistration.ready_by || editedRegistration.readyBy || ''}
                    onChange={(e) => handleEditChange('readyBy', e.target.value)}
                    rows={2}
                  />
                ) : (
                  <DetailValue>{getReadyBy(selectedRegistration) || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "如何了解我们" : "How Did You Hear About Us"}</DetailLabel>
                {isEditMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <EditSelect 
                      value={editedRegistration.heard_about || editedRegistration.heardAbout || ''}
                      onChange={(e) => handleEditChange('heardAbout', e.target.value)}
                    >
                      <option value="">{lang === "zh" ? "-- 选择 --" : "-- Select --"}</option>
                      <option value="friend">{lang === "zh" ? "朋友推荐" : "Friend Referral"}</option>
                      <option value="google">Google</option>
                      <option value="wechat">{lang === "zh" ? "微信" : "WeChat"}</option>
                      <option value="saw">{lang === "zh" ? "看到使用" : "Saw in Use"}</option>
                      <option value="other">{lang === "zh" ? "其他" : "Other"}</option>
                    </EditSelect>
                    {(editedRegistration.heard_about || editedRegistration.heardAbout) === 'other' && (
                      <EditInput 
                        value={editedRegistration.heard_other || editedRegistration.heardOther || ''}
                        onChange={(e) => handleEditChange('heardOther', e.target.value)}
                        placeholder={lang === "zh" ? "请描述" : "Please describe"}
                      />
                    )}
                  </div>
                ) : (
                  <DetailValue>
                    {getHeardAbout(selectedRegistration) === 'friend' && (lang === "zh" ? "朋友推荐" : "Friend Referral")}
                    {getHeardAbout(selectedRegistration) === 'google' && "Google"}
                    {getHeardAbout(selectedRegistration) === 'wechat' && (lang === "zh" ? "微信" : "WeChat")}
                    {getHeardAbout(selectedRegistration) === 'saw' && (lang === "zh" ? "看到使用" : "Saw in Use")}
                    {getHeardAbout(selectedRegistration) === 'other' && `${lang === "zh" ? "其他" : "Other"}: ${getHeardOther(selectedRegistration)}`}
                    {!getHeardAbout(selectedRegistration) && '-'}
                  </DetailValue>
                )}
              </DetailSection>

              {getMenuFiles(selectedRegistration).length > 0 && (
                <DetailSection>
                  <DetailLabel>{lang === "zh" ? "菜单文件" : "Menu Files"}</DetailLabel>
                  <DetailValue>
                    {getMenuFiles(selectedRegistration).map((file, idx) => {
                      // Handle both old string format and new object format
                      if (typeof file === 'string') {
                        return (
                          <div key={idx} style={{ padding: '0.5rem', background: 'rgba(43,123,227,0.05)', borderRadius: '4px', marginTop: idx > 0 ? '0.5rem' : 0 }}>
                            📄 {file}
                          </div>
                        );
                      }
                      
                      // New downloadable file format
                      return (
                        <FileDownloadLink
                          key={idx}
                          href={file.url}
                          download={file.filename}
                          onClick={(e) => {
                            // For mock files, prevent default and show alert
                            if (file.url.startsWith('/mock-files/')) {
                              e.preventDefault();
                              alert(lang === 'zh' 
                                ? `模拟下载: ${file.filename}\n实际应用中，这将从服务器下载真实文件。` 
                                : `Mock download: ${file.filename}\nIn production, this would download the actual file from the server.`);
                            }
                          }}
                        >
                          <FileInfo>
                            <span>📄</span>
                            <div>
                              <FileName>{file.filename}</FileName>
                              {(file.size || file.uploadedAt) && (
                                <FileMetadata>
                                  {file.size && formatFileSize(file.size)}
                                  {file.size && file.uploadedAt && ' • '}
                                  {file.uploadedAt && new Date(file.uploadedAt).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-AU')}
                                </FileMetadata>
                              )}
                            </div>
                          </FileInfo>
                          <DownloadButton>
                            <DownloadIcon />
                            {lang === "zh" ? "下载" : "Download"}
                          </DownloadButton>
                        </FileDownloadLink>
                      );
                    })}
                  </DetailValue>
                </DetailSection>
              )}

              {getMenuSendLater(selectedRegistration) && (
                <DetailSection>
                  <DetailLabel>{lang === "zh" ? "菜单" : "Menu"}</DetailLabel>
                  <DetailValue>{lang === "zh" ? "稍后发送" : "Will send later"}</DetailValue>
                </DetailSection>
              )}

              {(getNotes(selectedRegistration) || isEditMode) && (
                <DetailSection>
                  <DetailLabel>{lang === "zh" ? "备注" : "Notes"}</DetailLabel>
                  {isEditMode ? (
                    <EditTextarea 
                      value={editedRegistration.notes || ''}
                      onChange={(e) => handleEditChange('notes', e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <DetailValue style={{ whiteSpace: 'pre-wrap' }}>{getNotes(selectedRegistration)}</DetailValue>
                  )}
                </DetailSection>
              )}

              <Divider />

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "提交时间" : "Submitted At"}</DetailLabel>
                <DetailValue>
                  {getSubmittedAt(selectedRegistration)
                    ? new Date(getSubmittedAt(selectedRegistration)).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-AU')
                    : '-'}
                </DetailValue>
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "状态" : "Status"}</DetailLabel>
                <DetailValue>
                  <StatusBadge $status={selectedRegistration.status}>
                    {selectedRegistration.status}
                  </StatusBadge>
                  <div style={{ fontSize: '0.875rem', color: '#5c6b7a', marginTop: '0.75rem' }}>
                    {selectedRegistration.status === 'pending' && getGeneratedAt(selectedRegistration) && (
                      <>
                        {lang === "zh" ? "生成时间：" : "Generated at: "}
                        {new Date(getGeneratedAt(selectedRegistration)).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-AU')}
                      </>
                    )}
                    {selectedRegistration.status === 'submitted' && getSubmittedAt(selectedRegistration) && (
                      <>
                        {lang === "zh" ? "提交时间：" : "Submitted at: "}
                        {new Date(getSubmittedAt(selectedRegistration)).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-AU')}
                      </>
                    )}
                    {selectedRegistration.status === 'approved' && (selectedRegistration.approved_at || selectedRegistration.approvedAt) && (
                      <>
                        {lang === "zh" ? "批准时间：" : "Approved at: "}
                        {new Date((selectedRegistration.approved_at || selectedRegistration.approvedAt)!).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-AU')}
                        {(selectedRegistration.approved_by || selectedRegistration.approvedBy) && (
                          <>
                            <br />
                            {lang === "zh" ? "批准人：" : "Approved by: "}
                            {selectedRegistration.approved_by || selectedRegistration.approvedBy}
                          </>
                        )}
                      </>
                    )}
                    {selectedRegistration.status === 'rejected' && (selectedRegistration.rejected_at || selectedRegistration.rejectedAt) && (
                      <>
                        {lang === "zh" ? "拒绝时间：" : "Rejected at: "}
                        {new Date((selectedRegistration.rejected_at || selectedRegistration.rejectedAt)!).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-AU')}
                        {(selectedRegistration.rejected_by || selectedRegistration.rejectedBy) && (
                          <>
                            <br />
                            {lang === "zh" ? "拒绝人：" : "Rejected by: "}
                            {selectedRegistration.rejected_by || selectedRegistration.rejectedBy}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </DetailValue>
              </DetailSection>

              {selectedRegistration.status === 'rejected' && (selectedRegistration.rejection_reason || selectedRegistration.rejectionReason) && (
                <DetailSection>
                  <DetailLabel>{lang === "zh" ? "拒绝原因" : "Rejection Reason"}</DetailLabel>
                  <DetailValue style={{ color: '#991b1b', background: '#fee2e2', padding: '0.75rem', borderRadius: '8px' }}>
                    {selectedRegistration.rejection_reason || selectedRegistration.rejectionReason}
                  </DetailValue>
                </DetailSection>
              )}
            </>
          )}

          {approveError && (
            <div style={{ 
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              padding: '1rem', 
              background: '#fee2e2', 
              border: '1px solid #fecaca',
              borderRadius: '8px', 
              color: '#991b1b',
              fontSize: '0.9375rem',
              fontWeight: '500'
            }}>
              ⚠️ {approveError}
            </div>
          )}

          <ModalActions>
            {isEditMode ? (
              <>
                <ModalButton onClick={handleCancelEdit}>
                  {lang === "zh" ? "取消" : "Cancel"}
                </ModalButton>
                <ModalButton $primary onClick={handleSaveEdit}>
                  <SaveIcon />
                  {lang === "zh" ? "保存" : "Save"}
                </ModalButton>
              </>
            ) : (
              <>
                {selectedRegistration?.status === 'submitted' && (
                  <>
                    <ModalButton onClick={() => {
                      handleReject(selectedRegistration.id);
                    }}>
                      {lang === "zh" ? "拒绝" : "Reject"}
                    </ModalButton>
                    <ModalButton $primary onClick={() => {
                      handleApprove(selectedRegistration.id);
                    }}>
                      {lang === "zh" ? "批准" : "Approve"}
                    </ModalButton>
                  </>
                )}
                {selectedRegistration?.status === 'rejected' && (
                  <>
                    <ModalButton onClick={() => setShowDetailsModal(false)}>
                      {lang === "zh" ? "关闭" : "Close"}
                    </ModalButton>
                    <ModalButton $primary onClick={() => {
                      handleApprove(selectedRegistration.id);
                    }}>
                      {lang === "zh" ? "改为批准" : "Change to Approve"}
                    </ModalButton>
                  </>
                )}
                {selectedRegistration?.status !== 'submitted' && selectedRegistration?.status !== 'rejected' && (
                  <ModalButton onClick={() => setShowDetailsModal(false)}>
                    {lang === "zh" ? "关闭" : "Close"}
                  </ModalButton>
                )}
              </>
            )}
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Reject Modal - Independent */}
      {showRejectModal && (
        <Modal $show={showRejectModal} onClick={() => setShowRejectModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <ModalTitle>{lang === 'zh' ? '拒绝注册' : 'Reject Registration'}</ModalTitle>
            <ModalText>
              {lang === 'zh' 
                ? '请输入拒绝原因（可选）：'
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
                setRegistrationToReject(null);
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

      {/* Approve Confirmation Modal - Independent */}
      {showApproveModal && (
        <Modal $show={showApproveModal} onClick={() => setShowApproveModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <ModalTitle>{lang === 'zh' ? '批准注册' : 'Approve Registration'}</ModalTitle>
            <ModalText>
              {lang === 'zh' 
                ? '确定要批准此注册吗？'
                : 'Are you sure you want to approve this registration?'}
            </ModalText>
            <ModalActions>
              <ModalButton onClick={() => {
                setShowApproveModal(false);
                setRegistrationToApprove(null);
              }}>
                {lang === 'zh' ? '取消' : 'Cancel'}
              </ModalButton>
              <ModalButton $primary onClick={handleConfirmApprove} style={{ background: '#10b981' }}>
                {lang === 'zh' ? '确认批准' : 'Confirm Approve'}
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
                ? '确定要撤销此注册链接吗？撤销后该链接将无法使用。'
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
    </MainLayout>
  );
}

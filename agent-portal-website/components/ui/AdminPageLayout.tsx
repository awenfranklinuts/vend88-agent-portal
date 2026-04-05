"use client";

import styled from "styled-components";

/* ─── Page Shell ─── */

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%);
  display: flex;
  padding-top: 65px;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 0 2rem 2rem 2rem;
  margin-left: 320px;
  overflow-y: auto;

  @media (max-width: 968px) {
    padding: 0 1rem 1rem 1rem;
    margin-left: 0;
  }
`;

export const ContentHeader = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  margin-bottom: 2rem;
`;

export const ContentHeaderFlex = styled(ContentHeader)`
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

export const HeaderLeft = styled.div``;

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 0.5rem;

  @media (max-width: 968px) {
    font-size: 1.5rem;
  }
`;

export const PageDescription = styled.p`
  font-size: 1rem;
  color: #5c6b7a;

  @media (max-width: 968px) {
    font-size: 0.875rem;
  }
`;

export const LoadingText = styled.div`
  text-align: center;
  font-size: 1.25rem;
  color: #5c6b7a;
  padding: 4rem;
`;

/* ─── Buttons ─── */

export const PrimaryButton = styled.button`
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

export const SecondaryButton = styled.button`
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

  &:hover {
    background: #d1d5db;
  }

  @media (max-width: 968px) {
    width: 100%;
  }
`;

/* ─── Search & Filter ─── */

export const SearchFilterContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 968px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 968px) {
    width: 100%;
  }
`;

export const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 968px) {
    width: 100%;
  }
`;

/* ─── Table ─── */

export const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  overflow: hidden;
`;

export const TableWrapper = styled.div`
  padding: 2rem;

  @media (max-width: 968px) {
    padding: 1rem;
    overflow-x: auto;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  @media (max-width: 968px) {
    min-width: 800px;
  }
`;

export const Thead = styled.thead`
  background: #f7faff;
`;

export const Th = styled.th`
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

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid #e0e7ef;
  transition: background 0.2s ease;

  &:hover {
    background: #f7faff;
  }
`;

export const Td = styled.td`
  padding: 1rem;
  color: #0a3655;
  font-size: 0.9375rem;

  @media (max-width: 968px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.8125rem;
  }
`;

export const ActionButton = styled.button<{ $variant?: "edit" | "delete" | "view" | "approve" | "reject" }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 0.5rem;
  white-space: nowrap;

  ${(p) => {
    switch (p.$variant) {
      case "delete":
      case "reject":
        return `background: #fee2e2; color: #991b1b; &:hover { background: #fecaca; }`;
      case "approve":
        return `background: #d1fae5; color: #065f46; &:hover { background: #a7f3d0; }`;
      default:
        return `background: #dbeafe; color: #1e40af; &:hover { background: #bfdbfe; }`;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 968px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
    margin-right: 0.25rem;
    margin-bottom: 0.25rem;
  }
`;

/* ─── Status Badge ─── */

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  ${(p) => {
    switch (p.$status) {
      case "pending":
        return "background: #fef3c7; color: #92400e;";
      case "submitted":
        return "background: #dbeafe; color: #1e40af;";
      case "approved":
      case "active":
        return "background: #d1fae5; color: #065f46;";
      case "rejected":
      case "cancelled":
      case "inactive":
        return "background: #fee2e2; color: #991b1b;";
      case "expired":
      case "draft":
        return "background: #e5e7eb; color: #374151;";
      case "super_admin":
        return "background: linear-gradient(135deg, rgba(126,34,206,0.12) 0%, rgba(168,85,247,0.12) 100%); color: #7e22ce;";
      case "admin":
        return "background: rgba(59, 130, 246, 0.1); color: #1e40af;";
      default:
        return "background: #e5e7eb; color: #374151;";
    }
  }}
`;

/* ─── Empty State ─── */

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #5c6b7a;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

export const EmptyText = styled.p`
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

export const EmptySubtext = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
`;

/* ─── Modal ─── */

export const Modal = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${(p) => (p.$show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 968px) {
    padding: 1.5rem;
    max-width: calc(100vw - 2rem);
    max-height: 95vh;
    border-radius: 12px;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1rem;

  @media (max-width: 968px) {
    font-size: 1.25rem;
  }
`;

export const ModalText = styled.p`
  color: #5c6b7a;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  @media (max-width: 968px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const ModalButton = styled.button<{ $primary?: boolean; $danger?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${(p) =>
    p.$danger
      ? `
    background: #ef4444;
    color: white;
    &:hover { background: #dc2626; }
  `
      : p.$primary
        ? `
    background: #3b82f6;
    color: white;
    &:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35); }
  `
        : `
    background: #e5e7eb;
    color: #374151;
    &:hover { background: #d1d5db; }
  `}

  @media (max-width: 968px) {
    width: 100%;
    padding: 0.875rem 1.5rem;
  }
`;

/* ─── Skeleton / Loading ─── */

const shimmer = `
  background: linear-gradient(90deg, #e0e7ef 25%, #f0f4f8 50%, #e0e7ef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export const SkeletonBox = styled.div<{ $width?: string; $height?: string }>`
  width: ${(p) => p.$width || "100%"};
  height: ${(p) => p.$height || "16px"};
  border-radius: 4px;
  ${shimmer}
`;

export const SkeletonCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`;

/* ─── Form Inputs ─── */

export const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  background: white;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0a3655;
  margin-bottom: 0.5rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

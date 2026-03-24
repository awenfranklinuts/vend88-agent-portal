"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";

// Field configuration type
export interface FormField {
  id: string;
  label: string;
  type: "text" | "email" | "phone" | "select" | "multiple_choice" | "textarea" | "number" | "date" | "address";
  required: boolean;
  placeholder?: string;
  order: number;
  custom?: boolean;
  options?: string[]; // For select and multiple choice fields
  choiceMode?: "single" | "multiple"; // For multiple choice fields
  group?: string; // For grouping related fields
  description?: string; // Description of what this field contains
}

// Available fields that can be selected
export const AVAILABLE_FIELDS: FormField[] = [
  {
    id: "contact_email",
    label: "Email Address",
    type: "email",
    required: true,
    order: 1,
    description: "Contact's email address for communication",
  },
  {
    id: "contact_name",
    label: "Contact Name",
    type: "text",
    required: true,
    order: 2,
    description: "Primary contact person's full name",
  },
  {
    id: "contact_phone",
    label: "Phone Number",
    type: "phone",
    required: true,
    order: 3,
    description: "Contact's phone number for direct calls",
  },
  {
    id: "messaging_app_type",
    label: "Messaging App",
    type: "select",
    required: true,
    order: 4,
    description: "Preferred messaging platform (WeChat, WhatsApp, etc.)",
  },
  {
    id: "quote_number",
    label: "Quote Number",
    type: "text",
    required: true,
    order: 5,
    description: "Quote or invoice number from sales",
  },
  {
    id: "business_name",
    label: "Business Name",
    type: "text",
    required: true,
    order: 6,
    description: "Official registered business name",
  },
  {
    id: "abn",
    label: "ABN",
    type: "text",
    required: true,
    order: 7,
    description: "Australian Business Number for verification",
  },
  {
    id: "registered_address",
    label: "Registered Address",
    type: "text",
    required: true,
    order: 8,
    group: "Address",
    description: "Street address of registration",
  },
  {
    id: "registered_suburb",
    label: "Suburb",
    type: "text",
    required: true,
    order: 9,
    group: "Address",
    description: "Suburb or locality",
  },
  {
    id: "registered_state",
    label: "State",
    type: "select",
    required: true,
    order: 10,
    group: "Address",
    description: "State or territory",
  },
  {
    id: "registered_postcode",
    label: "Postcode",
    type: "text",
    required: true,
    order: 11,
    group: "Address",
    description: "Postal code",
  },
  {
    id: "registered_country",
    label: "Country",
    type: "select",
    required: true,
    order: 12,
    group: "Address",
    description: "Country of registration",
  },
  {
    id: "eftpos_integration",
    label: "EFTPOS Integration",
    type: "select",
    required: true,
    order: 13,
    description: "EFTPOS payment system preferences",
  },
  {
    id: "alipay_option",
    label: "Alipay",
    type: "select",
    required: true,
    order: 14,
    description: "Alipay payment integration status",
  },
  {
    id: "ready_by",
    label: "Ready By",
    type: "textarea",
    required: true,
    order: 15,
    description: "Expected deployment timeline or date",
  },
  {
    id: "heard_about",
    label: "How You Heard About Us",
    type: "select",
    required: true,
    order: 16,
    group: "How You Heard About Us",
    description: "Source of referral or discovery",
  },
  {
    id: "heard_other",
    label: "Other Referral Source",
    type: "text",
    required: false,
    order: 17,
    group: "How You Heard About Us",
    description: "Please specify other referral source",
  },
  {
    id: "menu_files",
    label: "Menu Files",
    type: "text",
    required: true,
    order: 18,
    group: "Menu Files",
    description: "Menu files for the business (PDF, DOC, XLS)",
  },
  {
    id: "menu_send_later",
    label: "Send Menu Later",
    type: "text",
    required: false,
    order: 19,
    group: "Menu Files",
    description: "Option to send menu files at a later date",
  },
  {
    id: "notes",
    label: "Additional Notes",
    type: "textarea",
    required: true,
    order: 20,
    description: "Extra information or special requirements",
  },
];

interface FormFieldSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedFields: FormField[]) => void;
  isLoading?: boolean;
}

interface FieldRequirementState {
  [fieldId: string]: boolean; // true = required, false = optional
}

const Container = styled.div<{ $show: boolean }>`
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

const Content = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 1100px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 12px;
  }
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const HeaderText = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  font-size: 0.9375rem;
  color: #5c6b7a;
  line-height: 1.6;
`;

const FieldsContainer = styled.div`
  background: #f7faff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 2px solid #e0e7ef;
`;

const FieldsTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #0a3655;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SelectAllLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #5c6b7a;
  cursor: pointer;

  input {
    cursor: pointer;
    accent-color: #3b82f6;
  }
`;

const FieldsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FieldItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e7ef;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    background: #f0f7ff;
  }
`;

const FieldContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const FieldTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const FieldSubtitle = styled.span`
  font-size: 0.75rem;
  color: #7f8e9c;
  font-weight: 400;
  line-height: 1.3;
`;

const RequiredSelect = styled.select`
  padding: 0.35rem 0.5rem;
  border: 1px solid #e0e7ef;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  flex-shrink: 0;
  height: 40px;
  box-sizing: border-box;

  &:hover {
    border-color: #3b82f6;
    background: #f0f7ff;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  option {
    background: white;
    color: #0a3655;
  }
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #3b82f6;
  flex-shrink: 0;

  &:checked {
    animation: checkBounce 0.3s ease;
  }

  @keyframes checkBounce {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }
`;

const FieldLabel = styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9375rem;
  color: #0a3655;
  font-weight: 500;
`;

const RequiredBadge = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const OptionalBadge = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: #d1fae5;
  color: #065f46;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const FieldsCount = styled.div`
  font-size: 0.875rem;
  color: #5c6b7a;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px dashed #e0e7ef;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const CustomFieldsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 2px solid #e0e7ef;
`;

const SectionTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #0a3655;
  margin-bottom: 1.25rem;
`;

const CustomFieldsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CustomFieldRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr auto 40px;
  gap: 0.75rem;
  align-items: center;
  min-height: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e0e7ef;
  border-radius: 6px;
  font-size: 0.9375rem;
  color: #0a3655;
  transition: all 0.2s ease;
  height: 40px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  padding: 0.5rem 0.65rem;
  border: 1px solid #e0e7ef;
  border-radius: 6px;
  font-size: 0.9375rem;
  color: #0a3655;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 40px;
  box-sizing: border-box;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem;
  background: #fee2e2;
  color: #991b1b;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  box-sizing: border-box;

  &:hover {
    background: #fecaca;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const AddCustomFieldButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #ecfdf5;
  color: #065f46;
  border: 2px dashed #10b981;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;

  &:hover:not(:disabled) {
    background: #d1fae5;
    border-color: #059669;
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #d1d5db;
    color: #9ca3af;
  }
`;

const NewFieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr auto auto;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: center;
  min-height: 56px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const PreviewSwitchWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.15rem;
`;

const PreviewModeButton = styled.button<{ $active: boolean }>`
  border: none;
  background: transparent;
  padding: 0.25rem 0.15rem 0.45rem;
  font-size: 0.82rem;
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  color: ${(p) => (p.$active ? "#111827" : "#9ca3af")};
  letter-spacing: 0.1px;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;

  &:hover {
    color: #4b5563;
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px rgba(17, 24, 39, 0.12);
    border-radius: 4px;
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: #111827;
    transform: scaleX(${(p) => (p.$active ? 1 : 0)});
    transform-origin: center;
    transition: transform 0.2s ease;
  }
`;

const PreviewPanel = styled.div`
  background:
    radial-gradient(circle at 14% 10%, rgba(59, 130, 246, 0.08), transparent 22%),
    radial-gradient(circle at 90% 85%, rgba(147, 197, 253, 0.08), transparent 20%),
    linear-gradient(180deg, #f8fbff, #eef6ff);
  border: 1px solid #cfe2ff;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const PreviewCanvas = styled.div`
  max-width: 920px;
  margin: 0 auto;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.95));
  border: 1px solid rgba(147, 197, 253, 0.3);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(30, 64, 175, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.75);
`;

const PreviewHero = styled.div`
  text-align: center;
  padding: 2rem 1.25rem 1.4rem;
  background: linear-gradient(135deg, rgba(43, 123, 227, 0.08), rgba(94, 200, 255, 0.05));
  border-bottom: 1px solid rgba(147, 197, 253, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2b7be3, #5ec8ff, #2b7be3);
    background-size: 200% 100%;
  }
`;

const PreviewLogosContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  margin-bottom: 1.1rem;

  @media (max-width: 640px) {
    gap: 0.85rem;
  }
`;

const PreviewLogo = styled.img`
  height: 44px;
  width: auto;
  object-fit: contain;

  @media (max-width: 640px) {
    height: 36px;
  }
`;

const PreviewLogoDivider = styled.div`
  width: 1px;
  height: 28px;
  background: rgba(43, 123, 227, 0.2);
`;

const PreviewHeroTitle = styled.h4`
  margin: 0 0 0.6rem;
  color: #0b2b4a;
  font-size: 1.75rem;
  letter-spacing: 0.4px;
  font-weight: 900;
  line-height: 1.2;
  background: linear-gradient(135deg, #0b2b4a 0%, #2b7be3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 640px) {
    font-size: 1.45rem;
  }
`;

const PreviewHeroSubtitle = styled.p`
  margin: 0;
  color: #567;
  font-size: 0.98rem;
  line-height: 1.5;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 640px) {
    font-size: 0.92rem;
  }
`;

const PreviewBody = styled.div`
  padding: 1rem;
`;

const PreviewFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const PreviewGroup = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(245, 249, 255, 0.92));
  border: 1px dashed #bfdbfe;
  border-radius: 10px;
  padding: 0.85rem;
`;

const PreviewGroupTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.5rem;
`;

const PreviewField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  & + & {
    margin-top: 0.7rem;
  }
`;

const PreviewLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #3c5a78;
`;

const RequiredMark = styled.span`
  color: #b91c1c;
  margin-left: 0.25rem;
`;

const PreviewInput = styled.input`
  padding: 0.75rem 0.9rem;
  border: 1px solid rgba(60, 90, 120, 0.12);
  border-radius: 8px;
  background: linear-gradient(180deg, #fff, #fbfdff);
  color: #3c5a78;

  &:disabled {
    opacity: 1;
    color: #3c5a78;
    -webkit-text-fill-color: #3c5a78;
    cursor: not-allowed;
  }
`;

const PreviewSelect = styled.select`
  padding: 0.75rem 0.9rem;
  border: 1px solid rgba(60, 90, 120, 0.12);
  border-radius: 8px;
  background: linear-gradient(180deg, #fff, #fbfdff);
  color: #3c5a78;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233c5a78' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2rem;

  &:disabled {
    opacity: 1;
    color: #3c5a78;
    -webkit-text-fill-color: #3c5a78;
    cursor: not-allowed;
  }
`;

const PreviewTextarea = styled.textarea`
  padding: 0.75rem 0.9rem;
  border: 1px solid rgba(60, 90, 120, 0.12);
  border-radius: 8px;
  background: linear-gradient(180deg, #fff, #fbfdff);
  min-height: 92px;
  resize: vertical;

  &:disabled {
    opacity: 1;
    color: #3c5a78;
    -webkit-text-fill-color: #3c5a78;
    cursor: not-allowed;
  }
`;

const PreviewMenuSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(245, 249, 255, 0.92));
  border: 1px dashed #bfdbfe;
  border-radius: 10px;
  padding: 0.95rem;
`;

const PreviewMenuLabel = styled.label`
  font-weight: 600;
  color: #3c5a78;
  font-size: 0.9rem;
`;

const PreviewMenuDesc = styled.p`
  margin: 0 0 0.2rem;
  color: #5c6b7a;
  font-size: 12px;
  line-height: 1.4;
`;

const PreviewUploadButton = styled.button<{ $disabled: boolean }>`
  width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #2b7be3, #5ec8ff);
  color: white;
  font-weight: 600;
  transition: all 200ms ease;
  border: none;
  font-size: 1rem;
  cursor: ${(p) => (p.$disabled ? "not-allowed" : "pointer")};
  opacity: ${(p) => (p.$disabled ? 0.55 : 1)};

  &:hover {
    transform: ${(p) => (p.$disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(p) => (p.$disabled ? "none" : "0 8px 20px rgba(43,123,227,0.25)")};
  }
`;

const PreviewMenuHelper = styled.div`
  font-size: 11px;
  color: #789;
  font-style: italic;
`;

const PreviewMenuFileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.2rem;
`;

const PreviewMenuFileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: rgba(43,123,227,0.05);
  border-radius: 6px;
  font-size: 0.85rem;
  color: #3c5a78;
`;

const PreviewMenuRemoveButton = styled.button`
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

const PreviewMenuCheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #111827;
  font-size: 1rem;

  input {
    width: 16px;
    height: 16px;
  }
`;

const PreviewMenuFooter = styled.p`
  margin: 0.15rem 0 0;
  color: #5c6b7a;
  font-size: 11px;
  line-height: 1.45;
`;

const Button = styled.button<{ $primary?: boolean; $disabled?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: ${(p) => (p.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: ${(p) => (p.$disabled ? 0.6 : 1)};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
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

  ${(p) =>
    p.$primary
      ? `
    background: #3b82f6;
    color: white;
    &:hover:not(:disabled) {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
    }
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `
      : `
    background: #e5e7eb;
    color: #374151;
    &:hover:not(:disabled) {
      background: #d1d5db;
      transform: translateY(-1px);
    }
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `}

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.875rem 1.5rem;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  z-index: 10;

  &::after {
    content: "";
    width: 24px;
    height: 24px;
    border: 3px solid #e0e7ef;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const OrderButtons = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const OrderButton = styled.button`
  padding: 0.35rem 0.5rem;
  background: #e0e7ef;
  color: #0a3655;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #3b82f6;
    color: white;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const ValidationMessage = styled.span<{ $type: "error" | "warning" | "success" }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  
  ${(p) => {
    switch (p.$type) {
      case "error":
        return `background: #fee2e2; color: #991b1b;`;
      case "warning":
        return `background: #fef3c7; color: #b45309;`;
      case "success":
        return `background: #d1fae5; color: #065f46;`;
    }
  }}
`;

const CustomFieldCard = styled.div`
  background: #f7faff;
  border: 1px solid #e0e7ef;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SelectOptionsSection = styled.div`
  padding: 0.75rem;
  background: #f0f7ff;
  border-radius: 6px;
  border: 1px dashed #3b82f6;
`;

const SelectOptionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const SelectOptionTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.65rem;
  background: white;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #0a3655;

  button {
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    padding: 0;
    font-weight: 600;
    font-size: 0.85rem;
    
    &:hover {
      color: #991b1b;
    }
  }
`;

const AddOptionInput = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const OptionInput = styled.input`
  flex: 1;
  padding: 0.5rem 0.65rem;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  font-size: 0.85rem;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const AddOptionButton = styled.button`
  padding: 0.5rem 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
  }
`;

export const FormFieldSelector: React.FC<FormFieldSelectorProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const { lang } = useLanguage();
  
  // Helper function to get translated text
  const t = (key: keyof typeof dict): string => {
    const translation = dict[key as keyof typeof dict] as any;
    return translation?.[lang] || translation?.["en"] || key;
  };

  // Helper function to get translated field label and description
  const getFieldTranslation = (fieldId: string) => {
    const translationMap: { [key: string]: { label: keyof typeof dict; desc: keyof typeof dict } } = {
      contact_name: { label: "contactName", desc: "contactNameDesc" },
      contact_email: { label: "emailAddress", desc: "emailAddressDesc" },
      contact_phone: { label: "phoneNumber", desc: "phoneNumberDesc" },
      business_name: { label: "businessName", desc: "businessNameDesc" },
      abn: { label: "abn", desc: "abnDesc" },
      registered_address: { label: "registeredAddress", desc: "registeredAddressDesc" },
      registered_suburb: { label: "suburb", desc: "suburbDesc" },
      registered_state: { label: "state", desc: "stateDesc" },
      registered_postcode: { label: "postcode", desc: "postcodeDesc" },
      registered_country: { label: "country", desc: "countryDesc" },
      messaging_app_type: { label: "messagingApp", desc: "messagingAppDesc" },
      eftpos_integration: { label: "eftposIntegration", desc: "eftposIntegrationDesc" },
      alipay_option: { label: "alipay", desc: "alipayDesc" },
      quote_number: { label: "quoteNumber", desc: "quoteNumberDesc" },
      ready_by: { label: "readyBy", desc: "readyByDesc" },
      heard_about: { label: "heardAbout", desc: "heardAboutDesc" },
      heard_other: { label: "heardOther", desc: "heardOtherDesc" },
      menu_files: { label: "menuFiles", desc: "menuFilesDesc" },
      menu_send_later: { label: "menuSendLater", desc: "menuSendLaterDesc" },
      notes: { label: "additionalNotes", desc: "additionalNotesDesc" },
    };
    
    const mapping = translationMap[fieldId];
    return {
      label: mapping ? t(mapping.label) : fieldId,
      description: mapping ? t(mapping.desc) : "",
    };
  };

  const getGroupTranslation = (groupName: string) => {
    const groupTranslationMap: { [key: string]: { label: keyof typeof dict; desc: keyof typeof dict } } = {
      "Address": { label: "address", desc: "addressDesc" },
      "How You Heard About Us": { label: "heardAbout", desc: "heardAboutDesc" },
      "Menu Files": { label: "menuFiles", desc: "menuFilesDesc" },
    };

    const mapping = groupTranslationMap[groupName];
    return {
      label: mapping ? t(mapping.label) : groupName,
      description: mapping ? t(mapping.desc) : "",
    };
  };

  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set(AVAILABLE_FIELDS.map((f) => f.id))
  );

  const [fieldRequirements, setFieldRequirements] = useState<FieldRequirementState>(() => {
    const initial: FieldRequirementState = {};
    AVAILABLE_FIELDS.forEach((f) => {
      initial[f.id] = f.required;
    });
    return initial;
  });

  const [customFields, setCustomFields] = useState<FormField[]>([]);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<FormField["type"]>("text");
  const [newFieldRequired, setNewFieldRequired] = useState(true);
  const [expandedSelectField, setExpandedSelectField] = useState<string | null>(null);
  const [newOptionText, setNewOptionText] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewSendMenuLater, setPreviewSendMenuLater] = useState(false);
  const [previewMenuFiles, setPreviewMenuFiles] = useState<string[]>([]);
  const [allFieldsOrder, setAllFieldsOrder] = useState<string[]>(
    AVAILABLE_FIELDS.map((f) => f.id)
  );

  // Get all fields (available + custom) ordered by current order state
  const getAllOrderedFields = () => {
    const availableFieldMap = new Map(AVAILABLE_FIELDS.map((f) => [f.id, f]));
    const customFieldMap = new Map(customFields.map((f) => [f.id, f]));
    
    return allFieldsOrder
      .map((id) => availableFieldMap.get(id) || customFieldMap.get(id))
      .filter((f) => f !== undefined) as FormField[];
  };

  // Get available fields ordered by current order state
  const getOrderedAvailableFields = () => {
    return getAllOrderedFields().filter((f) => !f.custom);
  };

  // Validation check for duplicate field names
  const getDuplicateError = (fieldName: string, excludeId?: string): boolean => {
    if (!fieldName.trim()) return false;
    
    const nameExists = customFields.some(
      (f) => f.label.toLowerCase() === fieldName.toLowerCase() && f.id !== excludeId
    );
    
    const availableNameExists = AVAILABLE_FIELDS.some(
      (f) => f.label.toLowerCase() === fieldName.toLowerCase()
    );
    
    return nameExists || availableNameExists;
  };

  const handleToggleField = (fieldId: string) => {
    const newSelected = new Set(selectedFields);
    if (newSelected.has(fieldId)) {
      newSelected.delete(fieldId);
    } else {
      newSelected.add(fieldId);
    }
    setSelectedFields(newSelected);
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedFields(new Set(AVAILABLE_FIELDS.map((f) => f.id)));
    } else {
      setSelectedFields(new Set());
    }
  };

  const handleChangeRequirement = (fieldId: string, required: boolean) => {
    setFieldRequirements((prev) => ({
      ...prev,
      [fieldId]: required,
    }));
  };

  const handleAddCustomField = () => {
    if (!newFieldName.trim()) return;
    if (getDuplicateError(newFieldName)) return;

    const fieldId = `custom_${Date.now()}`;
    const customField: FormField = {
      id: fieldId,
      label: newFieldName,
      type: newFieldType,
      required: newFieldRequired,
      order: AVAILABLE_FIELDS.length + customFields.length + 1,
      custom: true,
      options: (newFieldType === "select" || newFieldType === "multiple_choice") ? [] : undefined,
      choiceMode: newFieldType === "multiple_choice" ? "multiple" : undefined,
    };

    setCustomFields([...customFields, customField]);
    setAllFieldsOrder([...allFieldsOrder, fieldId]); // Add custom field to order list
    setNewFieldName("");
    setNewFieldType("text");
    setNewFieldRequired(true);
  };

  const handleDeleteCustomField = (fieldId: string) => {
    setCustomFields(customFields.filter((f) => f.id !== fieldId));
    setAllFieldsOrder(allFieldsOrder.filter((id) => id !== fieldId)); // Remove from order list
  };

  const handleUpdateCustomField = (
    fieldId: string,
    updates: Partial<FormField>
  ) => {
    setCustomFields(
      customFields.map((f) =>
        f.id === fieldId ? { ...f, ...updates } : f
      )
    );
  };

  // Move field up in order

  // Add option to select field
  const handleAddSelectOption = (fieldId: string, optionText: string) => {
    if (!optionText.trim()) return;
    
    setCustomFields(
      customFields.map((f) => {
        if (f.id === fieldId) {
          const options = f.options || [];
          if (!options.includes(optionText)) {
            return { ...f, options: [...options, optionText] };
          }
        }
        return f;
      })
    );
    setNewOptionText("");
  };

  // Remove option from select field
  const handleRemoveSelectOption = (fieldId: string, optionText: string) => {
    setCustomFields(
      customFields.map((f) => {
        if (f.id === fieldId && f.options) {
          return { ...f, options: f.options.filter((opt) => opt !== optionText) };
        }
        return f;
      })
    );
  };

  // Move field up in unified order
  const handleMoveFieldUp = (fieldId: string) => {
    const index = allFieldsOrder.indexOf(fieldId);
    if (index <= 0) return;
    
    const newOrder = [...allFieldsOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setAllFieldsOrder(newOrder);
  };

  // Move field down in unified order
  const handleMoveFieldDown = (fieldId: string) => {
    const index = allFieldsOrder.indexOf(fieldId);
    if (index >= allFieldsOrder.length - 1) return;
    
    const newOrder = [...allFieldsOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setAllFieldsOrder(newOrder);
  };

  // Move grouped fields together (for address group)
  const handleMoveGroupUp = (groupFieldIds: string[]) => {
    const newOrder = [...allFieldsOrder];
    const groupIndices = groupFieldIds
      .map((id) => newOrder.indexOf(id))
      .filter((idx) => idx >= 0)
      .sort((a, b) => a - b);
    
    if (groupIndices.length === 0 || groupIndices[0] === 0) return;
    
    const minIndex = groupIndices[0];
    // Move the item before the group to the end of the group
    [newOrder[minIndex - 1], newOrder[minIndex]] = [newOrder[minIndex], newOrder[minIndex - 1]];
    setAllFieldsOrder(newOrder);
  };

  // Move grouped fields together (for address group)
  const handleMoveGroupDown = (groupFieldIds: string[]) => {
    const newOrder = [...allFieldsOrder];
    const groupIndices = groupFieldIds
      .map((id) => newOrder.indexOf(id))
      .filter((idx) => idx >= 0)
      .sort((a, b) => a - b);
    
    if (groupIndices.length === 0 || groupIndices[groupIndices.length - 1] >= newOrder.length - 1) return;
    
    const maxIndex = groupIndices[groupIndices.length - 1];
    // Move the item after the group to the start of the group
    [newOrder[maxIndex], newOrder[maxIndex + 1]] = [newOrder[maxIndex + 1], newOrder[maxIndex]];
    setAllFieldsOrder(newOrder);
  };

  const handleConfirm = () => {
    const orderedAvailableFields = getOrderedAvailableFields();
    const selectedFieldsArray = orderedAvailableFields.filter((f) =>
      selectedFields.has(f.id)
    )
      .map((f, index) => ({
        ...f,
        required: fieldRequirements[f.id] ?? f.required,
        order: index + 1, // Update order based on new sequence
      }));

    // Update custom field orders to follow available fields
    const customFieldsWithOrder = customFields.map((f, index) => ({
      ...f,
      order: selectedFieldsArray.length + index + 1,
    }));

    const allFields = [...selectedFieldsArray, ...customFieldsWithOrder];

    onConfirm(allFields);
  };

  const allSelected = selectedFields.size === AVAILABLE_FIELDS.length;
  const selectedCount = selectedFields.size;

  const getPreviewFields = () => {
    return getAllOrderedFields()
      .filter((field) => field.custom || selectedFields.has(field.id))
      .map((field) => {
        if (field.custom) {
          return field;
        }

        return {
          ...field,
          required: fieldRequirements[field.id] ?? field.required,
        };
      });
  };

  const renderPreviewControl = (field: FormField) => {
    const translatedLabel = field.custom ? field.label : getFieldTranslation(field.id).label;

    switch (field.type) {
      case "textarea":
        return <PreviewTextarea disabled placeholder={translatedLabel} />;
      case "select":
        return (
          <PreviewSelect disabled>
            <option>{translatedLabel}</option>
            {(field.options || []).map((option) => (
              <option key={option}>{option}</option>
            ))}
          </PreviewSelect>
        );
      case "multiple_choice":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {(field.options && field.options.length > 0 ? field.options : [translatedLabel]).map((option) => (
              <label key={option} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#3c5a78", fontSize: "0.9rem" }}>
                <input
                  type={field.choiceMode === "single" ? "radio" : "checkbox"}
                  disabled
                  name={field.choiceMode === "single" ? `preview_${field.id}` : undefined}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      case "date":
        return <PreviewInput disabled type="date" />;
      case "number":
        return <PreviewInput disabled type="number" placeholder={translatedLabel} />;
      case "email":
        return <PreviewInput disabled type="email" placeholder={translatedLabel} />;
      case "phone":
        return <PreviewInput disabled type="tel" placeholder={translatedLabel} />;
      default:
        return <PreviewInput disabled type="text" placeholder={translatedLabel} />;
    }
  };

  return (
    <Container $show={isOpen} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Content style={{ position: "relative" }}>
        {isLoading && <LoadingOverlay />}

        <Header>
          <HeaderTop>
            <HeaderText>
              <Title>{t("createCustomRegistrationForm")}</Title>
              <Description>
                {t("selectFieldsDescription")}
              </Description>
            </HeaderText>
            <PreviewSwitchWrap>
              <PreviewModeButton
                type="button"
                $active={!showPreview}
                aria-label={lang === "zh" ? "切换到编辑模式" : "Switch to edit mode"}
                aria-pressed={!showPreview}
                onClick={() => setShowPreview(false)}
              >
                {lang === "zh" ? "编辑" : "Edit"}
              </PreviewModeButton>
              <PreviewModeButton
                type="button"
                $active={showPreview}
                aria-label={lang === "zh" ? "切换到预览模式" : "Switch to preview mode"}
                aria-pressed={showPreview}
                onClick={() => setShowPreview(true)}
              >
                {lang === "zh" ? "预览" : "Preview"}
              </PreviewModeButton>
            </PreviewSwitchWrap>
          </HeaderTop>
        </Header>

        {!showPreview && (
        <>
        <FieldsContainer>
          <FieldsTitle>
            {t("allFields")}
            <SelectAllLabel>
              <Checkbox
                checked={allSelected}
                onChange={(e) => handleToggleAll(e.target.checked)}
              />
              {t("selectAll")}
            </SelectAllLabel>
          </FieldsTitle>

          <FieldsList>
            {(() => {
              const allFields = getAllOrderedFields();
              
              // Helper function to toggle all fields in a group
              const handleToggleGroup = (groupName: string, groupFields: FormField[]) => {
                const groupFieldIds = groupFields.map((f) => f.id);
                const allGroupSelected = groupFieldIds.every((id) => selectedFields.has(id));
                
                const newSelected = new Set(selectedFields);
                if (allGroupSelected) {
                  groupFieldIds.forEach((id) => newSelected.delete(id));
                } else {
                  groupFieldIds.forEach((id) => newSelected.add(id));
                }
                setSelectedFields(newSelected);
              };
              
              // Track rendered groups to avoid duplicates
              const renderedGroups = new Set<string>();
              
              return (
                <>
                  {/* Render fields in order, handling groups inline */}
                  {allFields.map((field) => {
                    // If this field is part of a group, render the group only once
                    if (field.group) {
                      if (renderedGroups.has(field.group)) {
                        return null; // Group already rendered
                      }
                      renderedGroups.add(field.group);
                      
                      const groupName = field.group; // Capture for type narrowing in callbacks
                      // Get all fields in this group
                      const groupFields = allFields.filter((f) => f.group === groupName);
                      const groupFieldIds = groupFields.map((f) => f.id);
                      const allGroupSelected = groupFieldIds.every((id) => selectedFields.has(id));
                      
                      // Calculate group requirement state (if all are required, show "required", else "optional")
                      const allGroupRequired = groupFieldIds.every((id) => fieldRequirements[id] ?? groupFields.find(f => f.id === id)?.required ?? false);
                      const groupRequirementState = allGroupRequired ? "required" : "optional";
                      
                      const groupIndices = groupFieldIds
                        .map((id) => allFieldsOrder.indexOf(id))
                        .filter((idx) => idx >= 0)
                        .sort((a, b) => a - b);
                      const minGroupIndex = groupIndices.length > 0 ? groupIndices[0] : -1;
                      const maxGroupIndex = groupIndices.length > 0 ? groupIndices[groupIndices.length - 1] : -1;
                      
                      return (
                        <FieldItem key={groupName}>
                          <Checkbox
                            checked={allGroupSelected}
                            onChange={() => handleToggleGroup(groupName, groupFields)}
                          />
                          <FieldContent>
                            <FieldTextWrapper>
                              <FieldLabel>
                                {getGroupTranslation(groupName).label}
                              </FieldLabel>
                              <FieldSubtitle>{getGroupTranslation(groupName).description}</FieldSubtitle>
                            </FieldTextWrapper>
                          </FieldContent>
                          <RequiredSelect
                            value={groupRequirementState}
                            onChange={(e) => {
                              const required = e.target.value === "required";
                              groupFieldIds.forEach((id) => {
                                handleChangeRequirement(id, required);
                              });
                            }}
                          >
                            <option value="required">{t("required")}</option>
                            <option value="optional">{t("optional")}</option>
                          </RequiredSelect>
                          <OrderButtons>
                            <OrderButton
                              onClick={() => handleMoveGroupUp(groupFieldIds)}
                              disabled={minGroupIndex <= 0}
                              title="Move group up"
                            >
                              ↑
                            </OrderButton>
                            <OrderButton
                              onClick={() => handleMoveGroupDown(groupFieldIds)}
                              disabled={maxGroupIndex >= allFieldsOrder.length - 1}
                              title="Move group down"
                            >
                              ↓
                            </OrderButton>
                          </OrderButtons>
                        </FieldItem>
                      );
                    }
                    
                    // Render ungrouped fields
                    const fieldIndex = allFieldsOrder.indexOf(field.id);
                    
                    // Render custom fields as editable cards, available fields as checkboxes
                    if (field.custom) {
                      const isDuplicate = getDuplicateError(field.label, field.id);
                      return (
                        <CustomFieldCard key={field.id}>
                          <CustomFieldRow>
                            <Input
                              type="text"
                              value={field.label}
                              onChange={(e) => handleUpdateCustomField(field.id, { label: e.target.value })}
                              placeholder={t("fieldName")}
                              style={isDuplicate ? { borderColor: "#ef4444", background: "#fef2f2" } : {}}
                            />
                            <Select
                              value={field.type}
                              onChange={(e) => {
                                const newType = e.target.value as FormField["type"];
                                handleUpdateCustomField(field.id, { 
                                  type: newType,
                                  options: (newType === "select" || newType === "multiple_choice") ? (field.options || []) : undefined,
                                  choiceMode: newType === "multiple_choice" ? (field.choiceMode || "multiple") : undefined,
                                });
                              }}
                            >
                              <option value="text">{t("fieldTypeText")}</option>
                              <option value="email">{t("fieldTypeEmail")}</option>
                              <option value="phone">{t("fieldTypePhone")}</option>
                              <option value="number">{t("fieldTypeNumber")}</option>
                              <option value="date">{t("fieldTypeDate")}</option>
                              <option value="textarea">{t("fieldTypeLongText")}</option>
                              <option value="select">{t("fieldTypeDropdown")}</option>
                              <option value="multiple_choice">{t("fieldTypeMultipleChoice")}</option>
                              <option value="address">{t("fieldTypeAddress")}</option>
                            </Select>
                            <RequiredSelect
                              value={field.required ? "required" : "optional"}
                              onChange={(e) => handleUpdateCustomField(field.id, { required: e.target.value === "required" })}
                            >
                              <option value="required">{t("required")}</option>
                              <option value="optional">{t("optional")}</option>
                            </RequiredSelect>
                            <OrderButtons>
                              <OrderButton
                                onClick={() => handleMoveFieldUp(field.id)}
                                disabled={fieldIndex === 0}
                                title="Move up"
                              >
                                ↑
                              </OrderButton>
                              <OrderButton
                                onClick={() => handleMoveFieldDown(field.id)}
                                disabled={fieldIndex === allFieldsOrder.length - 1}
                                title="Move down"
                              >
                                ↓
                              </OrderButton>
                            </OrderButtons>
                            <DeleteButton onClick={() => handleDeleteCustomField(field.id)}>
                              ✕
                            </DeleteButton>
                          </CustomFieldRow>
                          
                          {/* Validation message */}
                          {isDuplicate && (
                            <ValidationMessage $type="error">
                              ⚠ {t("fieldNameAlreadyExists")}
                            </ValidationMessage>
                          )}
                          
                          {/* Select options section */}
                          {(field.type === "select" || field.type === "multiple_choice") && (
                            <SelectOptionsSection>
                              <div style={{ fontSize: "0.8rem", fontWeight: "600", color: "#0a3655", marginBottom: "0.75rem" }}>
                                {field.type === "multiple_choice" ? t("multipleChoiceOptions") : t("dropdownOptions")}
                              </div>

                              {field.type === "multiple_choice" && (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                                  <div style={{ fontSize: "0.8rem", color: "#5c6b7a", minWidth: "110px" }}>
                                    {t("choiceSelectionMode")}
                                  </div>
                                  <Select
                                    value={field.choiceMode || "multiple"}
                                    onChange={(e) => handleUpdateCustomField(field.id, { choiceMode: e.target.value as "single" | "multiple" })}
                                    style={{ maxWidth: "180px", height: "34px", fontSize: "0.8rem" }}
                                  >
                                    <option value="single">{t("choiceModeSingle")}</option>
                                    <option value="multiple">{t("choiceModeMultiple")}</option>
                                  </Select>
                                </div>
                              )}
                              
                              {(field.options && field.options.length > 0) && (
                                <SelectOptionsList>
                                  {field.options.map((option, optIdx) => (
                                    <SelectOptionTag key={optIdx}>
                                      {option}
                                      <button
                                        onClick={() => handleRemoveSelectOption(field.id, option)}
                                        type="button"
                                      >
                                        ✕
                                      </button>
                                    </SelectOptionTag>
                                  ))}
                                </SelectOptionsList>
                              )}
                              
                              <AddOptionInput>
                                <OptionInput
                                  type="text"
                                  placeholder={t("optionText")}
                                  value={expandedSelectField === field.id ? newOptionText : ""}
                                  onChange={(e) => setNewOptionText(e.target.value)}
                                  onFocus={() => setExpandedSelectField(field.id)}
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      handleAddSelectOption(field.id, newOptionText);
                                    }
                                  }}
                                />
                                <AddOptionButton
                                  onClick={() => handleAddSelectOption(field.id, newOptionText)}
                                  type="button"
                                >
                                  {t("add")}
                                </AddOptionButton>
                              </AddOptionInput>
                            </SelectOptionsSection>
                          )}
                        </CustomFieldCard>
                      );
                    }
                    
                    return (
                      <FieldItem key={field.id}>
                        <Checkbox
                          checked={selectedFields.has(field.id)}
                          onChange={() => handleToggleField(field.id)}
                        />
                        <FieldContent>
                          <FieldTextWrapper>
                            <FieldLabel htmlFor={field.id}>
                              {getFieldTranslation(field.id).label}
                            </FieldLabel>
                            {getFieldTranslation(field.id).description && (
                              <FieldSubtitle>{getFieldTranslation(field.id).description}</FieldSubtitle>
                            )}
                          </FieldTextWrapper>
                        </FieldContent>
                        <RequiredSelect
                          value={fieldRequirements[field.id] ?? field.required ? "required" : "optional"}
                          onChange={(e) => handleChangeRequirement(field.id, e.target.value === "required")}
                        >
                          <option value="required">{t("required")}</option>
                          <option value="optional">{t("optional")}</option>
                        </RequiredSelect>
                        <OrderButtons>
                          <OrderButton
                            onClick={() => handleMoveFieldUp(field.id)}
                            disabled={fieldIndex === 0}
                            title="Move up"
                          >
                            ↑
                          </OrderButton>
                          <OrderButton
                            onClick={() => handleMoveFieldDown(field.id)}
                            disabled={fieldIndex === allFieldsOrder.length - 1}
                            title="Move down"
                          >
                            ↓
                          </OrderButton>
                        </OrderButtons>
                      </FieldItem>
                    );
                  })}
                </>
              );
            })()}
          </FieldsList>
        </FieldsContainer>

        <CustomFieldsSection>
          <SectionTitle>{t("addCustomFieldForm")}</SectionTitle>

          <NewFieldGrid>
            <Input
              type="text"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder={t("fieldName")}
              onKeyPress={(e) => e.key === "Enter" && handleAddCustomField()}
              style={getDuplicateError(newFieldName) ? { borderColor: "#ef4444", background: "#fef2f2" } : {}}
            />
            <Select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value as FormField["type"])}
            >
              <option value="text">{t("fieldTypeText")}</option>
              <option value="email">{t("fieldTypeEmail")}</option>
              <option value="phone">{t("fieldTypePhone")}</option>
              <option value="number">{t("fieldTypeNumber")}</option>
              <option value="date">{t("fieldTypeDate")}</option>
              <option value="textarea">{t("fieldTypeLongText")}</option>
              <option value="select">{t("fieldTypeDropdown")}</option>
              <option value="multiple_choice">{t("fieldTypeMultipleChoice")}</option>
              <option value="address">{t("fieldTypeAddress")}</option>
            </Select>
            <RequiredSelect
              value={newFieldRequired ? "required" : "optional"}
              onChange={(e) => setNewFieldRequired(e.target.value === "required")}
            >
              <option value="required">{t("required")}</option>
              <option value="optional">{t("optional")}</option>
            </RequiredSelect>
          </NewFieldGrid>

          {/* Validation message for new field */}
          {newFieldName.trim() && getDuplicateError(newFieldName) && (
            <div style={{ marginTop: "0.5rem" }}>
              <ValidationMessage $type="error">
                ⚠ {t("fieldNameAlreadyExists")}
              </ValidationMessage>
            </div>
          )}

          <AddCustomFieldButton 
            onClick={handleAddCustomField}
            disabled={getDuplicateError(newFieldName)}
          >
            {t("addCustomField")}
          </AddCustomFieldButton>
        </CustomFieldsSection>

        <FieldsCount>
          {selectedCount + customFields.length} {t("totalFieldsSelected")}
        </FieldsCount>
        </>
        )}

        {showPreview && (
          <PreviewPanel>
            <PreviewCanvas>
              <PreviewHero>
                <PreviewLogosContainer>
                  <PreviewLogo src="/images/brand.png" alt="Vend88" />
                  <PreviewLogoDivider />
                  <PreviewLogo src="/images/pospal.png" alt="PosPal" />
                </PreviewLogosContainer>
                <PreviewHeroTitle>{lang === "zh" ? "注册表单" : "Registration Form"}</PreviewHeroTitle>
                <PreviewHeroSubtitle>
                  {lang === "zh"
                    ? "请填写此注册表以开始您的入驻流程"
                    : "Please fill out this registration form to begin your onboarding process"}
                </PreviewHeroSubtitle>
              </PreviewHero>

              <PreviewBody>
                <PreviewFields>
                  {(() => {
                    const previewFields = getPreviewFields();
                    const renderedGroups = new Set<string>();

                    return previewFields.map((field) => {
                      if (field.group) {
                        if (renderedGroups.has(field.group)) {
                          return null;
                        }

                        renderedGroups.add(field.group);
                        const groupFields = previewFields.filter((item) => item.group === field.group);

                        if (field.group === "Menu Files") {
                          const menuRequired = groupFields.some((f) => f.required);

                          return (
                            <PreviewMenuSection key={field.group}>
                              <PreviewMenuLabel>
                                {lang === "zh" ? "菜单或产品清单上传" : "Menu or Product List Upload"}
                                {menuRequired && <RequiredMark>*</RequiredMark>}
                              </PreviewMenuLabel>
                              <PreviewMenuDesc>
                                {lang === "zh"
                                  ? "如果您的菜单或产品清单已准备好，请上传 PDF、Word 或 Excel 文件。"
                                  : "If your menu or product list is ready, please upload it in PDF, Word, or Excel format."}
                              </PreviewMenuDesc>

                              <PreviewUploadButton
                                type="button"
                                $disabled={previewSendMenuLater}
                                onClick={() => {
                                  if (previewSendMenuLater) return;
                                  setPreviewMenuFiles((prev) => [...prev, `menu-${prev.length + 1}.pdf`]);
                                }}
                              >
                                <span>⇪</span>
                                {lang === "zh" ? "选择文件" : "Choose Files"}
                              </PreviewUploadButton>

                              <PreviewMenuHelper>
                                {lang === "zh" ? "注意：您可以上传多个文件" : "Note: You can upload multiple files"}
                              </PreviewMenuHelper>

                              {previewMenuFiles.length > 0 && (
                                <PreviewMenuFileList>
                                  {previewMenuFiles.map((fileName, idx) => (
                                    <PreviewMenuFileItem key={`${fileName}-${idx}`}>
                                      <span>{fileName}</span>
                                      <PreviewMenuRemoveButton
                                        type="button"
                                        onClick={() => setPreviewMenuFiles((prev) => prev.filter((_, i) => i !== idx))}
                                      >
                                        ✕
                                      </PreviewMenuRemoveButton>
                                    </PreviewMenuFileItem>
                                  ))}
                                </PreviewMenuFileList>
                              )}

                              <PreviewMenuCheckboxRow>
                                <input
                                  type="checkbox"
                                  checked={previewSendMenuLater}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setPreviewSendMenuLater(checked);
                                    if (checked) {
                                      setPreviewMenuFiles([]);
                                    }
                                  }}
                                />
                                <span>{lang === "zh" ? "我稍后发送" : "I will send it later"}</span>
                              </PreviewMenuCheckboxRow>

                              <PreviewMenuFooter>
                                {lang === "zh"
                                  ? "如果您尚未准备好也没关系。准备好后，请至少在 POS 终端部署前 1-2 周提供。"
                                  : "No worries if you're not ready yet. When available, please provide it at least 1-2 weeks before POS terminal deployment."}
                              </PreviewMenuFooter>
                            </PreviewMenuSection>
                          );
                        }

                        return (
                          <PreviewGroup key={field.group}>
                            <PreviewGroupTitle>{getGroupTranslation(field.group).label}</PreviewGroupTitle>
                            {groupFields.map((groupField) => {
                              const translatedLabel = groupField.custom
                                ? groupField.label
                                : getFieldTranslation(groupField.id).label;

                              return (
                                <PreviewField key={groupField.id}>
                                  <PreviewLabel>
                                    {translatedLabel}
                                    {groupField.required && <RequiredMark>*</RequiredMark>}
                                  </PreviewLabel>
                                  {renderPreviewControl(groupField)}
                                </PreviewField>
                              );
                            })}
                          </PreviewGroup>
                        );
                      }

                      const translatedLabel = field.custom ? field.label : getFieldTranslation(field.id).label;
                      return (
                        <PreviewField key={field.id}>
                          <PreviewLabel>
                            {translatedLabel}
                            {field.required && <RequiredMark>*</RequiredMark>}
                          </PreviewLabel>
                          {renderPreviewControl(field)}
                        </PreviewField>
                      );
                    });
                  })()}
                </PreviewFields>
              </PreviewBody>
            </PreviewCanvas>
          </PreviewPanel>
        )}

        <Actions>
          <Button onClick={onClose} disabled={isLoading}>
            {t("cancel")}
          </Button>
          <Button
            $primary
            onClick={handleConfirm}
            disabled={(selectedCount + customFields.length) === 0 || isLoading}
          >
            {isLoading ? t("generatingLink") : t("generateLink")}
          </Button>
        </Actions>
      </Content>
    </Container>
  );
};

export default FormFieldSelector;

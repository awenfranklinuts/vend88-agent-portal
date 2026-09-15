"use client";

import styled from "styled-components";
import type { QuotationStatus } from "@/lib/quotations";

export const Card = styled.section`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 968px) {
    padding: 1rem;
  }
`;

export const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1rem;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0 1rem;
`;

export const ErrorText = styled.p`
  color: #b91c1c;
  font-size: 0.8125rem;
  margin-top: 0.25rem;
`;

export const Muted = styled.span`
  color: #5c6b7a;
  font-size: 0.8125rem;
`;

export const BackLink = styled.button`
  background: none;
  border: none;
  color: #1e40af;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

export const TextButton = styled.button<{ $danger?: boolean }>`
  background: none;
  border: none;
  color: ${p => (p.$danger ? "#b91c1c" : "#1e40af")};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.35rem 0.5rem;
  border-radius: 6px;

  &:hover {
    background: ${p => (p.$danger ? "#fee2e2" : "#dbeafe")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const STATUS_COLOURS: Record<QuotationStatus, { bg: string; fg: string }> = {
  draft: { bg: "#e5e7eb", fg: "#374151" },
  sent: { bg: "#dbeafe", fg: "#1e40af" },
  accepted: { bg: "#d1fae5", fg: "#065f46" },
  declined: { bg: "#fee2e2", fg: "#991b1b" },
  expired: { bg: "#fef3c7", fg: "#92400e" },
  superseded: { bg: "#f3f4f6", fg: "#6b7280" },
};

export const QuoteStatusBadge = styled.span<{ $status: QuotationStatus }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  background: ${p => STATUS_COLOURS[p.$status].bg};
  color: ${p => STATUS_COLOURS[p.$status].fg};
`;

export const TotalsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;

  td {
    padding: 0.4rem 0;
    color: #0a3655;
  }

  td:last-child {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  tr.total td {
    font-weight: 700;
    border-top: 1px solid #e0e7ef;
    padding-top: 0.6rem;
  }

  tr.muted td {
    color: #5c6b7a;
    font-size: 0.875rem;
  }
`;

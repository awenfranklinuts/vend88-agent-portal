"use client";

import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

// The shell the three email-auth pages share (forgot password, reset password,
// accept invite). Deliberately a narrower, single-column version of the login
// page's split layout: these pages are a single short task arrived at from an
// email, not a destination, so they get the brand and the form and nothing else.

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%);
  padding: 1rem;
`;

const Box = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(30, 64, 175, 0.12);
  width: 100%;
  max-width: 440px;
  min-width: 0;
  box-sizing: border-box;

  @media (max-width: 520px) {
    padding: 2rem 1.5rem;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 360px) {
    flex-direction: column;
    gap: 0.625rem;
  }
`;

const BrandLabel = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0a3655;
  padding-left: 1rem;
  border-left: 2px solid rgba(26, 35, 126, 0.3);
  white-space: nowrap;

  @media (max-width: 360px) {
    padding-left: 0;
    border-left: none;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #0a3655;
  margin: 0 0 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: #5c6b7a;
  margin: 0 0 1.75rem;
  text-align: center;
  line-height: 1.6;
`;

const BackLink = styled(Link)`
  display: block;
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #1a237e;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #222831;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e0e7ef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #1a237e;
    box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
  }

  &::placeholder {
    color: #b0bec5;
  }

  &:disabled {
    background: #f4f7fa;
    color: #8a97a5;
  }
`;

export const Button = styled.button`
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

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(59, 130, 246, 0.3);
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    background: #93c5fd;
  }
`;

export const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
`;

export const SuccessMessage = styled.div`
  background: #dcfce7;
  color: #15803d;
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  text-align: center;
  line-height: 1.6;
`;

export const InfoMessage = styled.div`
  background: #dbeafe;
  color: #1e40af;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
  line-height: 1.6;
`;

export const Hint = styled.p`
  font-size: 0.8125rem;
  color: #5c6b7a;
  margin: 0;
  line-height: 1.5;
`;

export default function AuthShell({
  title,
  subtitle,
  backLabel,
  children,
}: {
  title: string;
  subtitle?: string;
  backLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Container>
      <Box>
        <Brand>
          <Image
            src="/images/brand.png"
            alt="VEND88"
            width={538}
            height={218}
            priority
            style={{ width: "auto", height: "38px" }}
          />
          <BrandLabel>Agent Portal</BrandLabel>
        </Brand>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        {children}
        <BackLink href="/login">{backLabel}</BackLink>
      </Box>
    </Container>
  );
}

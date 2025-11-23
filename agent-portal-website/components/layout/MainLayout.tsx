"use client";

import { ReactNode, useState } from "react";
import styled from "styled-components";
import Header from "./Header";

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 65px;
`;

const Main = styled.main`
  flex: 1;
`;

interface MainLayoutProps {
  children: ReactNode;
  currentPage?: string;
  onMenuToggle?: () => void;
}

export default function MainLayout({ children, currentPage, onMenuToggle }: MainLayoutProps) {
  return (
    <LayoutWrapper>
      <Header currentPage={currentPage} onMenuToggle={onMenuToggle} />
      <Main>{children}</Main>
    </LayoutWrapper>
  );
}

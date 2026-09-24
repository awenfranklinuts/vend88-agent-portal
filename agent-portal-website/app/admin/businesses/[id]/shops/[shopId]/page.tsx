"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuth, isPortalUser } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import ShopDetailPanel from "@/components/shops/ShopDetailPanel";

// A business and its store are one entity, so the store is shown inline on the
// business page and this route is rarely reached. It stays for the older
// businesses that have more than one store, and for existing bookmarks.
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%);
  display: flex;
  padding-top: 65px;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0 2rem 2rem 2rem;
  margin-left: 320px;
  overflow-y: auto;

  @media (max-width: 968px) {
    padding: 0 1rem 1rem 1rem;
    margin-left: 0;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  color: #0a3655;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;

  &:hover {
    border-color: #1273eb;
    color: #1273eb;
  }
`;

const LoadingText = styled.div`
  padding: 2rem;
  color: #5c6b7a;
`;

export default function ShopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params?.id as string;
  const shopId = params?.shopId as string;
  const { token, role, isLoading: authLoading } = useAuth();
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (authLoading) {
    return (
      <Container>
        <LoadingText>{lang === "zh" ? "加载中..." : "Loading..."}</LoadingText>
      </Container>
    );
  }

  if (!token || !isPortalUser(role)) {
    return null;
  }

  return (
    <MainLayout
      currentPage={lang === "zh" ? "店铺详情" : "Shop Details"}
      onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <BackButton onClick={() => router.push(`/admin/businesses/${businessId}`)}>
            <span>←</span>
            {lang === "zh" ? "返回店铺详情" : "Back to Store"}
          </BackButton>

          <ShopDetailPanel businessId={businessId} shopId={shopId} />
        </MainContent>
      </Container>
    </MainLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuth, isAdminRole } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../../components/layout/AdminSidebar";

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

const ContentHeader = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: #5c6b7a;
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 1.25rem;
  color: #5c6b7a;
  padding: 4rem;
`;

export default function ReportsPage() {
  const router = useRouter();
  const { token, role, isLoading, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    } else if (!isLoading && token && !isAdminRole(role)) {
      router.push("/agent");
    }
  }, [token, role, isLoading, router]);

  if (isLoading) {
    return (
      <Container>
        <LoadingText>Loading...</LoadingText>
      </Container>
    );
  }

  if (!token || !isAdminRole(role)) {
    return null;
  }

  if (!adminProfile?.permissions?.includes('view_reports')) {
    router.push('/admin');
    return null;
  }

  return (
    <MainLayout currentPage={lang === "zh" ? "报告与分析" : "Reports & Analytics"} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <ContentHeader>
            <PageTitle>{lang === "zh" ? "报告与分析" : "Reports & Analytics"}</PageTitle>
            <PageDescription>
              {lang === "zh"
                ? "查看详细报告、分析和所有客户和业务的洞察。"
                : "View detailed reports, analytics, and insights across all customers and businesses."}
            </PageDescription>
          </ContentHeader>
          {/* Add your reports content here */}
        </MainContent>
      </Container>
    </MainLayout>
  );
}

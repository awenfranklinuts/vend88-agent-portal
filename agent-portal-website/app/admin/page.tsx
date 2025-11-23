"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../components/layout/AdminSidebar";

// Icon Components for Cards
const BusinessIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const CustomersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const AgentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const ReportsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v6m0 6v6"/>
    <path d="M17.7 6.3l-3 3m-5.4 0l-3-3"/>
    <path d="M23 12h-6m-6 0H1"/>
    <path d="M17.7 17.7l-3-3m-5.4 0l-3 3"/>
  </svg>
);

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%);
  display: flex;
  padding-top: 65px;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0 2rem 2rem 2rem;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(30, 64, 175, 0.15);
    border-color: rgba(0, 234, 255, 0.3);
  }
`;

const CardIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(26, 35, 126, 0.1) 0%, rgba(0, 234, 255, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  color: #1a237e;
  
  svg {
    width: 28px;
    height: 28px;
    stroke-width: 1.5;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0a3655;
  margin-bottom: 0.75rem;
`;

const CardDescription = styled.p`
  font-size: 0.875rem;
  color: #5c6b7a;
  line-height: 1.6;
`;

export default function AdminDashboard() {
  const router = useRouter();
  const { token, role, isLoading } = useAuth();
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = (key: keyof typeof dict) => dict[key][lang];

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    } else if (!isLoading && token && role !== "admin") {
      // If not admin, redirect to agent dashboard
      router.push("/agent");
    }
  }, [token, role, isLoading, router]);

  if (isLoading) {
    return (
      <Container>
        <LoadingText>{t("loading")}</LoadingText>
      </Container>
    );
  }

  if (!token || role !== "admin") {
    return null;
  }

  return (
    <MainLayout currentPage={lang === "zh" ? "首页" : "Home"} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <ContentHeader>
            <PageTitle>
              {lang === "zh" ? "管理员仪表板" : "Admin Dashboard"}
            </PageTitle>
            <PageDescription>
              {lang === "zh"
                ? "选择一个选项来管理您的业务、客户、代理等。"
                : "Select an option to manage your businesses, customers, agents, and more."}
            </PageDescription>
          </ContentHeader>

          <Grid>
            <Card onClick={() => router.push("/admin/businesses")}>
              <CardIcon><BusinessIcon /></CardIcon>
              <CardTitle>{t("businessManagement")}</CardTitle>
              <CardDescription>
                {lang === "zh" 
                  ? "管理所有业务和地点。查看、添加、编辑和监控业务信息。"
                  : "Manage all businesses and locations. View, add, edit, and monitor business information."}
              </CardDescription>
            </Card>

            <Card onClick={() => router.push("/admin/customers")}>
              <CardIcon><CustomersIcon /></CardIcon>
              <CardTitle>{t("customerManagement")}</CardTitle>
              <CardDescription>
                {lang === "zh"
                  ? "管理所有POS客户。查看、添加、编辑和监控客户信息。"
                  : "Manage all POS customers. View, add, edit, and monitor customer information."}
              </CardDescription>
            </Card>

            <Card onClick={() => router.push("/admin/agents")}>
              <CardIcon><AgentIcon /></CardIcon>
              <CardTitle>
                {lang === "zh" ? "代理管理" : "Agent Management"}
              </CardTitle>
              <CardDescription>
                {lang === "zh"
                  ? "管理代理账户和权限。分配业务访问权限。"
                  : "Manage agent accounts and permissions. Assign business access rights."}
              </CardDescription>
            </Card>

            <Card onClick={() => router.push("/admin/reports")}>
              <CardIcon><ReportsIcon /></CardIcon>
              <CardTitle>
                {lang === "zh" ? "报告与分析" : "Reports & Analytics"}
              </CardTitle>
              <CardDescription>
                {lang === "zh"
                  ? "查看详细报告、分析和所有客户和业务的洞察。"
                  : "View detailed reports, analytics, and insights across all customers and businesses."}
              </CardDescription>
            </Card>

            <Card onClick={() => router.push("/admin/settings")}>
              <CardIcon><SettingsIcon /></CardIcon>
              <CardTitle>
                {lang === "zh" ? "系统设置" : "System Settings"}
              </CardTitle>
              <CardDescription>
                {lang === "zh"
                  ? "配置系统设置、用户权限和应用程序偏好。"
                  : "Configure system settings, user permissions, and application preferences."}
              </CardDescription>
            </Card>
          </Grid>
        </MainContent>
      </Container>
    </MainLayout>
  );
}

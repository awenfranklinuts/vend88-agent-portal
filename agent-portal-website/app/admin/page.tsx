"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth, isAdminRole, hasPermission } from "@/context/AuthContext";
import { ADMIN_MODULES, canAccessModule } from "@/config/adminModules";
import RevenueSummaryCard from "@/components/ui/RevenueSummaryCard";
import TransactionsSummaryCard from "@/components/ui/TransactionsSummaryCard";
import GrowthSummaryRow from "@/components/ui/GrowthSummaryRow";
import SalesPipelineCard from "@/components/ui/SalesPipelineCard";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../components/layout/AdminSidebar";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%);
  display: flex;
  padding-top: 65px;
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0 2rem 2rem 2rem;
  margin-left: 320px;
  overflow-y: auto;
  animation: slideUp 0.6s ease;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
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

const SkeletonCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  animation: pulse 1.5s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
`;

const SkeletonIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(90deg, #e0e7ef 25%, #f0f4f8 50%, #e0e7ef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 1.25rem;
  
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonTitle = styled.div`
  height: 24px;
  width: 70%;
  background: linear-gradient(90deg, #e0e7ef 25%, #f0f4f8 50%, #e0e7ef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.75rem;
`;

const SkeletonDescription = styled.div`
  height: 14px;
  width: 100%;
  background: linear-gradient(90deg, #e0e7ef 25%, #f0f4f8 50%, #e0e7ef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  
  &:last-child {
    width: 80%;
  }
`;

const SkeletonHeader = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  margin-bottom: 2rem;
`;

const SkeletonHeaderTitle = styled.div`
  height: 32px;
  width: 250px;
  background: linear-gradient(90deg, #e0e7ef 25%, #f0f4f8 50%, #e0e7ef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.75rem;
`;

const SkeletonHeaderDesc = styled.div`
  height: 16px;
  width: 400px;
  background: linear-gradient(90deg, #e0e7ef 25%, #f0f4f8 50%, #e0e7ef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 1.5rem;
  align-items: start;

  @media (max-width: 1280px) {
    grid-template-columns: minmax(0, 1fr);
  }
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
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid transparent;
  animation: cardFadeIn 0.6s ease both;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 234, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  @keyframes cardFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
  &:nth-child(5) { animation-delay: 0.5s; }
  &:nth-child(6) { animation-delay: 0.6s; }
  &:nth-child(7) { animation-delay: 0.7s; }
  &:nth-child(n+8) { animation-delay: 0.8s; }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 16px 40px rgba(30, 64, 175, 0.2);
    border-color: rgba(0, 234, 255, 0.4);
  }
  
  &:active {
    transform: translateY(-4px) scale(1.01);
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
  transition: all 0.3s ease;
  
  ${Card}:hover & {
    transform: rotate(10deg) scale(1.1);
    background: linear-gradient(135deg, rgba(26, 35, 126, 0.15) 0%, rgba(0, 234, 255, 0.15) 100%);
  }
  
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
  const { token, role, isLoading, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    } else if (!isLoading && token && !isAdminRole(role)) {
      // If not admin, redirect to agent dashboard
      router.push("/agent");
    }
  }, [token, role, isLoading, router]);

  if (isLoading || (!adminProfile && token && isAdminRole(role))) {
    return (
      <MainLayout currentPage={lang === "zh" ? "首页" : "Home"} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <Container>
          <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          <MainContent>
            <SkeletonHeader>
              <SkeletonHeaderTitle />
              <SkeletonHeaderDesc />
            </SkeletonHeader>

            <Grid>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <SkeletonCard key={i}>
                  <SkeletonIcon />
                  <SkeletonTitle />
                  <SkeletonDescription />
                  <SkeletonDescription />
                </SkeletonCard>
              ))}
            </Grid>
          </MainContent>
        </Container>
      </MainLayout>
    );
  }

  if (!token || !isAdminRole(role)) {
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

          {hasPermission(adminProfile, "view_reports") && (
            <>
              <SummaryGrid>
                <RevenueSummaryCard fixedPeriod="30d" showBreakdown={false} />
                <TransactionsSummaryCard fixedPeriod="30d" />
              </SummaryGrid>
              <GrowthSummaryRow period="30d" activePeriod="7d" />
              <SalesPipelineCard period="30d" />
            </>
          )}

          <Grid>
            {ADMIN_MODULES.filter(module => canAccessModule(adminProfile, module)).map(module => {
              const Icon = module.icon;
              return (
                <Card key={module.id} onClick={() => router.push(module.href)}>
                  <CardIcon><Icon /></CardIcon>
                  <CardTitle>{module.label[lang]}</CardTitle>
                  <CardDescription>{module.description[lang]}</CardDescription>
                </Card>
              );
            })}
          </Grid>
        </MainContent>
      </Container>
    </MainLayout>
  );
}

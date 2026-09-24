"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuth, isPortalUser, hasPermission, canSeeAllTeams } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../../components/layout/AdminSidebar";
import RevenueSummaryCard, { type ReportFilter } from "@/components/ui/RevenueSummaryCard";
import TransactionsSummaryCard from "@/components/ui/TransactionsSummaryCard";
import DashboardStatsRow from "@/components/ui/DashboardStatsRow";
import ReportFilterBar from "@/components/ui/ReportFilterBar";

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

/* Revenue and transactions side by side; each card keeps its own period toggle */
const TwoUp = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  align-items: stretch;
  margin-bottom: 2rem;

  > * {
    margin-bottom: 0;
    min-width: 0;
  }

  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
  }
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
  // Administrators can narrow every card below to one team or person
  const [filter, setFilter] = useState<ReportFilter>({});

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    } else if (!isLoading && token && !isPortalUser(role)) {
      router.push("/login");
    }
  }, [token, role, isLoading, router]);

  if (isLoading) {
    return (
      <Container>
        <LoadingText>Loading...</LoadingText>
      </Container>
    );
  }

  if (!token || !isPortalUser(role)) {
    return null;
  }

  if (!hasPermission(adminProfile, 'view_reports')) {
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
              {canSeeAllTeams(adminProfile)
                ? (lang === "zh"
                    ? "查看所有客户和店铺的报告与分析，或按团队和成员筛选。"
                    : "Reports and insights across all customers and stores, or filtered to one team or person.")
                : (lang === "zh"
                    ? "归属于您的客户和店铺的报告与分析。"
                    : "Reports and insights for the customers and stores attributed to you.")}
            </PageDescription>
          </ContentHeader>

          <ReportFilterBar value={filter} onChange={setFilter} />
          <DashboardStatsRow
            filter={filter}
            showHeadline={false}
            title={lang === "zh" ? "销售管道" : "Sales pipeline"}
          />
          <TwoUp>
            <RevenueSummaryCard filter={filter} />
            <TransactionsSummaryCard filter={filter} />
          </TwoUp>
        </MainContent>
      </Container>
    </MainLayout>
  );
}

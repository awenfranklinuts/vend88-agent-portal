"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import MainLayout from "@/components/layout/MainLayout";

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  padding: 2rem 0;
  background: linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 1.5rem;
`;

const WelcomeSection = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(30, 64, 175, 0.12);
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #1a237e 0%, #00eaff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #5c6b7a;
  font-weight: 500;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
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
  font-size: 1.5rem;
`;

const CardTitle = styled.h2`
  font-size: 1.375rem;
  font-weight: 600;
  color: #222831;
  margin-bottom: 0.75rem;
`;

const CardDescription = styled.p`
  font-size: 0.9375rem;
  color: #5c6b7a;
  line-height: 1.6;
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 1.25rem;
  color: #5c6b7a;
  padding: 4rem;
`;

export default function AgentDashboard() {
  const router = useRouter();
  const { token, userEmail, role, isLoading } = useAuth();
  const { lang } = useLanguage();

  const t = (key: keyof typeof dict) => dict[key][lang];

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    } else if (!isLoading && token && role !== "agent") {
      // If not agent, redirect to admin dashboard
      router.push("/admin");
    }
  }, [token, role, isLoading, router]);

  if (isLoading) {
    return (
      <Container>
        <LoadingText>{t("loading")}</LoadingText>
      </Container>
    );
  }

  if (!token || role !== "agent") {
    return null;
  }

  return (
    <MainLayout>
      <Container>
        <ContentWrapper>
          <WelcomeSection>
            <Title>
              {t("welcome")}, {userEmail?.split("@")[0]}
            </Title>
            <Subtitle>
              {t("loggingInAs")} {t("agent")}
            </Subtitle>
          </WelcomeSection>

          <Grid>
            <Card onClick={() => router.push("/agent/businesses")}>
              <CardIcon>🏢</CardIcon>
              <CardTitle>
                {lang === "zh" ? "我的业务" : "My Businesses"}
              </CardTitle>
              <CardDescription>
                {lang === "zh" 
                  ? "查看和管理您被分配的业务。访问您有权限的业务信息。"
                  : "View and manage your assigned businesses. Access business information you have permissions for."}
              </CardDescription>
            </Card>

            <Card onClick={() => router.push("/agent/customers")}>
              <CardIcon>👥</CardIcon>
              <CardTitle>{t("customerManagement")}</CardTitle>
              <CardDescription>
                {lang === "zh"
                  ? "管理您业务范围内的客户。查看和更新客户信息。"
                  : "Manage customers within your business scope. View and update customer information."}
              </CardDescription>
            </Card>

            <Card onClick={() => router.push("/agent/reports")}>
              <CardIcon>📊</CardIcon>
              <CardTitle>
                {lang === "zh" ? "业务报告" : "Business Reports"}
              </CardTitle>
              <CardDescription>
                {lang === "zh"
                  ? "查看您管理的业务的报告和分析。"
                  : "View reports and analytics for businesses you manage."}
              </CardDescription>
            </Card>
          </Grid>
        </ContentWrapper>
      </Container>
    </MainLayout>
  );
}

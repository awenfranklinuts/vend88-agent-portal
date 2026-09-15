"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, isAdminRole, hasPermission } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Container, MainContent, LoadingText } from "@/components/ui/AdminPageLayout";

export const QUOTATION_PERMISSION = "manage_quotations";

/** Auth, permission check and page chrome shared by every quotation page */
export default function QuotationShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { token, role, isLoading, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const allowed = hasPermission(adminProfile, QUOTATION_PERMISSION);

  useEffect(() => {
    if (isLoading) return;
    if (!token) router.push("/login");
    else if (!isAdminRole(role)) router.push("/agent");
    else if (adminProfile && !allowed) router.push("/admin");
  }, [token, role, isLoading, adminProfile, allowed, router]);

  if (isLoading || (token && isAdminRole(role) && !adminProfile)) {
    return (
      <Container>
        <LoadingText>Loading...</LoadingText>
      </Container>
    );
  }

  if (!token || !isAdminRole(role) || !allowed) return null;

  return (
    <MainLayout currentPage={lang === "zh" ? "报价管理" : "Quotation Management"} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          {children}
        </MainContent>
      </Container>
    </MainLayout>
  );
}

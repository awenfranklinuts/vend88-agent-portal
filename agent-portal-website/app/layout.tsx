import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/registry";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ToastProvider } from "@/context/ToastContext";
import NavigationProgress from "@/components/layout/NavigationProgress";
import SWRProvider from "@/components/layout/SWRProvider";
import PrefetchLinks from "@/components/layout/PrefetchLinks";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agent Portal - POS Customer Management",
  description: "Comprehensive POS customer management portal for agents and administrators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <StyledComponentsRegistry>
          <SWRProvider>
            <ErrorBoundary>
              <NavigationProgress />
              <PrefetchLinks />
              <LanguageProvider>
                <AuthProvider>
                  <ToastProvider>
                    {children}
                  </ToastProvider>
                </AuthProvider>
              </LanguageProvider>
            </ErrorBoundary>
          </SWRProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

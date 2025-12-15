import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/registry";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ToastProvider } from "@/context/ToastContext";
import NavigationProgress from "@/components/layout/NavigationProgress";

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
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent FOUC (Flash of Unstyled Content) */
            body {
              visibility: hidden;
              opacity: 0;
            }
            body.loaded {
              visibility: visible;
              opacity: 1;
              transition: opacity 0.2s ease;
            }
          `
        }} />
        <script dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('DOMContentLoaded', function() {
              document.body.classList.add('loaded');
            });
          `
        }} />
      </head>
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <NavigationProgress />
          <LanguageProvider>
            <AuthProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </AuthProvider>
          </LanguageProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

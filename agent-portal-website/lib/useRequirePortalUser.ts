"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, isPortalUser } from "@/context/AuthContext";

/**
 * Sends anyone who isn't a signed-in portal user to /login.
 *
 * Every /admin page needs this - the backend refuses the data either way, but
 * without it a logged-out visitor sits on a broken shell of a page instead of
 * the login screen. Written once here because it was copied into sixteen pages
 * and missed in five.
 */
export function useRequirePortalUser() {
  const router = useRouter();
  const { token, role, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!token || !isPortalUser(role)) router.push("/login");
  }, [token, role, isLoading, router]);
}

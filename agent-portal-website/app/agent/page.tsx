"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// There is one portal for everyone. Team users used to be pointed here; they
// now use the same /admin screens with their own permissions and scope, so
// this route only forwards anyone who still has it bookmarked.
export default function AgentRedirect() {
  const router = useRouter();
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    router.replace(token ? "/admin" : "/login");
  }, [token, isLoading, router]);

  return null;
}

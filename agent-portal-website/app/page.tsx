"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { token, role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (token && role) {
        // Redirect to appropriate dashboard based on role
        router.push(role === "admin" ? "/admin" : "/agent");
      } else {
        router.push("/login");
      }
    }
  }, [token, role, isLoading, router]);

  return null;
}

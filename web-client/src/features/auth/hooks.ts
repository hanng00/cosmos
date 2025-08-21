"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/features/auth/useMe";

type UseAuthGuardResult = {
  isChecking: boolean;
  isAuthenticated: boolean;
};

export function useAuthGuard(redirectTo: string = "/"): UseAuthGuardResult {
  const router = useRouter();
  const { data, isLoading } = useMe();

  const isAuthenticated = useMemo(() => Boolean(data), [data]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  return { isChecking: isLoading, isAuthenticated };
}

type ProtectedRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
};

export function ProtectedRoute({
  children,
  redirectTo = "/",
  fallback = null,
}: ProtectedRouteProps) {
  const { isChecking, isAuthenticated } = useAuthGuard(redirectTo);

  if (isChecking) return fallback ?? null;
  if (!isAuthenticated) return null;
  return children;
}



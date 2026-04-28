"use client";

import { ReactNode } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { profile, loading } = useAuth();

  if (loading) return null;

  const userRole = profile?.role;

  // On compare en minuscules des deux côtés pour être 100% sûr
  const isAuthorized = userRole && allowedRoles.some(
    role => role.toLowerCase() === userRole.toLowerCase()
  );

  if (!isAuthorized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
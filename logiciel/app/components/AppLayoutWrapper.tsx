"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { useAuth } from "../contexts/AuthContext";

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // On cache la sidebar sur la page de login ou si l'utilisateur n'est pas connecté
  const isLoginPage = pathname === "/";
  const shouldShowSidebar = !isLoginPage && user && !loading;

  if (!shouldShowSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-[280px] p-8 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

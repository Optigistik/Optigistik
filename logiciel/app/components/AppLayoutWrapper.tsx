"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../contexts/AuthContext";

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // On cache la sidebar sur la page de login ou si l'utilisateur n'est pas connecté
  const isLoginPage = pathname === "/";
  const shouldShowSidebar = !isLoginPage && user && !loading;

  if (!shouldShowSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-100 overflow-hidden">
      <Sidebar 
        user={user} 
        onLogout={logout} 
        isCollapsed={isCollapsed} 
        toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
      />
      <main className="flex-1 p-8 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const { user, profile, loading, logout } = useAuth(); 
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isLoginPage = pathname === "/";
  const shouldShowSidebar = !isLoginPage && user && !loading;

  if (!shouldShowSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-100 overflow-hidden">
      <Sidebar 
        user={user} 
        profile={profile}
        onLogout={logout} 
        isCollapsed={isCollapsed} 
        toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
      />
      <main className="flex-1 p-8 h-screen overflow-y-auto">
        <div className="max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
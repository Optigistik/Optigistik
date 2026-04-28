"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, profile, logout } = useAuth(); // Ajout du profile
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // On n'affiche rien tant que Firebase n'a pas répondu (pour éviter le flash du login)
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-opti-blue"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        user={user} 
        profile={profile} // On passe le profile pour gérer les rôles dans la sidebar
        onLogout={logout} 
        /* ... reste des props */
      />
      <main className="flex-1 p-8 h-screen overflow-y-auto">
        <div className="max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

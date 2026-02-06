"use client";

import { useState } from "react";
import { User } from "firebase/auth";
import Sidebar from "./Sidebar";
import StatsGrid from "./StatsGrid";
import MapSection from "./MapSection";

interface DashboardProps {
  user: User | null;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar
        user={user}
        onLogout={onLogout}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="flex-1 p-8 bg-white">
        <StatsGrid />
        <MapSection />
      </main>
    </div>
  );
}

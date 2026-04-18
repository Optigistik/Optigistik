"use client";

import { useState } from "react";
import { User } from "firebase/auth";
import Sidebar from "./Sidebar";
import MessagesList from "./MessagesList";
import AlertsList from "./AlertsList";
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <MessagesList messages={[]} unreadCount={0} />
          <AlertsList alerts={[]} />
        </div>
        
        <MapSection />
      </main>
    </div>
  );
}

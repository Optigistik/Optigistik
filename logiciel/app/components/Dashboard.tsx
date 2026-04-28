"use client";

import { useState } from "react";
import { User } from "firebase/auth";
import Sidebar from "./Sidebar";
import MessagesList from "./MessagesList";
import AlertsList from "./AlertsList";
import MapSection from "./MapSection";
import FleetSection from "../fleet/page";

interface DashboardProps {
  user: User | null;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar
        user={user}
        onLogout={onLogout}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="flex-1 p-8 bg-white h-screen overflow-y-auto">
        {activeTab === "home" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <MessagesList messages={[]} unreadCount={0} />
              <AlertsList alerts={[]} />
            </div>
            <MapSection />
          </>
        )}

        {activeTab === "fleet" && (
          <FleetSection />
        )}
        
        {/* Placeholder pour les autres onglets */}
        {activeTab !== "home" && activeTab !== "fleet" && (
          <div className="flex items-center justify-center h-full text-gray-400">
            En cours de développement...
          </div>
        )}
      </main>
    </div>
  );
}

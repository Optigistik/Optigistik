"use client";

import MessagesList from "../components/MessagesList";
import AlertsList from "../components/AlertsList";
import MapSection from "../components/MapSection";
import DashboardLayout from "../components/DashboardLayout";

export default function AccueilPage() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <MessagesList messages={[]} unreadCount={0} />
        <AlertsList alerts={[]} />
      </div>
      <MapSection />
    </DashboardLayout>
  );
}

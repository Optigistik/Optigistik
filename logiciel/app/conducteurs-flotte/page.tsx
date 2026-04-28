"use client";

import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import DriversList from "../components/DriversList";
import DriverDetail from "../components/DriverDetail";
import { Driver } from "@/types";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert } from "lucide-react";

type ViewState = "list" | "detail";

export default function ConducteursFlottePage() {
  const { profile, loading: authLoading } = useAuth();
  const [view, setView] = useState<ViewState>("list");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const userRole = profile?.role || 'membre';

  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setView("detail");
  };

  const handleBackToList = () => {
    setSelectedDriver(null);
    setView("list");
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        {/* Navigation Tabs Locale */}
        {view === "list" && (
          <div className="mb-6 flex gap-4 border-b border-gray-200">
            <button className="py-2 px-4 text-opti-blue border-b-2 border-opti-blue font-bold">
              Conducteurs
            </button>
            <button className="py-2 px-4 text-gray-500 font-medium">
              Flotte de véhicules
            </button>
          </div>
        )}

        {/* Gestion des accès par rôle */}
        {authLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-opti-blue"></div>
          </div>
        ) : userRole === 'membre' ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <ShieldAlert className="w-10 h-10 text-opti-red" />
            </div>
            <h2 className="text-xl font-bold text-opti-blue mb-2">Accès restreint</h2>
            <p className="text-gray-500 max-w-md text-center leading-relaxed">
              Vous devez demander à un supérieur pour avoir accès à ces informations.
            </p>
          </div>
        ) : (
          <>
            {view === "list" && (
              <DriversList onSelectDriver={handleSelectDriver} />
            )}

            {view === "detail" && selectedDriver && (
              <DriverDetail 
                driver={selectedDriver} 
                onUpdate={(updated) => setSelectedDriver(updated)}
                onBack={handleBackToList}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
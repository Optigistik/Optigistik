"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, UserPlus, Pencil, AlertCircle } from "lucide-react";
import { Driver } from "@/types";
import { getDrivers } from "@/services/drivers";
import DriverEditModal from "./DriverEditModal";

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  EN_MISSION: { label: "EN MISSION", bg: "bg-emerald-800", text: "text-white" },
  DISPONIBLE: { label: "DISPONIBLE", bg: "bg-blue-100", text: "text-blue-800" },
  INDISPONIBLE: { label: "INDISPONIBLE", bg: "bg-amber-500", text: "text-white" },
};

export default function DriversList() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      const data = await getDrivers();
      setDrivers(data);
      setLoading(false);
    };
    fetchDrivers();
  }, []);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getInitialsColor = (firstName: string) => {
    const colors = [
      "bg-rose-500", "bg-blue-600", "bg-emerald-600",
      "bg-violet-600", "bg-amber-600", "bg-cyan-600",
    ];
    const index = firstName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatUnavailabilities = (driver: Driver) => {
    if (!driver.unavailabilities || driver.unavailabilities.length === 0) {
      return <span className="text-gray-400 text-sm">Aucune période prévue</span>;
    }

    return driver.unavailabilities.map((u) => {
      const start = new Date(u.startDate).toLocaleDateString("fr-FR", {
        day: "2-digit", month: "2-digit", year: "numeric",
      });
      const end = new Date(u.endDate).toLocaleDateString("fr-FR", {
        day: "2-digit", month: "2-digit", year: "numeric",
      });
      return (
        <div key={u.id} className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-opti-red shrink-0" />
          <span className="text-sm text-opti-red font-medium">
            {start} - {end}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-opti-blue" />
          </div>
          <h2 className="text-xl font-bold text-opti-blue font-display">
            Liste des Conducteurs
          </h2>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-opti-blue text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-opti-blue/90 transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Ajouter un conducteur
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-opti-blue"></div>
        </div>
      ) : drivers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Users className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm">Aucun conducteur trouvé</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Nom / Prénom
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Périodes d&apos;indisponibilité
                </th>
                <th className="text-right py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => {
                const status = statusConfig[driver.status] || statusConfig.DISPONIBLE;
                return (
                  <tr
                    key={driver.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${getInitialsColor(driver.firstName)}`}
                        >
                          {getInitials(driver.firstName, driver.lastName)}
                        </div>
                        <span className="text-sm font-bold text-opti-blue">
                          {driver.lastName.toUpperCase()} {driver.firstName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${status.bg} ${status.text}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 px-4">{formatUnavailabilities(driver)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/conducteurs-flotte/${driver.id}`}
                          className="p-2 text-gray-400 hover:text-opti-blue hover:bg-gray-100 rounded-lg transition-colors"
                          title="Voir / Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal de création */}
      <DriverEditModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(newDriver) => {
          setDrivers((prev) => [...prev, newDriver]);
        }}
      />
    </div>
  );
}

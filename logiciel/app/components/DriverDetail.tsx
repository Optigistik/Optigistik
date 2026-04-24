"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Mail, Phone, Pencil, MoreVertical, Truck,
  CalendarPlus, Save, Trash2, ChevronRight, Shield, Clock,
} from "lucide-react";
import { Driver } from "@/types";
import DriverEditModal from "./DriverEditModal";

interface DriverDetailProps {
  driver: Driver;
  onUpdate: (updated: Driver) => void;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  EN_MISSION: { label: "EN MISSION", bg: "bg-emerald-800", text: "text-white" },
  DISPONIBLE: { label: "ACTIF", bg: "bg-emerald-100", text: "text-emerald-800" },
  INDISPONIBLE: { label: "INDISPONIBLE", bg: "bg-amber-500", text: "text-white" },
};

const unavailabilityTypeConfig: Record<string, { label: string; color: string; bg: string }> = {
  CONGES_ANNUELS: { label: "CONGÉS ANNUELS", color: "text-opti-red", bg: "bg-red-50" },
  FORMATION: { label: "FORMATION TECHNIQUE", color: "text-blue-700", bg: "bg-blue-50" },
  MALADIE: { label: "ARRÊT MALADIE", color: "text-amber-700", bg: "bg-amber-50" },
  AUTRE: { label: "AUTRE", color: "text-gray-700", bg: "bg-gray-50" },
};

export default function DriverDetail({ driver, onUpdate }: DriverDetailProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const status = statusConfig[driver.status] || statusConfig.DISPONIBLE;

  const getInitials = () => {
    return `${(driver.firstName || "").charAt(0)}${(driver.lastName || "").charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <div className="space-y-6">
        {/* Back link */}
        <Link
          href="/conducteurs-flotte"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-opti-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-opti-blue text-2xl font-bold font-display">
                  {getInitials()}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-opti-red rounded-full flex items-center justify-center text-white shadow-md hover:bg-opti-red-dark transition-colors cursor-pointer">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Name & Info */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-opti-blue font-display">
                    {driver.firstName} {driver.lastName}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  🚛 {driver.role || "Conducteur"}{driver.fleet ? ` · ${driver.fleet}` : ""}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    {driver.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    {driver.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 bg-opti-red text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-opti-red-dark transition-colors cursor-pointer"
              >
                Modifier le profil
              </button>
              <button className="p-2 text-gray-400 hover:text-opti-blue hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations Techniques */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-5">
                <Shield className="w-5 h-5 text-opti-blue" />
                <h2 className="text-lg font-bold text-opti-blue font-display">
                  Informations Techniques
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Type de permis
                  </p>
                  <p className="text-sm font-semibold text-opti-blue">
                    {(driver.licenseTypes || []).join(", ") || "Non renseigné"}
                    {driver.licenseExpiry && (
                      <span className="text-gray-400 font-normal">
                        {" "}(Valide jusqu&apos;en {new Date(driver.licenseExpiry).getFullYear()})
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    ID Employé
                  </p>
                  <p className="text-sm font-semibold text-opti-blue">{driver.employeeId}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Ancienneté
                  </p>
                  <p className="text-sm font-semibold text-opti-blue">{driver.seniority}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Langues
                  </p>
                  <p className="text-sm font-semibold text-opti-blue">
                    {(driver.languages || []).join(", ") || "Non renseigné"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Régime contractuel
                  </p>
                  <p className="text-sm font-semibold text-opti-blue">
                    {driver.regime === "GRAND_ROUTIER" ? "Grand Routier" : "Autre personnel"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Travail de nuit
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-sm font-semibold text-opti-blue">
                      {driver.nightWorkAuthorized ? "Autorisé" : "Non autorisé"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Véhicules Assignés */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-5">
                <Truck className="w-5 h-5 text-opti-blue" />
                <h2 className="text-lg font-bold text-opti-blue font-display">
                  Véhicules Assignés
                </h2>
              </div>

              {(driver.assignedVehicles || []).length > 0 ? (
                <div className="space-y-3">
                  {(driver.assignedVehicles || []).map((vehicle) => (
                    <div
                      key={vehicle.vehicleId}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-200">
                          <Truck className="w-5 h-5 text-opti-blue" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-opti-blue">{vehicle.label}</p>
                          <p className="text-xs text-gray-500">
                            {vehicle.role === "PRINCIPAL" ? "Véhicule principal" : "Remplacement temporaire"}
                            {vehicle.isActive ? " · Actif" : ""}
                            {vehicle.lastMaintenance ? ` · Dernier entretien : ${vehicle.lastMaintenance}` : ""}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">
                  Aucun véhicule assigné
                </p>
              )}
            </div>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Indisponibilités */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-opti-blue font-display">
                  Indisponibilité
                </h2>
                <button className="flex items-center gap-1.5 text-sm text-opti-blue hover:text-opti-red font-semibold transition-colors cursor-pointer">
                  <CalendarPlus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>

              {(driver.unavailabilities || []).length > 0 ? (
                <div className="space-y-3">
                  {(driver.unavailabilities || []).map((u) => {
                    const config = unavailabilityTypeConfig[u.type] || unavailabilityTypeConfig.AUTRE;
                    const start = new Date(u.startDate).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "short",
                    });
                    const end = new Date(u.endDate).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "short", year: "numeric",
                    });
                    return (
                      <div key={u.id} className={`p-4 rounded-2xl border border-gray-100 ${config.bg}`}>
                        <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${config.color}`}>
                          {config.label}
                        </p>
                        <p className="text-sm font-bold text-opti-blue">
                          {start} – {end}
                        </p>
                        {(u.approvedBy || u.note) && (
                          <p className="text-xs text-gray-500 mt-1">
                            {u.approvedBy ? `Approuvé par ${u.approvedBy}` : u.note}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">
                  Aucune indisponibilité
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <button className="w-full flex items-center justify-center gap-2 bg-opti-red text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-opti-red-dark transition-colors cursor-pointer">
              <Save className="w-4 h-4" />
              Enregistrer les modifications
            </button>
            <button className="w-full flex items-center justify-center gap-2 text-opti-red hover:text-opti-red-dark text-sm font-semibold transition-colors cursor-pointer">
              <Trash2 className="w-4 h-4" />
              Supprimer le compte
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <DriverEditModal
        driver={driver}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={onUpdate}
      />
    </>
  );
}

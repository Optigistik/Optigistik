"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Driver, DriverRegime } from "@/types";
import { updateDriver, addDriver } from "@/services/drivers";

interface DriverEditModalProps {
  driver?: Driver | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (saved: Driver) => void;
}

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  regime: "AUTRE_PERSONNEL" as DriverRegime,
  nightWorkAuthorized: false,
  licenseTypes: "",
  languages: "",
  employeeId: "",
  seniority: "",
  status: "DISPONIBLE" as const,
};

export default function DriverEditModal({ driver, isOpen, onClose, onSave }: DriverEditModalProps) {
  const isCreateMode = !driver;

  const [form, setForm] = useState(() =>
    driver
      ? {
          firstName: driver.firstName,
          lastName: driver.lastName,
          email: driver.email,
          phone: driver.phone,
          role: driver.role,
          regime: driver.regime as DriverRegime,
          nightWorkAuthorized: driver.nightWorkAuthorized,
          licenseTypes: (driver.licenseTypes || []).join(", "),
          languages: (driver.languages || []).join(", "),
          employeeId: driver.employeeId,
          seniority: driver.seniority,
          status: driver.status,
        }
      : { ...emptyForm },
  );
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const driverData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      role: form.role,
      regime: form.regime,
      nightWorkAuthorized: form.nightWorkAuthorized,
      licenseTypes: form.licenseTypes.split(",").map((s) => s.trim()).filter(Boolean),
      languages: form.languages.split(",").map((s) => s.trim()).filter(Boolean),
      employeeId: form.employeeId,
      seniority: form.seniority,
    };

    if (isCreateMode) {
      // Mode création
      const newDriver = await addDriver({
        ...driverData,
        status: form.status,
        unavailabilities: [],
        assignedVehicles: [],
      });
      setSaving(false);
      if (newDriver) {
        onSave(newDriver);
        onClose();
      }
    } else {
      // Mode édition
      const success = await updateDriver(driver.id, driverData);
      setSaving(false);
      if (success) {
        onSave({ ...driver, ...driverData });
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 animate-in">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 px-8 py-5 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-opti-blue font-display">
            {isCreateMode ? "Ajouter un conducteur" : "Modifier le profil"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-opti-blue hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Identité */}
          <fieldset>
            <legend className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Identité
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-opti-blue mb-1">Prénom</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-opti-blue focus:outline-none focus:ring-2 focus:ring-opti-red/20 focus:border-opti-red transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-opti-blue mb-1">Nom</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-opti-blue focus:outline-none focus:ring-2 focus:ring-opti-red/20 focus:border-opti-red transition-colors"
                />
              </div>
            </div>
          </fieldset>

          {/* Contact */}
          <fieldset>
            <legend className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Contact
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-opti-blue mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-opti-blue focus:outline-none focus:ring-2 focus:ring-opti-red/20 focus:border-opti-red transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-opti-blue mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-opti-blue focus:outline-none focus:ring-2 focus:ring-opti-red/20 focus:border-opti-red transition-colors"
                />
              </div>
            </div>
          </fieldset>

          {/* Poste + Profil Contractuel */}
          <fieldset>
            <legend className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Poste & Profil Contractuel
            </legend>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-semibold text-opti-blue mb-1">Rôle</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-opti-blue focus:outline-none focus:ring-2 focus:ring-opti-red/20 focus:border-opti-red transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-opti-blue mb-1">
                  Régime
                </label>
                <select
                  value={form.regime}
                  onChange={(e) => handleChange("regime", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-opti-blue focus:outline-none focus:ring-2 focus:ring-opti-red/20 focus:border-opti-red transition-colors bg-white"
                >
                  <option value="GRAND_ROUTIER">Grand Routier</option>
                  <option value="AUTRE_PERSONNEL">Autre personnel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-opti-blue mb-1">
                  Travail de nuit
                </label>
                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={form.nightWorkAuthorized}
                    onChange={(e) => handleChange("nightWorkAuthorized", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-opti-red peer-focus:ring-2 peer-focus:ring-opti-red/20 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  <span className="ml-3 text-sm text-gray-600">
                    {form.nightWorkAuthorized ? "Autorisé" : "Non autorisé"}
                  </span>
                </label>
              </div>
            </div>
          </fieldset>

          {/* Infos Techniques */}
          <fieldset>
            <legend className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Informations Techniques
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-opti-blue mb-1">
                  Types de permis
                </label>
                <input
                  type="text"
                  value={form.licenseTypes}
                  onChange={(e) => handleChange("licenseTypes", e.target.value)}
                  placeholder="Permis C, CE, FIMO"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-opti-blue focus:outline-none focus:ring-2 focus:ring-opti-red/20 focus:border-opti-red transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-opti-blue mb-1">
                  Langues
                </label>
                <input
                  type="text"
                  value={form.languages}
                  onChange={(e) => handleChange("languages", e.target.value)}
                  placeholder="Français, Anglais"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-opti-blue focus:outline-none focus:ring-2 focus:ring-opti-red/20 focus:border-opti-red transition-colors"
                />
              </div>
            </div>
          </fieldset>

          {/* ID Employé (création uniquement) */}
          {isCreateMode && (
            <fieldset>
              <legend className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Référence
              </legend>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-opti-blue mb-1.5">
                    ID Employé
                  </label>
                  <input
                    type="text"
                    value={form.employeeId}
                    onChange={(e) => handleChange("employeeId", e.target.value)}
                    placeholder="EMP-FR-XXXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-opti-blue focus:outline-none focus:ring-2 focus:ring-opti-red/20 focus:border-opti-red transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-opti-blue mb-1.5">
                    Statut initial
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-opti-blue focus:outline-none focus:ring-2 focus:ring-opti-red/20 focus:border-opti-red transition-colors bg-white"
                  >
                    <option value="DISPONIBLE">Disponible</option>
                    <option value="EN_MISSION">En mission</option>
                    <option value="INDISPONIBLE">Indisponible</option>
                  </select>
                </div>
              </div>
            </fieldset>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-opti-blue hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-opti-red hover:bg-opti-red-dark transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving
                ? "Enregistrement..."
                : isCreateMode
                  ? "Ajouter le conducteur"
                  : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

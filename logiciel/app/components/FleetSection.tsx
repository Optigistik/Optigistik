"use client";

import { useState, useEffect } from "react";
import FleetList from "./FleetList";
import FleetDetail from "./FleetDetail";
import VehicleForm from "./VehicleForm";
import FleetAdmin from "./FleetAdmin";
import { getVehicleTypes, Vehicle, VehicleType, Specialty, getSpecialties, subscribeToVehicles, Motorization, getMotorizations } from "@/services/fleet";
import { useAuth } from "@/app/context/AuthContext";
import { ShieldAlert, Clock, Settings } from "lucide-react";

type ViewState = "list" | "detail" | "form" | "admin";

export default function FleetSection() {
  const [view, setView] = useState<ViewState>("list");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const { profile, loading: authLoading } = useAuth();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [motorizations, setMotorizations] = useState<Motorization[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  const fetchData = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setDbError(null);
    try {
      const [fetchedTypes, fetchedSpecialties, fetchedMotors] = await Promise.all([
        getVehicleTypes(),
        getSpecialties(),
        getMotorizations()
      ]);
      setVehicleTypes(fetchedTypes);
      setSpecialties(fetchedSpecialties);
      setMotorizations(fetchedMotors);
    } catch (err: any) {
      setDbError("Erreur chargement config: " + err.message);
    }
    if (showLoader) setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Abonnement temps réel aux camions
    const unsubscribe = subscribeToVehicles(
      (data) => {
        setVehicles(data);
        setLoading(false);
        setDbError(null);
      },
      (err) => {
        setDbError("Erreur Firestore: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Re-fetch quand le profil est chargé pour s'assurer d'avoir les droits de lecture
  useEffect(() => {
    if (profile) {
      fetchData(false);
    }
  }, [profile]);

  // Synchronisation du véhicule sélectionné quand la liste se met à jour
  useEffect(() => {
    if (selectedVehicle) {
      const updated = vehicles.find(v => v.id === selectedVehicle.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedVehicle)) {
        setSelectedVehicle(updated);
      }
    }
  }, [vehicles]);

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setView("detail");
  };

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setView("form");
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setView("form");
  };

  const handleBackToList = () => {
    setSelectedVehicle(null);
    setView("list");
    fetchData(false); // Refresh data silently on back
  };

  const handleFormSuccess = () => {
    setView("list");
    fetchData(true);
  };

  if (loading || authLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-opti-red"></div>
      </div>
    );
  }

  const userRole = profile?.role || 'membre'; // Par défaut 'membre' si pas de profil trouvé

  return (
    <div className="w-full space-y-6">
      {/* Tab Navigation Local (Conducteurs / Flotte) - Pour l'instant on se concentre sur la flotte */}
      {view === "list" && (
        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <button className="py-2 px-4 text-gray-500 font-medium">Conducteurs</button>
          <button className="py-2 px-4 text-opti-red border-b-2 border-opti-red font-bold">Flotte de véhicules</button>
          {userRole.toLowerCase() === 'admin' && (
            <button 
              onClick={() => setView("admin")}
              className="py-1.5 px-3 bg-gray-100 text-gray-600 hover:bg-opti-blue hover:text-white rounded-lg transition-all ml-auto flex items-center gap-2 text-xs font-bold shadow-sm"
            >
              <Settings className="w-3.5 h-3.5" />
              CONFIGURATION
            </button>
          )}
        </div>
      )}

      {/* Rendu conditionnel selon le rôle 'membre' */}
      {userRole === 'membre' ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
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
            <FleetList 
              vehicles={vehicles} 
              vehicleTypes={vehicleTypes}
              onSelectVehicle={handleSelectVehicle}
              onAddVehicle={handleAddVehicle}
              onEditVehicle={handleEditVehicle}
              onDeleteSuccess={() => fetchData(false)}
              userRole={userRole}
            />
          )}

          {view === "detail" && selectedVehicle && (
            <FleetDetail 
              vehicle={selectedVehicle}
              vehicleTypes={vehicleTypes}
              onBack={handleBackToList}
              onEdit={() => handleEditVehicle(selectedVehicle)}
              onRefresh={() => fetchData(false)}
              userRole={userRole}
            />
          )}

          {view === "form" && (
            <VehicleForm
              initialData={selectedVehicle}
              vehicleTypes={vehicleTypes}
              specialties={specialties}
              motorizations={motorizations}
              onCancel={handleBackToList}
              onSuccess={handleFormSuccess}
            />
          )}

          {view === "admin" && (
            <div className="space-y-4">
              <button 
                onClick={handleBackToList}
                className="flex items-center gap-2 text-gray-500 hover:text-opti-blue transition-colors font-bold text-sm"
              >
                ← Retour à la liste
              </button>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-opti-blue mb-4">Configuration de la Flotte</h3>
                <p className="text-gray-500 mb-6">Gérez ici les types de véhicules et les spécialités disponibles.</p>
                {/* Je vais créer le composant FleetAdmin juste après */}
                <FleetAdmin 
                  types={vehicleTypes} 
                  specialties={specialties} 
                  motorizations={motorizations}
                  onRefresh={fetchData} 
                />
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}

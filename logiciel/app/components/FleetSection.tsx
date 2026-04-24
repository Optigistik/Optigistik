"use client";

import { useState, useEffect } from "react";
import FleetList from "./FleetList";
import FleetDetail from "./FleetDetail";
import VehicleForm from "./VehicleForm";
import { getVehicleTypes, Vehicle, VehicleType, subscribeToVehicles } from "@/services/fleet";
import { useAuth } from "@/app/context/AuthContext";
import { ShieldAlert, Clock } from "lucide-react";

type ViewState = "list" | "detail" | "form";

export default function FleetSection() {
  const [view, setView] = useState<ViewState>("list");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const { profile, loading: authLoading } = useAuth();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  const fetchData = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setDbError(null);
    try {
      const fetchedTypes = await getVehicleTypes();
      setVehicleTypes(fetchedTypes);
    } catch (err: any) {
      setDbError("Erreur types: " + err.message);
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
              onCancel={handleBackToList}
              onSuccess={handleFormSuccess}
            />
          )}
        </>
      )}

    </div>
  );
}

"use client";

import { useState } from "react";
import { VehicleType, Specialty, saveVehicleType, deleteVehicleType, saveSpecialty, deleteSpecialty, seedSpecialties } from "@/services/fleet";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";

interface FleetAdminProps {
  types: VehicleType[];
  specialties: Specialty[];
  onRefresh: () => void;
}

export default function FleetAdmin({ types, specialties, onRefresh }: FleetAdminProps) {
  const [editingType, setEditingType] = useState<Partial<VehicleType> | null>(null);
  const [editingSpecialty, setEditingSpecialty] = useState<Partial<Specialty> | null>(null);
  
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeDesc, setNewTypeDesc] = useState("");
  const [newSpecName, setNewSpecName] = useState("");

  const handleSaveType = async () => {
    if (!newTypeName.trim()) return;
    const success = await saveVehicleType({
      id: editingType?.id,
      name: newTypeName,
      description: newTypeDesc
    });
    if (success) {
      setEditingType(null);
      setNewTypeName("");
      setNewTypeDesc("");
      onRefresh();
    }
  };

  const handleSaveSpecialty = async () => {
    if (!newSpecName.trim()) return;
    const success = await saveSpecialty({
      id: editingSpecialty?.id,
      name: newSpecName
    });
    if (success) {
      setEditingSpecialty(null);
      setNewSpecName("");
      onRefresh();
    }
  };

  const handleDeleteType = async (id: string) => {
    if (confirm("Supprimer ce type de véhicule ? Cela pourrait impacter les camions existants.")) {
      await deleteVehicleType(id);
      onRefresh();
    }
  };

  const handleDeleteSpec = async (id: string) => {
    if (confirm("Supprimer cette spécialité ?")) {
      await deleteSpecialty(id);
      onRefresh();
    }
  };

  const handleSeed = async () => {
    if (confirm("Voulez-vous importer les 8 spécialités par défaut (ADR, Frigo, etc.) ?")) {
      await seedSpecialties();
      onRefresh();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Gestion des Types */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-opti-blue flex items-center gap-2">
            Types de Véhicules
            <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">{types.length}</span>
          </h4>
          {!editingType && (
            <button 
              onClick={() => setEditingType({})}
              className="text-opti-red hover:bg-red-50 p-1 rounded-full transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="space-y-2">
          {editingType && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-100 space-y-3 animate-fade-in">
              <input 
                type="text"
                placeholder="Nom du type (ex: Tautliner)"
                value={newTypeName}
                onChange={e => setNewTypeName(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-opti-red"
              />
              <input 
                type="text"
                placeholder="Description courte"
                value={newTypeDesc}
                onChange={e => setNewTypeDesc(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-opti-red"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditingType(null)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                <button onClick={handleSaveType} className="p-1 text-green-600 hover:text-green-700"><Check className="w-5 h-5" /></button>
              </div>
            </div>
          )}

          {types.map(type => (
            <div key={type.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
              <div>
                <p className="text-sm font-bold text-opti-blue">{type.name}</p>
                {type.description && <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{type.description}</p>}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    setEditingType(type);
                    setNewTypeName(type.name);
                    setNewTypeDesc(type.description || "");
                  }}
                  className="p-1.5 text-gray-400 hover:text-opti-blue"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDeleteType(type.id)} className="p-1.5 text-gray-400 hover:text-opti-red">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gestion des Spécialités */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-opti-blue flex items-center gap-2">
            Spécialités
            <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">{specialties.length}</span>
          </h4>
          {!editingSpecialty && (
            <button 
              onClick={() => setEditingSpecialty({})}
              className="text-opti-red hover:bg-red-50 p-1 rounded-full transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="space-y-2">
          {editingSpecialty && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-100 space-y-3 animate-fade-in">
              <input 
                type="text"
                placeholder="Nom de la spécialité (ex: ADR)"
                value={newSpecName}
                onChange={e => setNewSpecName(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-opti-red"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditingSpecialty(null)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                <button onClick={handleSaveSpecialty} className="p-1 text-green-600 hover:text-green-700"><Check className="w-5 h-5" /></button>
              </div>
            </div>
          )}

          {specialties.map(spec => (
            <div key={spec.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
              <p className="text-sm font-bold text-opti-blue">{spec.name}</p>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    setEditingSpecialty(spec);
                    setNewSpecName(spec.name);
                  }}
                  className="p-1.5 text-gray-400 hover:text-opti-blue"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDeleteSpec(spec.id)} className="p-1.5 text-gray-400 hover:text-opti-red">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {specialties.length === 0 && !editingSpecialty && (
            <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
              <p className="text-xs text-gray-400 mb-4">Aucune spécialité configurée.</p>
              <button 
                onClick={handleSeed}
                className="text-[10px] font-bold text-opti-red hover:underline uppercase tracking-widest"
              >
                Initialiser avec les valeurs par défaut
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

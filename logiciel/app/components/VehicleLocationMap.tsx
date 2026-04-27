"use client";

import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function VehicleLocationMap({ plate }: { plate: string }) {
  // Liste de vraies coordonnées GPS situées exactement sur des autoroutes françaises
  const MOCK_HIGHWAY_LOCATIONS: [number, number][] = [
    [47.8153, 3.5358], // A6 près d'Auxerre
    [44.9126, 4.8879], // A7 près de Valence
    [47.9348, 1.8122], // A10 près d'Orléans
    [50.4571, 2.9772], // A1 près de Lille
    [48.0645, 0.2081], // A11 près du Mans
    [43.5684, 3.8647], // A9 près de Montpellier
    [43.1951, 2.3765], // A61 près de Carcassonne
    [48.6253, 2.4552], // N104 Francilienne
    [49.2155, 4.0201], // A4 près de Reims
    [43.5587, 6.9733]  // A8 près de Cannes
  ];

  // Sélectionner une position aléatoire parmi la liste au chargement
  const [position] = useState<[number, number]>(() => {
    const randomIndex = Math.floor(Math.random() * MOCK_HIGHWAY_LOCATIONS.length);
    return MOCK_HIGHWAY_LOCATIONS[randomIndex];
  });

  // Création du marqueur personnalisé dans le même style que le dashboard
  const customIcon = useMemo(() => {
    return L.divIcon({
      className: "custom-vehicle-marker",
      html: `
        <div style="
          width: 24px; 
          height: 24px; 
          background-color: #ef4444; /* opti-red */
          border-radius: 50%; 
          border: 2px solid white; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%; opacity: 0.9;"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  }, []);

  return (
    <div className="w-full h-full min-h-[200px] relative z-0">
      <MapContainer 
        center={position} 
        zoom={9} 
        style={{ width: "100%", height: "100%", zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            <div className="font-bold text-opti-blue text-sm">{plate}</div>
            <div className="text-xs text-green-600 mt-1">Dernière position connue</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

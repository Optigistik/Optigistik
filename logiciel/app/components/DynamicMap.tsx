"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Fix Leaflet's default icon path issues avec React/Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface RouteProps {
  waypoints: L.LatLng[];
  color: string;
  name: string;
}

function Routing({ waypoints, color, name }: RouteProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const controlOptions: any = {
      waypoints: waypoints,
      routeWhileDragging: true,
      showAlternatives: false, // Masque les routes alternatives pour ne pas surcharger
      fitSelectedRoutes: false, // Désactivé pour que la carte ne zoome pas excessivement sur chaque route
      lineOptions: {
        styles: [{ color: color, weight: 5, opacity: 0.8 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      show: false, // Pas d'instructions écrites
      
      createMarker: function(i: number, wp: any, nWps: number) {
        const isStart = i === 0;
        const isEnd = i === nWps - 1;
        
        let label = `Étape (${name})`;
        if (isStart) label = `Départ : ${name}`;
        if (isEnd) label = `Arrivée : ${name}`;

        const customIcon = L.divIcon({
          className: "custom-routing-marker",
          html: `
            <div style="
              width: 24px; 
              height: 24px; 
              background-color: ${color}; 
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

        const marker = L.marker(wp.latLng, {
          icon: customIcon,
          draggable: true 
        });
        
        marker.bindPopup(`<div class="text-center font-medium">${label}</div>`);
        return marker;
      }
    };

    const routingControl = L.Routing.control(controlOptions).addTo(map);

    return () => {
      try {
        map.removeControl(routingControl);
      } catch (e) {
        console.error("Erreur de nettoyage routing", e);
      }
    };
  }, [map, waypoints, color, name]);

  return null;
}

function MapResizer({ isFullScreen }: { isFullScreen?: boolean }) {
  const map = useMap();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => clearTimeout(timer);
  }, [map, isFullScreen]);

  return null;
}

// Composant interatif pour recentrer la carte
function RecenterButton({ position }: { position: L.LatLngExpression }) {
  const map = useMap();

  const handleRecenter = () => {
    // Animation fluide pour revenir au centre
    map.flyTo(position, 5, {
      animate: true,
      duration: 1.5 // Durée du voyage
    });
  };

  return (
    <div 
      className="absolute bottom-4 left-4 bg-white/95 backdrop-blur p-2.5 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-200 z-[1000] cursor-pointer hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all pointer-events-auto group"
      onClick={handleRecenter}
    >
      <div className="text-xs font-bold text-opti-blue flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 transition-opacity"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        Vue d'ensemble de la flotte
      </div>
    </div>
  );
}

// Jeu de données fictives couvrant l'Europe et la zone frontalière
const MOCK_ROUTES = [
  { id: 1, name: "Paris - Berlin", color: "#0ea5e9", waypoints: [L.latLng(48.8566, 2.3522), L.latLng(52.52, 13.405)] },
  { id: 2, name: "Lyon - Barcelone", color: "#ef4444", waypoints: [L.latLng(45.764, 4.8357), L.latLng(41.3851, 2.1734)] },
  { id: 3, name: "Marseille - Milan - Vienne", color: "#10b981", waypoints: [L.latLng(43.2965, 5.3698), L.latLng(45.4642, 9.19), L.latLng(48.2082, 16.3738)] },
  { id: 4, name: "Lille - Amsterdam", color: "#f59e0b", waypoints: [L.latLng(50.6292, 3.0573), L.latLng(52.3676, 4.9041)] },
  { id: 5, name: "Bordeaux - Lisbonne", color: "#8b5cf6", waypoints: [L.latLng(44.8378, -0.5792), L.latLng(38.7223, -9.1393)] },
];

export default function DynamicMap({ isFullScreen }: { isFullScreen?: boolean }) {
  // Centre de la France avec un dé-zoom pour voir l'Europe
  const centerPosition: L.LatLngExpression = [46.2276, 2.2137];

  return (
    <MapContainer
      center={centerPosition}
      zoom={5}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      <MapResizer isFullScreen={isFullScreen} />
      <RecenterButton position={centerPosition} />

      {/* Style de carte Stadia Alidade Smooth */}
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
      />

      {/* Rendu dynamique de multiples itinéraires partout en Europe */}
      {MOCK_ROUTES.map((route) => (
        <Routing
          key={route.id}
          name={route.name}
          color={route.color}
          waypoints={route.waypoints}
        />
      ))}
    </MapContainer>
  );
}
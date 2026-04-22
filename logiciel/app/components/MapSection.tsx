"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Maximize, Minimize } from "lucide-react";

// Import dynamique sans SSR pour éviter l'erreur window is not defined avec Leaflet
const DynamicMap = dynamic(() => import("./DynamicMap"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-opti-red"></div>
    </div>
  ),
});

export default function MapSection() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div 
      className={`bg-white shadow-sm overflow-hidden transition-all duration-300 ${
        isFullScreen 
          ? "fixed inset-0 z-[5000] w-screen h-screen rounded-none border-none" 
          : "rounded-3xl border border-gray-100 h-[500px] relative"
      }`}
    >
      <DynamicMap isFullScreen={isFullScreen} />

      {/* Bouton pour basculer en plein écran */}
      <button
        onClick={() => setIsFullScreen(!isFullScreen)}
        className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur p-2.5 rounded-lg shadow-sm border border-gray-200 text-gray-700 hover:text-opti-blue hover:bg-white transition-all duration-200"
        title={isFullScreen ? "Réduire" : "Plein écran"}
      >
        {isFullScreen ? (
          <Minimize size={20} className="stroke-2" />
        ) : (
          <Maximize size={20} className="stroke-2" />
        )}
      </button>
    </div>
  );
}
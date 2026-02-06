"use client";

import { useEffect, useState } from "react";
import { getMapUrl } from "@/services/dashboard";
import { Map as MapIcon } from "lucide-react";

export default function MapSection() {
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const url = await getMapUrl();
        setMapUrl(url);
      } catch (error) {
        console.error("Failed to load map", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMap();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 h-[500px] relative overflow-hidden">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-opti-red"></div>
        </div>
      ) : mapUrl ? (
        <iframe
          src={mapUrl}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
          <MapIcon className="w-12 h-12 mb-3 opacity-20" />
          <p className="font-medium">Aucune carte configurée</p>
          <p className="text-sm opacity-60">
            La carte s'affichera une fois ajoutée à la base de données
          </p>
        </div>
      )}

      {!loading && mapUrl && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-2 rounded-lg shadow-sm border border-gray-200 pointer-events-none">
          <div className="text-xs font-bold text-opti-blue">
            Vue d'ensemble de la flotte
          </div>
        </div>
      )}
    </div>
  );
}

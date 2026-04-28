"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FleetTabs() {
  const pathname = usePathname();

  // On détermine quel onglet est actif en fonction de l'URL
  const isDriversActive = pathname.startsWith("/conducteurs-flotte");
  const isFleetActive = pathname.startsWith("/fleet");

  return (
    <div className="mb-6 flex gap-8 border-b border-gray-200">
      <Link
        href="/conducteurs-flotte"
        className={`py-2 px-1 transition-colors ${
          isDriversActive
            ? "text-opti-blue border-b-2 border-opti-blue font-bold"
            : "text-gray-500 hover:text-opti-blue font-medium"
        }`}
      >
        Conducteurs
      </Link>
      
      <Link
        href="/fleet"
        className={`py-2 px-1 transition-colors ${
          isFleetActive
            ? "text-opti-red border-b-2 border-opti-red font-bold"
            : "text-gray-500 hover:text-opti-red font-medium"
        }`}
      >
        Flotte de véhicules
      </Link>
    </div>
  );
}
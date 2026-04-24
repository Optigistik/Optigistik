
// 1. Configuration (Singleton)
export interface CompanySettings {
  name: string;
  siret: string;
  mapCenter: {
    lat: number;
    lng: number;
  };
}

// 2. Les Ressources
export interface User {
  uid: string;
  email: string;
  role: "ADMIN" | "DISPATCHER" | "DRIVER";
  name: string;
}

export interface Vehicle {
  id: string; 
  licensePlate: string;
  type: "Frigo" | "Semi" | "VUL";
  capacity: number; 
}

// 3. Le Métier (Commandes)
export interface Location {
  address: string;
  lat: number;
  lng: number;
  contactName?: string;
  contactPhone?: string;
}

export interface Order {
  id: string;
  customerName: string;
  status: "PENDING" | "ASSIGNED" | "DONE";
  pickup: Location;
  delivery: Location;
  weight?: number;
}

// 4. L'Optimisation (Tournées)
export interface RouteStep {
  type: "PICKUP" | "DELIVERY";
  orderId: string;
  status: "PENDING" | "DONE" | "FAILED";
  estimatedArrival?: Date;
}

export interface Route {
  id: string;
  date: Date;
  driverId: string;
  vehicleId: string;
  steps: RouteStep[];
  metrics?: {
    totalKm: number;
    totalTimeSeconds: number;
  };
}

// 5. Les Conducteurs
export type DriverRegime = "GRAND_ROUTIER" | "AUTRE_PERSONNEL";
export type DriverStatus = "EN_MISSION" | "DISPONIBLE" | "INDISPONIBLE";

export interface DriverUnavailability {
  id: string;
  type: "CONGES_ANNUELS" | "FORMATION" | "MALADIE" | "AUTRE";
  label: string;
  startDate: string;
  endDate: string;
  approvedBy?: string;
  note?: string;
}

export interface AssignedVehicle {
  vehicleId: string;
  label: string;
  role: "PRINCIPAL" | "REMPLACEMENT";
  isActive: boolean;
  lastMaintenance?: string;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;

  // Profil contractuel (ticket Jira)
  regime: DriverRegime;
  nightWorkAuthorized: boolean;

  // Infos techniques
  licenseTypes: string[];
  licenseExpiry?: string;
  employeeId: string;
  seniority: string;
  languages: string[];

  // Rattachement
  role: string;

  status: DriverStatus;
  unavailabilities: DriverUnavailability[];
  assignedVehicles: AssignedVehicle[];
}

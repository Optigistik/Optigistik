import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Vehicle } from '@/types'; // Ton interface UML

// Fonction pour ajouter un véhicule
export const addVehicleToDB = async (plate: string, type: 'Frigo' | 'Semi' | 'VUL', capacity: number) => {
  try {
    // 1. On prépare l'objet en respectant l'interface TypeScript
    // Note: on ne met pas l'ID ici, c'est Firebase qui le crée
    const newVehicle: Omit<Vehicle, 'id'> = {
      licensePlate: plate,
      type: type,
      capacity: capacity
    };

    // 2. On écrit dans la collection "vehicles"
    const docRef = await addDoc(collection(db, "vehicles"), newVehicle);
    
    console.log("Succès ! Véhicule créé avec ID :", docRef.id);
    return docRef.id;

  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
    throw error;
  }
};
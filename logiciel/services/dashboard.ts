import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";

export interface Incident {
  id: string;
  title: string;
  type: "danger" | "warning";
  timestamp: Timestamp;
}

export interface ChartData {
  name: string;
  value: number;
}

export const getIncidents = async (): Promise<Incident[]> => {
  try {
    const q = query(
      collection(db, "incidents"),
      orderBy("timestamp", "desc"),
      limit(5),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Incident,
    );
  } catch (error) {
    console.error("Error fetching incidents:", error);
    return [];
  }
};

export const getStats = async (): Promise<ChartData[]> => {
  try {
    // Fetching from 'activity' collection as requested
    const q = query(collection(db, "activity"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Return default data if empty to avoid broken UI
      return [
        { name: "Lun", value: 400 },
        { name: "Mar", value: 300 },
        { name: "Mer", value: 550 },
        { name: "Jeu", value: 450 },
        { name: "Ven", value: 600 },
        { name: "Sam", value: 700 },
        { name: "Dim", value: 900 },
      ];
    }

    return querySnapshot.docs.map((doc) => doc.data() as ChartData);
  } catch (error) {
    console.error("Error fetching activity stats:", error);
    return [];
  }
};

export const getMapUrl = async (): Promise<string | null> => {
  try {
    const q = query(collection(db, "settings"), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      return data.mapUrl || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching map config:", error);
    return null;
  }
};

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type UserRole = 'admin' | 'gestionnaire' | 'membre';

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Récupérer le profil dans Firestore
        try {
          // 1. Essayer d'abord par ID de document (méthode recommandée)
          const docRef = doc(db, "users", currentUser.uid);
          let docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfile({ uid: currentUser.uid, ...docSnap.data() } as UserProfile);
          } else {
            // 2. Si pas trouvé, chercher un document qui a le champ 'uid' égal à l'uid actuel
            const q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0];
              setProfile({ uid: currentUser.uid, ...userDoc.data() } as UserProfile);
            } else {
              console.warn("Aucun document trouvé pour l'UID:", currentUser.uid);
              setProfile(null);
            }
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du profil utilisateur:", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

"use client";

import { useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase";

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode; // Ce qu'on affiche si l'accès est refusé (par défaut: rien)
}

export default function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Écouter les changements d'état d'authentification
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Force le rafraîchissement du token pour avoir les claims à jour
          const tokenResult = await user.getIdTokenResult(true);
          const role = (tokenResult.claims.role as string) || null;
          setUserRole(role);
        } catch (error) {
          console.error("Erreur lors de la récupération du rôle", error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    // On n'affiche rien le temps de vérifier le rôle pour éviter les "flashs" d'UI
    return null; 
  }

  // Si l'utilisateur n'a pas de rôle ou que son rôle n'est pas autorisé
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  // S'il est autorisé, on affiche le composant normal
  return <>{children}</>;
}

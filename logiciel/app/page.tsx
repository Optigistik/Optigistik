"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { User, signOut } from "firebase/auth";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Surveiller l'état de connexion
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={() => signOut(auth)} />;
  }

  return <AuthForm />;
}

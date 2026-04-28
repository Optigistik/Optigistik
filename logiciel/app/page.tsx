"use client";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import { useAuth } from "@/app/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-opti-red"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={() => signOut(auth)} />;
  }

  return <AuthForm />;
}

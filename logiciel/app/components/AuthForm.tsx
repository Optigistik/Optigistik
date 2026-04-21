"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { Truck, ArrowRight, Mail, Lock, AlertCircle } from "lucide-react";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // Success is handled by the parent observer
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-credential")
        setError("Identifiants incorrects.");
      else if (err.code === "auth/email-already-in-use")
        setError("Cet email est déjà utilisé.");
      else if (err.code === "auth/weak-password")
        setError("Mot de passe trop faible (6 car. min).");
      else setError("Une erreur est survenue. Réessayez.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Success is handled by the parent observer
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("La connexion avec Google a été annulée.");
      } else {
        setError("Une erreur est survenue avec Google. Réessayez.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Branding & Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-opti-blue relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 p-12 text-white max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <Truck className="w-8 h-8 text-opti-red" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-display text-white">
              Optigistik
            </h1>
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight font-display">
            Optimisez votre logistique de transport en temps réel.
          </h2>
          <p className="text-gray-200 text-lg leading-relaxed">
            Une solution complète pour gérer votre flotte, suivre vos tournées
            et anticiper les incidents sur la route.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-opti-red font-display">
              {isLoginMode
                ? "Connexion à votre espace"
                : "Créer un compte transporteur"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {isLoginMode
                ? "Saisissez vos identifiants pour accéder au tableau de bord."
                : "Rejoignez Optigistik pour commencer."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-opti-black mb-1">
                  Email professionnel
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-opti-red focus:border-opti-red transition-colors outline-none text-opti-black bg-gray-50 focus:bg-white"
                    placeholder="nom@entreprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-opti-black mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-opti-red focus:border-opti-red transition-colors outline-none text-opti-black bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-opti-red text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-opti-red hover:bg-opti-red-dark text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLoginMode ? "Se connecter" : "S'inscrire"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuer avec Google
          </button>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError("");
              }}
              className="text-sm font-medium text-opti-red hover:text-opti-red-dark transition-colors hover:underline"
            >
              {isLoginMode
                ? "Pas encore de compte ? Créer un compte"
                : "Déjà inscrit ? Se connecter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

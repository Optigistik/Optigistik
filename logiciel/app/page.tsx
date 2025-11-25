'use client';

import { useState, useEffect } from 'react';
import { addVehicleToDB } from '@/services/vehicleService';
import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  User, 
  signOut 
} from 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  
  // États pour le formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true); // Pour basculer entre Login / Inscription
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Surveiller l'état de connexion
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Gestion de la connexion / inscription
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // On vide les champs après succès
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error(err);
      // Messages d'erreur plus sympas en français
      if (err.code === 'auth/invalid-credential') setError("Email ou mot de passe incorrect.");
      else if (err.code === 'auth/email-already-in-use') setError("Cet email existe déjà.");
      else if (err.code === 'auth/weak-password') setError("Le mot de passe doit faire 6 caractères min.");
      else setError("Une erreur est survenue.");
    }
  };

  // Test d'ajout de véhicule
  const handleTestCreate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await addVehicleToDB("PRO-B2B-01", "Frigo", 18000);
      alert("Véhicule ajouté avec succès !");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'ajout.");
    }
    setLoading(false);
  };

  // --- VUE CONNECTÉE ---
  if (user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-6 bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Tableau de Bord</h1>
            <p className="text-sm text-gray-500 mt-2">{user.email}</p>
          </div>

          <button 
            onClick={handleTestCreate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition mb-4"
          >
            {loading ? "Traitement..." : "Simuler Création Véhicule"}
          </button>

          <button 
            onClick={() => signOut(auth)} 
            className="text-sm text-red-500 hover:text-red-700 underline"
          >
            Se déconnecter
          </button>
        </div>
      </main>
    );
  }

  // --- VUE CONNEXION (LOGIN) ---
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-900">Optigistik</h1>
        <p className="text-center text-gray-500 mb-8">Portail Transporteur B2B</p>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email professionnel</label>
            <input 
              type="email" 
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black"
              placeholder="ex: admin@transports-demo.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input 
              type="password" 
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit"
            className="mt-2 bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition"
          >
            {isLoginMode ? "Se connecter" : "Créer un compte"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-sm text-blue-600 hover:underline"
          >
            {isLoginMode ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </main>
  );
}
'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') setError("Email ou mot de passe incorrect.");
      else if (err.code === 'auth/email-already-in-use') setError("Cet email existe déjà.");
      else if (err.code === 'auth/weak-password') setError("Le mot de passe doit faire 6 caractères min.");
      else setError("Une erreur est survenue.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-900">Optigistik</h1>
        <p className="text-center text-slate-500 mb-8">Portail Transporteur B2B</p>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email professionnel</label>
            <input 
              type="email" 
              required
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
              placeholder="ex: admin@transports-demo.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
            <input 
              type="password" 
              required
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit"
            className="mt-2 bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition shadow-md hover:shadow-lg"
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

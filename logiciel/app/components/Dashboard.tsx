'use client';

import { User } from 'firebase/auth';
import Sidebar from './Sidebar';
import StatsGrid from './StatsGrid';
import MapSection from './MapSection';

interface DashboardProps {
  user: User | null;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar user={user} onLogout={onLogout} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Page d'accueil Logiciel</h1>
            <p className="text-slate-500 text-sm mt-1">Bienvenue sur votre espace de gestion Optigistik</p>
          </div>
          {/* Optional: Add global actions or date here */}
          <div className="text-sm text-slate-400">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <StatsGrid />
        
        <MapSection />
      </main>
    </div>
  );
}

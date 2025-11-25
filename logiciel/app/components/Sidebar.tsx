'use client';

import { Home, Truck, Map, Users, Menu, LogOut } from 'lucide-react';
import { User } from 'firebase/auth';

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const menuItems = [
    { name: 'Accueil', icon: Home, active: true },
    { name: 'Conducteurs & Flotte', icon: Truck, active: false },
    { name: 'Tournées & Abonnements', icon: Map, active: false },
    { name: 'Gestion des clients', icon: Users, active: false },
  ];

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-10">
      {/* Header / Logo Area */}
      <div className="p-6 flex items-center gap-4">
        <button className="p-1 hover:bg-slate-200 rounded">
          <Menu className="w-6 h-6 text-slate-700" />
        </button>
        {/* <span className="font-bold text-xl text-blue-900">Optigistik</span> */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              item.active
                ? 'text-red-500 font-medium bg-red-50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.active ? 'text-red-500' : 'text-slate-500'}`} />
            <span className="text-sm">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* User Profile (Bottom) */}
      <div className="p-4 border-t border-slate-200">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
            {user?.email ? user.email[0].toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user?.displayName || 'Utilisateur'}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button 
            onClick={onLogout}
            className="text-slate-400 hover:text-red-500 transition-colors"
            title="Se déconnecter"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

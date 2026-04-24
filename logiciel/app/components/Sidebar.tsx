"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Truck, Map as MapIcon, Users, Menu, LogOut } from "lucide-react";
import { User } from "firebase/auth";

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ user, onLogout, isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Accueil", icon: Home, href: "/" },
    { name: "Conducteurs & Flotte", icon: Truck, href: null },
    { name: "Tournées & Abonnements", icon: MapIcon, href: "/tournees" },
    { name: "Gestion des clients", icon: Users, href: null },
  ];

  return (
    <aside
      className={`bg-white text-opti-blue flex flex-col h-screen sticky top-0 shrink-0 z-20 transition-all duration-300 ease-in-out font-sans ${
        isCollapsed ? "w-20" : "w-72"
      } py-6 pl-4`}
    >
      {/* Header / Hamburger */}
      <div className="flex items-center mb-10">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg text-opti-blue transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4" aria-label="Navigation principale">
        {menuItems.map((item) => {
          const isActive = item.href ? pathname === item.href || pathname.startsWith(item.href + '/') : false;
          const className = `w-full flex items-center gap-4 py-3 px-4 rounded-l-full transition-all group relative ${
            isActive
              ? "bg-red-50 text-opti-red font-bold"
              : "text-opti-blue hover:bg-gray-50 hover:text-opti-red font-semibold"
          }`;

          if (item.href) {
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-label={item.name}
                aria-current={isActive ? "page" : undefined}
                className={className}
                title={isCollapsed ? item.name : ""}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-opti-red" : "text-opti-blue"}`} />
                {!isCollapsed && <span className="text-sm truncate">{item.name}</span>}
              </Link>
            );
          }

          return (
            <button
              key={item.name}
              className={className}
              title={isCollapsed ? item.name : ""}
              aria-label={item.name}
              disabled
            >
              <item.icon className="w-5 h-5 shrink-0 text-opti-blue opacity-40" />
              {!isCollapsed && <span className="text-sm truncate opacity-40">{item.name}</span>}
            </button>
          );
        })}
      </nav>

      {/* User Profile (Bottom) */}
      <div className="pr-4 mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 shadow-sm bg-white">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Profil" 
              className="w-10 h-10 rounded-full shrink-0 object-cover border border-gray-100"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-opti-red flex items-center justify-center text-white font-bold shrink-0">
              {user?.displayName 
                ? user.displayName.charAt(0).toUpperCase() 
                : user?.email 
                  ? user.email.charAt(0).toUpperCase() 
                  : 'U'}
            </div>
          )}

          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p 
                  className="text-sm font-bold text-opti-blue truncate"
                  title={user?.displayName || user?.email || "Utilisateur"}
                >
                  {user?.displayName || user?.email?.split('@')[0] || "Utilisateur"}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-500 hover:text-opti-red hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

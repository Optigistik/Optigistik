"use client";

import {
  Home,
  Truck,
  Map,
  Users,
  Menu,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { User } from "firebase/auth";

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({
  user,
  onLogout,
  isCollapsed,
  toggleSidebar,
}: SidebarProps) {
  const menuItems = [
    { name: "Accueil", icon: Home, active: true },
    { name: "Conducteurs & Flotte", icon: Truck, active: false },
    { name: "Tournées & Abonnements", icon: Map, active: false },
    { name: "Gestion des clients", icon: Users, active: false },
  ];

  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shrink-0 z-20 transition-all duration-300 ease-in-out overflow-x-hidden ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header / Logo Area */}
      <div
        className={`h-16 flex items-center ${
          isCollapsed ? "justify-center" : "px-6 justify-between"
        } border-b border-gray-100 shrink-0`}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2 font-bold text-xl text-opti-red font-display">
            <span className="truncate">Optigistik</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={`flex-1 py-6 space-y-2 overflow-y-auto overflow-x-hidden ${
          isCollapsed ? "px-2" : "px-3"
        }`}
      >
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`w-full flex items-center gap-3 py-3 rounded-lg transition-all group relative ${
              isCollapsed ? "justify-center px-2" : "px-3"
            } ${
              item.active
                ? "bg-red-50 text-opti-red font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-opti-red"
            }`}
            title={isCollapsed ? item.name : ""}
          >
            <item.icon
              className={`w-5 h-5 shrink-0 ${
                item.active
                  ? "text-opti-red"
                  : "text-gray-400 group-hover:text-opti-red"
              }`}
            />

            {!isCollapsed && (
              <span className="text-sm truncate">{item.name}</span>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-opti-red text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                {item.name}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* User Profile (Bottom) */}
      <div className="p-4 border-t border-gray-200 shrink-0">
        <div
          className={`flex items-center gap-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-opti-red flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
            {user?.email ? user.email[0].toUpperCase() : "U"}
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-semibold text-opti-black truncate">
                {user?.displayName || "Utilisateur"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          )}

          {!isCollapsed && (
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-opti-red hover:bg-red-50 rounded-lg transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
        {/* Logout button for collapsed state */}
        {isCollapsed && (
          <button
            onClick={onLogout}
            className="mt-4 w-full flex justify-center p-2 text-gray-400 hover:text-opti-red hover:bg-red-50 rounded-lg transition-colors"
            title="Se déconnecter"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
}

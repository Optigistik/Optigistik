"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Accueil", href: "/" },
    { label: "Fonctionnalités", href: "/features" },
    { label: "Tarifications", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Nous contacter", href: "/contact" },
  ];

  const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="w-full flex items-center justify-between px-5 md:px-10 py-4 bg-white shadow-sm fixed top-0 left-0 z-50">
      
      {/* LOGO */}
      <Link href="/" className="flex items-center gap-2">
        <img
          src="/assets/LogoOptigistik2.png"
          alt="Optigistik logo"
          className="h-14 md:h-16 w-auto"
        />
      </Link>

      {/* DESKTOP NAV */}
      <div className="hidden lg:flex items-center gap-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium px-3 py-1 rounded-md transition 
                ${
                  isActive
                    ? "bg-gray-100 text-[#0C1D36]"
                    : "text-gray-700 hover:text-gray-900"
                }
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* DESKTOP BUTTON */}
      <Link
        href="/register"
        className="hidden lg:block px-5 py-2 bg-[#FF453A] text-white rounded-xl font-medium hover:bg-[#e53e32] transition"
      >
        S’enregistrer
      </Link>

      {/* MOBILE BURGER BUTTON */}
      <button
        className="lg:hidden flex flex-col gap-1.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`h-1 w-7 bg-black rounded transition ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
        <span className={`h-1 w-7 bg-black rounded transition ${isOpen ? "opacity-0" : ""}`}></span>
        <span className={`h-1 w-7 bg-black rounded transition ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
      </button>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t shadow-lg flex flex-col p-5 lg:hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`text-base font-medium py-3 border-b 
                  ${
                    isActive
                      ? "text-[#0C1D36]"
                      : "text-gray-700 hover:text-gray-900"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}

          {/* MOBILE BUTTON */}
          <Link
            href="/register"
            onClick={handleLinkClick}
            className="mt-4 px-5 py-3 bg-[#FF453A] text-white rounded-xl font-medium hover:bg-[#e53e32] transition text-center"
          >
            S’enregistrer
          </Link>
        </div>
      )}
    </nav>
  );
}
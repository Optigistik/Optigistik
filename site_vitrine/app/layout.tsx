import type { Metadata } from "next";
import { Geist, Geist_Mono, Archivo_Black } from "next/font/google";
import "./globals.css";

// 👉 Import de ta Navbar
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AccessibilityToolbar from "./components/AccessibilityToolbar";
import { Providers } from "./providers";

// Polices
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 👉 AJOUT : Archivo Black pour les titres
const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Optigistik",
  description: "Optimisez vos flux logistiques avec l'intelligence artificielle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${archivoBlack.variable}  
          antialiased
        `}
      >
        <Providers>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          <AccessibilityToolbar />
        </Providers>
      </body>
    </html>
  );
}
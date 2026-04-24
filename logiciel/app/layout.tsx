import type { Metadata } from "next";
import { Archivo_Black, Open_Sans } from "next/font/google";
import "./globals.css";

const archivoBlack = Archivo_Black({
  weight: "400",
  variable: "--font-archivo",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-opensans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Optigistik",
  description: "Portail Transporteur B2B",
};

import { AuthProvider } from "@/app/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${archivoBlack.variable} ${openSans.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

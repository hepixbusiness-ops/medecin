import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://brief.agence.example";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Brief Client — Dossier de projet web",
    template: "%s — Brief Client",
  },
  description:
    "Déposez toutes les informations et fichiers nécessaires à la création de votre site en quelques minutes : entreprise, identité visuelle, pages, budget.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    title: "Brief Client — Dossier de projet web",
    description:
      "Un formulaire guidé pour rassembler en une seule fois tout ce dont l'agence a besoin pour démarrer votre site.",
    siteName: "Brief Client",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brief Client — Dossier de projet web",
    description:
      "Un formulaire guidé pour rassembler en une seule fois tout ce dont l'agence a besoin pour démarrer votre site.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16211c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body className="min-h-[100dvh] antialiased">{children}</body>
    </html>
  );
}

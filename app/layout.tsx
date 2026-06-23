import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { company } from "@/lib/data/company";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://multiacerosbym.com"),
  title: {
    default: `${company.legalName} — ${company.slogan} | Bucaramanga`,
    template: `%s | ${company.legalName}`,
  },
  description:
    "Distribuidores de acero y materiales para construcción y ornamentación en Bucaramanga: tubería, perfilería, láminas, cubiertas, tejas, varilla, cemento y herramientas. Mayorista y minorista con asesoría especializada.",
  keywords: [
    "acero",
    "ferretería industrial",
    "materiales de construcción",
    "Bucaramanga",
    "tubería",
    "perfilería",
    "cubiertas",
    "tejas",
    "láminas",
    "ornamentación",
    "MultiAceros",
  ],
  authors: [{ name: company.legalName }],
  openGraph: {
    title: `${company.legalName} — ${company.slogan}`,
    description:
      "Acero y materiales para construcción y ornamentación en Bucaramanga. Calidad certificada, asesoría profesional y despacho ágil.",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable} antialiased`}>
      <body className="min-h-screen bg-white text-ink">
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}

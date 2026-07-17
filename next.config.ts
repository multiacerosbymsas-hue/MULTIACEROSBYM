import type { NextConfig } from "next";
import path from "path";

/**
 * Cabeceras de seguridad aplicadas a todas las rutas.
 * - frame-ancestors / X-Frame-Options: bloquean clickjacking (que metan el
 *   sitio en un iframe ajeno para engañar al usuario).
 * - nosniff: impide que el navegador adivine tipos MIME.
 * - Referrer-Policy / Permissions-Policy: limitan fugas y APIs sensibles.
 * (HSTS ya lo añade Vercel automáticamente.)
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto (hay un package-lock.json suelto en el home del
  // usuario que confundía a Turbopack al inferir el workspace).
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Fotos subidas desde el panel admin (bucket público "site" en Supabase).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kiiojgdrwlffpibncbbz.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Las fotos del panel (promoción, familias) llegan como FormData.
      bodySizeLimit: "8mb",
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

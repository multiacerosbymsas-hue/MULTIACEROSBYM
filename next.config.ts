import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto (hay un package-lock.json suelto en el home del
  // usuario que confundía a Turbopack al inferir el workspace).
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;

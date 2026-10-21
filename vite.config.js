/**
 * Configures Tailwind integration and automatic JSX compilation for the client-only Vite application.
 */
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// ========================================
// VITE BUILD CONFIGURATION
// ========================================
export default defineConfig({
  plugins: [tailwindcss()],
  esbuild: { jsx: "automatic" },
});

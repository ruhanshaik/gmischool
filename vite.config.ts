import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Standard Vite + React SPA configuration
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: "dist",
  },
  server: {
    host: true,
  },
});

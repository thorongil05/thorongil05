import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  preview: {
    port: 8080,
    allowedHosts: ["my-financial-dashboard.up.railway.app"],
  },
  server: {
    port: 5173,
  },
  plugins: [react(), tailwindcss()],
});

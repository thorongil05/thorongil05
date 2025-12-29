import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  preview: {
    port: 5713,
  },
  server: {
    port: 5713,
  },
  plugins: [react(), tailwindcss()],
});

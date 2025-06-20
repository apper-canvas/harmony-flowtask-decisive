import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  build: { target: 'esnext', },
  resolve: { alias: { "@": fileURLToPath(new URL('./src', import.meta.url)) }},
  server: { allowedHosts: true, host: true, strictPort: true, port: 5173 }
});
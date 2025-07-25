// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      "/justeat": {
        target: "https://uk.api.just-eat.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/justeat/, ""),
      },
    },
  },
});

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/telemedicinee-app/' : '/',
  plugins: [tailwindcss()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: ['all'], // allow all external hosts (ngrok)
    proxy: {
      '/api/ai5000': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai5000/, '')
      },
      '/api/ai5001': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai5001/, '')
      }
    }
  }
});

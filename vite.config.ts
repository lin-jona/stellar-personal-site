import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import cesium from 'vite-plugin-cesium'; 
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/stellar-personal-site/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    cesium(), 
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

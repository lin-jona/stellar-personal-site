import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import cesium from 'vite-plugin-cesium';
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/stellar-personal-site/',
  server: {
    host: mode === 'development' ? "localhost" : "::", // 开发环境使用localhost，生产环境保持原样
    port: 8080,
    ...(mode === 'development' && {
      // 仅在开发环境中应用以下安全设置
      cors: false, // 禁用CORS，增强安全性
      hmr: {
        // HMR (Hot Module Replacement) WebSocket配置
        clientPort: 8080, // 确保WebSocket使用相同端口
        host: "localhost", // 限制WebSocket连接的主机
      },
      strictPort: true, // 如果端口被占用，不自动尝试下一个可用端口
    }),
  },
  plugins: [
    react(),
    cesium({
      cesiumBaseUrl: '/stellar-personal-site/cesium'
    }), 
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

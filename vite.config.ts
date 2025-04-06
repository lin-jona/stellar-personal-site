// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import cesium from 'vite-plugin-cesium'; // 不再使用
import { viteStaticCopy } from 'vite-plugin-static-copy'; // 使用手动复制
import path from "path";
import { componentTagger } from "lovable-tagger";

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
    // cesium({ ... }), // 移除或注释掉 cesium 插件

    viteStaticCopy({ // 添加手动复制插件
      targets: [
        {
          src: 'node_modules/cesium/Build/Cesium/Workers',
          dest: 'cesium' // 目标：dist/cesium/Workers
        },
        {
          src: 'node_modules/cesium/Build/Cesium/Assets',
          dest: 'cesium' // 目标：dist/cesium/Assets
        },
        {
          src: 'node_modules/cesium/Build/Cesium/Widgets',
          dest: 'cesium' // 目标：dist/cesium/Widgets
        },
        // 如果你需要 ThirdParty 目录，也添加进来
        {
          src: 'node_modules/cesium/Build/Cesium/ThirdParty',
          dest: 'cesium'
        }
      ]
    }),

    mode === 'development' && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // !!! 关键：手动定义运行时的 CESIUM_BASE_URL !!!
  define: {
    // 结合你的 base 路径和手动复制的目标路径
    // 'window.CESIUM_BASE_URL': JSON.stringify('/stellar-personal-site/cesium/')

    // Inject the value into import.meta.env
    'import.meta.env.VITE_CESIUM_BASE_URL': JSON.stringify('/stellar-personal-site/cesium/'),
    // 如果你需要注入 Ion Token，也在这里或者通过 process.env 处理
    // 'import.meta.env.VITE_CESIUM_ION_TOKEN': JSON.stringify(process.env.VITE_CESIUM_ION_TOKEN || 'YOUR_FALLBACK_TOKEN')
  }
}));
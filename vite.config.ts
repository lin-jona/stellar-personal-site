// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import cesium from 'vite-plugin-cesium'; // 不再使用
import { viteStaticCopy } from 'vite-plugin-static-copy'; // 使用手动复制
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: '/stellar-personal-site/',
  
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Cesium相关模块
          if (id.includes('cesium')) {
            return 'cesium';
          }
          
          // React相关库
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor';
          }
          
          // Radix UI 组件分组
          if (id.includes('@radix-ui/react-')) {
            // 对话框相关组件
            if (id.includes('dialog') || id.includes('alert-dialog') || id.includes('hover-card') || id.includes('popover')) {
              return 'radix-dialogs';
            }
            // 导航相关组件
            if (id.includes('navigation-menu') || id.includes('menubar') || id.includes('tabs')) {
              return 'radix-navigation';
            }
            // 表单相关组件
            if (id.includes('form') || id.includes('checkbox') || id.includes('radio-group') || id.includes('select') || id.includes('slider')) {
              return 'radix-forms';
            }
            // 布局相关组件
            if (id.includes('accordion') || id.includes('collapsible') || id.includes('separator')) {
              return 'radix-layout';
            }
            // 其他基础组件
            return 'radix-base';
          }
          
          // 本地UI组件
          if (id.includes('src/components/ui/')) {
            const componentName = id.split('/').pop()?.split('.')[0];
            // 对话框相关组件
            if (['dialog', 'alert-dialog', 'hover-card', 'popover'].includes(componentName || '')) {
              return 'ui-dialogs';
            }
            // 导航相关组件
            if (['navigation-menu', 'menubar', 'tabs'].includes(componentName || '')) {
              return 'ui-navigation';
            }
            // 表单相关组件
            if (['form', 'checkbox', 'radio-group', 'select', 'slider'].includes(componentName || '')) {
              return 'ui-forms';
            }
            // 布局相关组件
            if (['accordion', 'collapsible', 'separator'].includes(componentName || '')) {
              return 'ui-layout';
            }
            // 其他基础组件
            return 'ui-base';
          }
          
          // Hooks
          if (id.includes('src/hooks/')) {
            return 'hooks';
          }
          
          // Three.js相关库
          if (id.includes('three') || id.includes('@react-three')) {
            return 'three';
          }
          
          // 其他第三方库可以根据需要添加
        }
      }
    },
    // 增加警告限制，如果仍有大块超过此值才会警告
    chunkSizeWarningLimit: 800
  },

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
    // 注入 Ion Token
    'import.meta.env.VITE_CESIUM_ION_TOKEN': JSON.stringify(process.env.VITE_CESIUM_ION_TOKEN)
  }
}));

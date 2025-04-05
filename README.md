# Welcome to your Lovable project

## 项目信息

一个基于 React 框架，利用 Cesium.js 和 Three.js 增强视觉效果的个人展示网站。
**URL**: https://lovable.dev/projects/4e6c8421-e945-475a-8527-3789e26eff8d

## 主要功能和特点

- 基于 Cesium.js 的个人经历时间线可视化
- 使用 Three.js 实现的 3D 骰子投掷交互
- 响应式设计，适配多种设备尺寸
- 平滑的页面过渡动画和滚动效果
- 动态星空背景效果
- 使用 shadcn-ui 组件库构建现代化 UI
- 基于 TanStack Query 的数据管理

## 技术实现思路

1. 脑海中初步构想想要展示的布局、动画及内容。

2. 与 Gemini 多轮对话沟通，确定个人展示网站内容及布局样式，输出文字版的原型设计。

3. 基于文字版的原型设计，使用 [Lovable](https://lovable.dev) 构建出网站框架。

4. 结合专业背景和所想逐步添加优化网站内容。
    - 结合地理专业背景，使用 Cesium.js 增加个人经历时间线（出生地、大学所在地、工作地）板块，同时添加动画交互。
    - 因为此刻正值求职期间，由未来的一些不确定性，想到添加投掷骰子的交互。最终使用 Three.js 创建一个骰子动画，并与读者有一个交互。

5. 使用 React.lazy 、React.memo 、useCallback 等重构优化代码，进行性能优化。

## 项目结构

```
src/
├── components/     # React 组件，包括页面组件和可复用组件
├── data/          # 静态数据，如项目和时间线数据
├── hooks/         # 自定义 React Hooks，包括 Cesium.js 和 Three.js 相关 hooks
├── lib/           # 工具库和通用函数
├── pages/         # 页面级组件
├── types/         # TypeScript 类型定义
└── utils/         # 工具函数，包括 3D 场景相关工具
```

## 技术栈

- **核心框架**
  - React
  - Vite
  - TypeScript

- **3D 渲染**
  - Cesium.js - 地理可视化
  - Three.js - 3D 场景渲染

- **UI 和样式**
  - shadcn-ui - UI 组件库
  - Tailwind CSS - 样式框架
  - React Router - 路由管理

- **状态管理和数据获取**
  - TanStack Query - 数据管理
  - React Context - 全局状态管理

- **开发工具**
  - ESLint - 代码规范
  - PostCSS - CSS 处理
  - TypeScript - 类型检查

## 运行和部署

### 环境要求

- Node.js >= 18
- npm 或 yarn 或 pnpm

### 开发

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

### 构建和部署

1. 构建项目
```bash
npm run build
```

2. 本地预览构建结果
```bash
npm run preview
```

构建产物将生成在 `dist` 目录中，可以部署到任何静态网站托管服务。

## 致谢

感谢以下工具和平台对本项目的支持：

- AI 工具
  - [Lovable](https://lovable.dev) - 提供项目框架和开发支持
  - [Gemini](https://ai.google.dev/aistudio) - 协助原型设计和功能规划
  - [Claude](https://claude.ai/) - 代码优化和问题解决
- 开源社区
  - [shadcn-ui](https://ui.shadcn.com/) - UI 组件库
  - [Cesium.js](https://cesium.com/cesiumjs/) - 地理可视化引擎
  - [Three.js](https://threejs.org/) - 3D 渲染引擎
  - 其他开源依赖

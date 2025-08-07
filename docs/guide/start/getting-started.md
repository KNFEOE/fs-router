# 快速开始

欢迎使用 `@feoe/fs-router`，这是一个基于文件的编译时约定式路由库，为 React Router 应用提供类型安全的路由解决方案。 

## 特性概览

- 🚀 **约定式路由** - 基于文件系统的路由约定，零配置即可使用
- 📝 **最佳实践** - 自带 React-Router v6+ BrowserRouter/DataRouter 组件模块化
- 🔒 **类型安全** - 完整的 TypeScript 支持，提供类型安全的导航
- ⚡ **高性能** - 支持代码分割和懒加载，优化应用性能
- 🔧 **多构建工具支持** - 支持 Vite、Webpack、Rspack 等主流构建工具
- 🔄 **热更新** - 开发时文件变更自动重新生成路由

## 安装

使用你喜欢的包管理器安装：

### npm

```bash
npm install @feoe/fs-router -D
```

### yarn

```bash
yarn add @feoe/fs-router
```

### pnpm

```bash
pnpm add @feoe/fs-router
```

## 系统要求

- Node.js 16.0 或更高版本
- React 18.0 或更高版本
- TypeScript 4.5 或更高版本（可选，但推荐）
- [React-Router](https://github.com/remix-run/react-router) 6.0 或更高版本

## 基础配置

根据你使用的构建工具，选择对应的配置方式：

### Vite

使用包管理器快速创建 Vite 应用，更多模版见 [Scaffolding Your First Vite Project](https://vite.dev/guide/#scaffolding-your-first-vite-project)：

```bash
npm create vite@latest
```

修改 vite.config.js 配置，集成 `@feoe/fs-router/vite` 插件：

```typescript {4,9-12}
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { FileBasedRouterVite as fileBasedRouter } from '@feoe/fs-router/vite'

export default defineConfig({
  plugins: [
    react(),
    fileBasedRouter({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx'
    })
  ]
})
```

### Rspack

使用包管理器快速创建 Rspack 应用：

```bash
npm create rspack@latest
```

修改 rspack.config.js 配置，集成 `@feoe/fs-router/rspack` 插件：

```javascript {2,6-8}
// rspack.config.js
const { FileBasedRouterRspack as fileBasedRouter } = require('@feoe/fs-router/rspack')

module.exports = {
  plugins: [
    fileBasedRouter({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx'
    })
  ]
}
```

### Rsbuild

使用包管理器快速创建 Rsbuild 应用，更多模版见 [Templates](https://rsbuild.rs/guide/start/quick-start#templates)：

```bash
npm create rsbuild@latest
```

修改 `rsbuild.config.ts` 配置，集成 `@feoe/fs-router/rspack` 插件：

```javascript {2,4-7,12}
// rsbuild.config.js
import { FileBasedRouterRspack } from "@feoe/fs-router/rspack";

const pluginRouter = FileBasedRouterRspack({
	routesDirectory: 'src/routes',
  generatedRoutesPath: 'src/routes.tsx'
});

export default defineConfig({
	tools: {
		rspack: {
			plugins: [pluginRouter],
		},
	},
});

```

### Webpack

```javascript {2,6-8}
// webpack.config.js
const { FileBasedRouterWebpack as fileBasedRouter } = require('@feoe/fs-router/webpack')

module.exports = {
  plugins: [
    fileBasedRouter({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx'
    })
  ]
}
```

## 创建第一个路由

1. 在 `src/routes` 目录下创建页面文件：

```
src/routes/
├── layout.tsx          # 根布局 (必须配置)
├── page.tsx            # 首页 (/)
└── about/
    └── page.tsx        # 关于页面 (/about)
```

2. 创建根布局文件 `src/routes/layout.tsx`：

```tsx
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div>
      <nav>
        <a href="/">首页</a>
        <a href="/about">关于</a>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

3. 创建首页 `src/routes/page.tsx`：

```tsx
export default function HomePage() {
  return (
    <div>
      <h1>欢迎使用 fs-router</h1>
      <p>这是基于文件的约定式路由示例</p>
    </div>
  )
}
```

4. 创建关于页面 `src/routes/about/page.tsx`：

```tsx
export default function AboutPage() {
  return (
    <div>
      <h1>关于我们</h1>
      <p>这是关于页面</p>
    </div>
  )
}
```

5. 在你的应用入口文件中使用生成的路由：

```tsx {7-8}
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'

// 此处示例，使用 DataRouter
const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
```

---

恭喜！你已经成功创建了第一个基于文件的路由应用。

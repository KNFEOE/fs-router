# FileBasedReactRouter

一个基于文件的约定式路由 & 运行时路由实现，为 React 应用提供类型安全的路由解决方案。

## ✨ 特性

- 🚀 **约定式路由** - 基于文件系统的路由约定，零配置即可使用
- 🔒 **类型安全** - 完整的 TypeScript 支持，提供类型安全的导航
- ⚡ **高性能** - 支持代码分割和懒加载，优化应用性能
- 🔧 **多构建工具支持** - 支持 Vite、Webpack、Rspack 等主流构建工具
- 📦 **插件化架构** - 易于扩展和自定义
- 🔄 **热更新** - 开发时文件变更自动重新生成路由

## 📦 安装

```bash
npm install @feoe/fs-router
# 或
yarn add @feoe/fs-router
# 或
pnpm add @feoe/fs-router
```

## 🚀 快速开始

### 1. 配置构建工具插件

**Vite** - See the example at [examples/vite-keep-alive-tabs](examples/vite-keep-alive-tabs/vite.config.ts)

```typescript
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

**Rspack/Rsbuild** - See more examples:
- [examples/kn-admin](examples/kn-admin/apps/shell/rsbuild.config.ts)
- [examples/rsbuild-react-monorepo](examples/rsbuild-react-monorepo/apps/shell/rsbuild.config.ts)

```javascript
// rspack.config.ts
const { FileBasedRouterRspack as fileBasedRouter } = require('@feoe/fs-router/webpack')

module.exports = {
  plugins: [
    fileBasedRouter({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx',

      // if type auto-generate was needed
      enableGeneration: true,
      typeGenerateOptions: {
        routesTypeFile: "src/routes-type.ts",
        // for Micro-FrontEnds App
        routesDirectories: [
          {
            path: path.join(__dirname, "../shell/src/routes"),
          },
          {
            prefix: "admin",
            path: path.join(__dirname, "src/routes"),
          },
        ],
      },
    })
  ]
}
```

**Webpack**

```javascript
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

### 2. 创建路由文件

```
src/routes/
├── layout.tsx          # 根布局
├── page.tsx            # 首页
├── about/
│   └── page.tsx        # /about 页面
├── user/
│   ├── layout.tsx      # 用户页面布局
│   ├── page.tsx        # /user 页面
│   └── [id]/
│       └── page.tsx    # /user/:id 页面
└── error.tsx           # 错误页面
```

### 3. 使用生成的路由

```typescript
// src/main.tsx
import { createBrowserRouter } from 'react-router-dom'
import { routes } from './routes'

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root' as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
```

## 📚 文档

- [设计文档](./docs/DESIGN.md) - 架构设计和实现细节
- [用户指南](./docs/GUIDE.md) - 详细的使用说明和 API 参考
- [约定式路由规则](./docs/GUIDE.md#约定式路由) - 文件命名约定
- [动态路由](./docs/GUIDE.md#动态路由) - 参数路由的使用

## 🔗 相关链接

- 了解更多见 [File Route Conventions & Runtime Router 基于文件的约定式路由 & 运行时路由](https://www.notion.so/mountainwu/File-Route-Conventions-Runtime-Router-194320d1c0fc80899959de01f087f7e3)
- [Modern.js 约定式路由](https://modernjs.dev/zh/guides/basic-features/routes.html#%E8%B7%AF%E7%94%B1)

## Inspiration & Thanks

- [modern.js](https://github.com/web-infra-dev/modern.js) - 这是一个极重的 Runtime，因为想做的事情太多了。SSR / SSR-Streaming / CSR / SPR / MPR / 约定式路由 / 注册式路由 等等，更关键的是，你不可能去改它。本项目完全是因为改不动 Modern.js 但又觉得其内置的约定式路由设计不错所以开发了这个，🤣
- [Next.js App Router](https://nextjs.org/docs/app) - 如果用 React SSR 这应该是最佳实践
- [Remix-run File System Route Convention](https://remix.run/docs/en/main/start/v2#file-system-route-convention) - Remix-run 版本的约定式路由
- [@TanStack/react-router File-Based Routing](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing) - 在类型声明方面，参考了很多 TanStack 的实现
- [@loadable/component](https://github.com/gregberge/loadable-components) - The recommended Code Splitting library for React ✂️✨，内部懒加载默认使用该组件

## 📄 许可证

MIT

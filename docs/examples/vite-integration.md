# Vite 集成示例

本指南展示如何在 Vite 项目中集成 @feoe/fs-router。

## 安装依赖

```bash
npm install @feoe/fs-router -D
```

## Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { FileBasedRouterVite as fileBasedRouter } from '@feoe/fs-router/vite'

export default defineConfig({
  plugins: [
    react(),
    fileBasedRouter({
      // 路由文件目录
      routesDirectory: 'src/routes',
      // 生成的路由文件路径
      generatedRoutesPath: 'src/routes.tsx',
      // 启用类型生成
      enableGeneration: true,
      typeGenerateOptions: {
        routesTypeFile: 'src/routes-type.ts',
      }
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

## 项目结构

```
my-vite-app/
├── src/
│   ├── routes/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── user/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   ├── main.tsx
│   └── routes.tsx          # 自动生成
├── vite.config.ts
└── package.json
```

## 入口文件

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'
import './index.css'

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
```

## 开发脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

## 完整示例

查看完整的 Vite 集成示例：[GitHub 示例](https://github.com/knfeoe/fs-router/tree/master/examples/vite-keep-alive-tabs)

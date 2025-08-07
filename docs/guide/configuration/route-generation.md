# 路由生成

深入了解 @feoe/fs-router 的路由生成机制和自定义选项。

## 生成机制概述

@feoe/fs-router 通过扫描文件系统结构，自动生成 React Router 兼容的路由配置。生成过程包括：

1. **文件扫描** - 递归扫描路由目录
2. **路径解析** - 将文件路径转换为路由路径
3. **组件导入** - 生成动态导入语句
4. **路由配置** - 构建路由对象
5. **代码生成** - 输出最终的路由文件

## 生成的文件结构

### 基础路由文件

```tsx
// 生成的 src/routes.tsx
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

// 动态导入组件
const RootLayout = lazy(() => import('./routes/layout'))
const HomePage = lazy(() => import('./routes/page'))
const AboutPage = lazy(() => import('./routes/about/page'))
const UserLayout = lazy(() => import('./routes/user/layout'))
const UserPage = lazy(() => import('./routes/user/page'))
const UserDetailPage = lazy(() => import('./routes/user/[id]/page'))

// 路由配置
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'user',
        element: <UserLayout />,
        children: [
          {
            index: true,
            element: <UserPage />
          },
          {
            path: ':id',
            element: <UserDetailPage />
          }
        ]
      }
    ]
  }
]
```

### DataRouter 支持

当启用 DataRouter 支持时，会生成包含 loader 和 action 的路由配置：

```tsx
// 生成的 src/routes.tsx (DataRouter 模式)
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

// 组件导入
const UserDetailPage = lazy(() => import('./routes/user/[id]/page'))

// Loader 导入
import { loader as userDetailLoader } from './routes/user/[id]/page.data'
import { action as userDetailAction } from './routes/user/[id]/page.data'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'user/:id',
        element: <UserDetailPage />,
        loader: userDetailLoader,
        action: userDetailAction
      }
    ]
  }
]
```

## 路径转换规则

### 文件路径到路由路径

| 文件路径 | 生成路由 | 说明 |
|---------|---------|------|
| `page.tsx` | `/` | 根路由 |
| `about/page.tsx` | `/about` | 静态路由 |
| `[id]/page.tsx` | `/:id` | 动态参数 |
| `[[id]]/page.tsx` | `/:id?` | 可选参数 |
| `[...slug]/page.tsx` | `/*` | 捕获所有 |
| `(group)/page.tsx` | `/page` | 路由组（不影响路径） |

### 特殊文件处理

```
src/routes/
├── layout.tsx          → 布局组件，包装子路由
├── layout.data.ts      → 布局组件 loader 用于数据请求
├── page.tsx            → 页面组件，对应路由
├── page.data.ts        → 页面组件 loader 用于数据请求
├── error.tsx           → 错误边界组件
├── loading.tsx         → 加载状态组件，当 loader 执行时起外层 Suspense 的 fallback 组件
└── not-found.tsx       → 404 页面组件
```

## 自定义生成选项

### 基础生成配置

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    FileBasedRouterVite({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx',
      
      typeGenerateOptions: {
        routesTypeFile: 'src/routes-type.ts',
        generateRouteParams: true,
        generateLoaderTypes: true,
        routesDirectories: []
      }
    })
  ]
})
```

### 高级生成配置

```typescript
export default defineConfig({
  plugins: [
    FileBasedRouterVite({
      typeGenerateOptions: {
        // 代码生成选项
        generateOptions: {
          importStyle: 'dynamic',      // 'static' | 'dynamic'
          exportStyle: 'named',        // 'default' | 'named'
          moduleFormat: 'esm',         // 'esm' | 'cjs'
          target: 'es2020'             // 目标 ES 版本
        },
        
        // 路由元数据
        includeMetadata: true,         // 包含路由元数据
        metadataFields: [              // 元数据字段
          'title',
          'description',
          'requiresAuth'
        ],
        
        // 路由排序
        sortRoutes: true,              // 启用路由排序
        sortStrategy: 'alphabetical'   // 'alphabetical' | 'depth' | 'custom'
      }
    })
  ]
})
```

## 自定义路由包装器

### 创建认证路由包装器

```tsx
// src/components/AuthRoute.tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface AuthRouteProps {
  children: React.ReactNode
  requiresAuth?: boolean
  roles?: string[]
}

export default function AuthRoute({ 
  children, 
  requiresAuth = false, 
  roles = [] 
}: AuthRouteProps) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  
  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  if (roles.length > 0 && !roles.some(role => user?.roles?.includes(role))) {
    return <Navigate to="/unauthorized" replace />
  }
  
  return <>{children}</>
}
```

### 配置自定义包装器

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    FileBasedRouterVite({
      typeGenerateOptions: {
        routesTypeFile: 'src/routes-type.ts',
        generateRouteParams: true,
        generateLoaderTypes: true,
        routesDirectories: []
      }
    })
  ]
})
```

生成的路由将使用自定义包装器：

```tsx
// 生成的路由文件
import AuthRoute from '@/components/AuthRoute'

export const routes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <AuthRoute requiresAuth={true} roles={['admin']}>
        <AdminPage />
      </AuthRoute>
    )
  }
]
```

## 元数据生成

### 路由元数据定义

```tsx
// src/routes/user/[id]/page.tsx
export const meta = {
  title: '用户详情',
  description: '查看用户详细信息',
  requiresAuth: true,
  roles: ['user', 'admin']
}

export default function UserDetailPage() {
  return <div>用户详情</div>
}
```

### 生成包含元数据的路由

```tsx
// 生成的路由文件
export const routes: RouteObject[] = [
  {
    path: '/user/:id',
    element: <UserDetailPage />,
    handle: {
      meta: {
        title: '用户详情',
        description: '查看用户详细信息',
        requiresAuth: true,
        roles: ['user', 'admin']
      }
    }
  }
]
```

## 代码分割策略

### 按路由分割

```typescript
// 默认策略：每个页面组件单独分割
const HomePage = lazy(() => import('./routes/page'))
const AboutPage = lazy(() => import('./routes/about/page'))
```

### 按功能模块分割

```typescript
// 配置按模块分割
export default defineConfig({
  plugins: [
    FileBasedRouterVite({
      typeGenerateOptions: {
        routesTypeFile: 'src/routes-type.ts',
        generateRouteParams: true,
        generateLoaderTypes: true,
        routesDirectories: [
          { prefix: 'user', path: 'src/routes/user' },
          { prefix: 'admin', path: 'src/routes/admin' },
          { prefix: 'auth', path: 'src/routes/(auth)' }
        ]
      }
    })
  ]
})
```

生成的代码：

```tsx
// 按模块分割的导入
const UserModule = lazy(() => import('./chunks/user-module'))
const AdminModule = lazy(() => import('./chunks/admin-module'))
```

## 性能优化

### 预加载策略

```typescript
export default defineConfig({
  plugins: [
    FileBasedRouterVite({
      typeGenerateOptions: {
        routesTypeFile: 'src/routes-type.ts',
        generateRouteParams: true,
        generateLoaderTypes: true,
        routesDirectories: []
      }
    })
  ]
})
```

### 生成优化的导入

```tsx
// 优化的导入语句
const HomePage = lazy(() => 
  import(
    /* webpackChunkName: "home" */
    /* webpackPreload: true */
    './routes/page'
  )
)
```

## 调试和开发工具

### 开发模式增强

```typescript
export default defineConfig({
  plugins: [
    FileBasedRouterVite({
      development: {
        generateDebugInfo: true,     // 生成调试信息
        includeSourceMaps: true,     // 包含源码映射
        validateRoutes: true,        // 验证路由配置
        logGeneration: true          // 记录生成过程
      }
    })
  ]
})
```

### 生成的调试信息

```tsx
// 开发模式下生成的调试信息
if (process.env.NODE_ENV === 'development') {
  console.log('路由生成信息:', {
    totalRoutes: 15,
    generatedAt: new Date().toISOString(),
    fileCount: {
      pages: 10,
      layouts: 3,
      errors: 2
    }
  })
}
```

## 自定义生成器

### 创建自定义生成器

```typescript
// src/custom-generator.ts
import type { RouteGenerator } from '@feoe/fs-router'

export class CustomRouteGenerator implements RouteGenerator {
  generate(routes: RouteNode[]): string {
    // 自定义生成逻辑
    return this.generateCustomRoutes(routes)
  }
  
  private generateCustomRoutes(routes: RouteNode[]): string {
    // 实现自定义路由生成
    return `
      // 自定义生成的路由
      export const routes = ${JSON.stringify(routes, null, 2)}
    `
  }
}
```

### 使用自定义生成器

```typescript
// vite.config.ts
import { CustomRouteGenerator } from './src/custom-generator'

export default defineConfig({
  plugins: [
    FileBasedRouterVite({
      customGenerator: new CustomRouteGenerator()
    })
  ]
})
```

## 故障排除

### 常见生成问题

1. **路由未生成**
   - 检查文件命名是否符合约定
   - 确认文件导出是否正确
   - 验证目录结构是否正确

2. **导入路径错误**
   - 检查相对路径计算
   - 确认文件扩展名处理
   - 验证别名配置

3. **类型错误**
   - 确保组件导出类型正确
   - 检查 loader/action 函数签名
   - 验证 TypeScript 配置

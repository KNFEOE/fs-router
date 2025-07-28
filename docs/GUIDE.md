# FileBasedReactRouter 用户指南

## 📋 目录

- [快速开始](#快速开始)
- [安装和配置](#安装和配置)
- [约定式路由](#约定式路由)
- [动态路由](#动态路由)
- [数据加载](#数据加载)
- [类型安全](#类型安全)
- [API 参考](#api-参考)
- [最佳实践](#最佳实践)
- [故障排除](#故障排除)

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install @feoe/fs-router react-router-dom
# 或
yarn add @feoe/fs-router react-router-dom
# 或
pnpm add @feoe/fs-router react-router-dom
```

### 2. 配置构建工具

**Vite 配置**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileBasedRouter } from '@feoe/fs-router/vite'

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

**Webpack 配置**
```javascript
// webpack.config.js
const { fileBasedRouter } = require('@feoe/fs-router/webpack')

module.exports = {
  plugins: [
    fileBasedRouter({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx'
    })
  ]
}
```

### 3. 创建路由文件

```
src/routes/
├── layout.tsx          # 根布局
├── page.tsx            # 首页
├── about/
│   └── page.tsx        # /about 页面
└── user/
    ├── layout.tsx      # 用户页面布局
    ├── page.tsx        # /user 页面
    └── [id]/
        └── page.tsx    # /user/:id 页面
```

### 4. 使用路由

```typescript
// src/main.tsx
import { createBrowserRouter } from 'react-router-dom'
import { routes } from './routes'

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
```

## 📦 安装和配置

### 插件配置选项

```typescript
interface PluginConfig {
  routesDirectory: string;        // 路由目录路径
  generatedRoutesPath: string;    // 生成的路由文件路径
  routeExtensions?: string[];     // 支持的文件扩展名
  enableGeneration?: boolean;     // 是否启用路由生成
  alias?: {                       // 路径别名配置
    name: string;                 // 别名名称
    basename: string;             // 基础路径
  };
  splitting?: boolean;            // 是否启用代码分割
  defaultErrorBoundary?: boolean; // 是否使用默认错误边界
  typeGenerateOptions?: {         // 类型生成选项
    routesDirectories: string[];  // 路由目录列表
    routesTypeFile: string;       // 类型文件路径
  };
}
```

### 默认配置

```typescript
const defaultConfig = {
  routesDirectory: "src/routes",
  generatedRoutesPath: "src/routes.tsx",
  routeExtensions: [".js", ".jsx", ".ts", ".tsx"],
  splitting: true,
  alias: {
    name: "@",
    basename: "src",
  },
  enableGeneration: true,
  defaultErrorBoundary: false,
  typeGenerateOptions: {
    routesDirectories: [],
    routesTypeFile: "src/routes-type.ts",
  },
};
```

## 📁 约定式路由

### 文件命名约定

| 文件名 | 用途 | 路由行为 | 示例 |
|--------|------|----------|------|
| `layout.tsx` | 布局组件 | 嵌套布局 | 所有子路由共享布局 |
| `page.tsx` | 页面组件 | 索引路由 | 当前路径的页面 |
| `$.tsx` | Catch-all 路由 | 匹配所有未匹配路径 | 404 页面 |
| `loading.tsx` | 加载组件 | 路由加载状态 | 加载指示器 |
| `error.tsx` | 错误组件 | 错误边界 | 错误页面 |
| `*.data.ts` | 数据加载器 | 服务端数据加载 | 获取数据 |
| `*.data.client.ts` | 客户端数据加载器 | 客户端数据加载 | 客户端状态 |
| `*.loader.ts` | 加载器 | 路由加载器 | 权限检查 |
| `*.config.ts` | 路由配置 | 路由元数据 | SEO 配置 |

### 目录结构示例

```
src/routes/
├── layout.tsx                    # 根布局
├── page.tsx                      # 首页 (/)
├── about/
│   └── page.tsx                  # /about
├── user/
│   ├── layout.tsx                # 用户页面布局
│   ├── page.tsx                  # /user
│   ├── loading.tsx               # 用户页面加载状态
│   ├── error.tsx                 # 用户页面错误处理
│   ├── [id]/
│   │   ├── page.tsx              # /user/:id
│   │   ├── data.ts               # 用户数据加载
│   │   └── config.ts             # 用户页面配置
│   └── $.tsx                     # /user/* (catch-all)
├── (auth)/                       # 路由分组（不影响 URL）
│   ├── login/
│   │   └── page.tsx              # /login
│   └── register/
│       └── page.tsx              # /register
├── __shared/                     # 无路径布局
│   └── layout.tsx                # 共享布局
└── error.tsx                     # 全局错误页面
```

### 特殊目录处理

#### 路由分组 `(group)`

路由分组不会影响 URL 结构，用于组织相关路由：

```
src/routes/
├── (auth)/
│   ├── login/
│   │   └── page.tsx              # /login
│   └── register/
│       └── page.tsx              # /register
└── (dashboard)/
    ├── profile/
    │   └── page.tsx              # /profile
    └── settings/
        └── page.tsx              # /settings
```

#### 无路径布局 `__dirname`

以双下划线开头的目录不会影响 URL 结构，用于共享布局：

```
src/routes/
├── __auth/
│   └── layout.tsx                # 认证布局
├── login/
│   └── page.tsx                  # /login (使用 __auth/layout.tsx)
└── register/
    └── page.tsx                  # /register (使用 __auth/layout.tsx)
```

## 🔗 动态路由

### 动态参数语法

| 语法 | 类型 | 示例 | 生成的路径 |
|------|------|------|------------|
| `[param]` | 必需参数 | `user/[id]/page.tsx` | `/user/:id` |
| `[[param]]` | 可选参数 | `user/[[id]]/page.tsx` | `/user/:id?` |
| `[param$]` | 可选参数 | `user/[id$]/page.tsx` | `/user/:id?` |
| `$` | Catch-all | `user/$.tsx` | `/user/*` |
| `[[...param]]` | 可选 catch-all | `user/[[...param]]/page.tsx` | `/user/*?` |

### 动态路由示例

#### 必需参数

```typescript
// src/routes/user/[id]/page.tsx
import { useParams } from 'react-router-dom'

export default function UserPage() {
  const { id } = useParams<{ id: string }>()
  
  return (
    <div>
      <h1>用户详情</h1>
      <p>用户 ID: {id}</p>
    </div>
  )
}
```

#### 可选参数

```typescript
// src/routes/user/[[id]]/page.tsx
import { useParams } from 'react-router-dom'

export default function UserPage() {
  const { id } = useParams<{ id?: string }>()
  
  return (
    <div>
      <h1>用户页面</h1>
      {id ? (
        <p>用户 ID: {id}</p>
      ) : (
        <p>用户列表</p>
      )}
    </div>
  )
}
```

#### Catch-all 路由

```typescript
// src/routes/user/$.tsx
import { useParams } from 'react-router-dom'

export default function UserCatchAll() {
  const params = useParams()
  
  return (
    <div>
      <h1>未找到页面</h1>
      <p>路径: {params['*']}</p>
    </div>
  )
}
```

### 嵌套动态路由

```typescript
// src/routes/user/[id]/[type]/page.tsx
import { useParams } from 'react-router-dom'

export default function UserTypePage() {
  const { id, type } = useParams<{ id: string; type: string }>()
  
  return (
    <div>
      <h1>用户 {type}</h1>
      <p>用户 ID: {id}</p>
      <p>类型: {type}</p>
    </div>
  )
}
```

## 📊 数据加载

### 服务端数据加载

```typescript
// src/routes/user/[id]/data.ts
import type { LoaderFunctionArgs } from 'react-router-dom'

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params
  
  // 获取用户数据
  const user = await fetchUser(id)
  
  return { user }
}

// src/routes/user/[id]/page.tsx
import { useLoaderData } from 'react-router-dom'
import type { loader } from './data'

export default function UserPage() {
  const { user } = useLoaderData<typeof loader>()
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### 客户端数据加载

```typescript
// src/routes/user/[id]/data.client.ts
import { useState, useEffect } from 'react'

export function useUserData(id: string) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchUser(id).then(setUser).finally(() => setLoading(false))
  }, [id])
  
  return { user, loading }
}

// src/routes/user/[id]/page.tsx
import { useParams } from 'react-router-dom'
import { useUserData } from './data.client'

export default function UserPage() {
  const { id } = useParams<{ id: string }>()
  const { user, loading } = useUserData(id!)
  
  if (loading) return <div>加载中...</div>
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### 路由配置

```typescript
// src/routes/user/[id]/config.ts
export const config = {
  title: '用户详情',
  meta: {
    description: '用户详细信息页面',
    keywords: ['用户', '详情']
  }
}
```

## 🔒 类型安全

### 路由类型生成

系统会自动生成基于文件系统的路由类型：

```typescript
// 自动生成的 src/routes-type.ts
interface RouteTypes {
  '/': {};
  '/about': {};
  '/user': {};
  '/user/:id': { id: string };
  '/user/:id/:type?': { id: string; type?: string };
  '/user/*': { '*': string };
}
```

### 类型安全导航

```typescript
import { useNavigation } from '@feoe/fs-router'

function MyComponent() {
  const navigation = useNavigation()
  
  // 类型安全的导航
  const handleNavigate = () => {
    // ✅ 正确 - 参数类型匹配
    navigation.push('/user', { id: '123' })
    
    // ❌ 错误 - 缺少必需参数
    // navigation.push('/user')
    
    // ❌ 错误 - 参数类型不匹配
    // navigation.push('/user', { id: 123 })
  }
  
  return <button onClick={handleNavigate}>导航到用户页面</button>
}
```

### 查询参数类型

```typescript
// src/routes/search/page.tsx
export type PageQueryParams = {
  q?: string;
  page: number;
  category: 'all' | 'featured';
}

export default function SearchPage() {
  const navigation = useNavigation()
  
  const handleSearch = () => {
    // 类型安全的查询参数
    navigation.push('/search', undefined, {
      q: 'react',
      page: 1,
      category: 'featured'
    })
  }
  
  return <button onClick={handleSearch}>搜索</button>
}
```

## 📚 API 参考

### useNavigation Hook

```typescript
import { useNavigation } from '@feoe/fs-router'

const navigation = useNavigation()

// 导航方法
navigation.push(path, params?, query?)
navigation.replace(path, params?, query?)
navigation.back()
navigation.forward()
navigation.reload()

// 构建链接
navigation.buildHref(path, params?, query?)
```

### 路由组件

#### Layout 组件

```typescript
// src/routes/layout.tsx
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div>
      <header>
        <nav>
          <a href="/">首页</a>
          <a href="/about">关于</a>
          <a href="/user">用户</a>
        </nav>
      </header>
      
      <main>
        <Outlet />
      </main>
      
      <footer>
        <p>&copy; 2024 My App</p>
      </footer>
    </div>
  )
}
```

#### Page 组件

```typescript
// src/routes/page.tsx
export default function HomePage() {
  return (
    <div>
      <h1>欢迎来到首页</h1>
      <p>这是一个基于文件的路由系统</p>
    </div>
  )
}
```

#### Loading 组件

```typescript
// src/routes/loading.tsx
export default function Loading() {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>加载中...</p>
    </div>
  )
}
```

#### Error 组件

```typescript
// src/routes/error.tsx
import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  
  return (
    <div className="error">
      <h1>出错了！</h1>
      <p>{error.message}</p>
    </div>
  )
}
```

## 🎯 最佳实践

### 1. 文件组织

```
src/routes/
├── layout.tsx                    # 根布局
├── page.tsx                      # 首页
├── (marketing)/                  # 营销页面分组
│   ├── about/
│   │   └── page.tsx
│   └── contact/
│       └── page.tsx
├── (app)/                        # 应用页面分组
│   ├── dashboard/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
└── error.tsx                     # 错误页面
```

### 2. 数据加载模式

```typescript
// 推荐：使用 loader 进行服务端数据加载
// src/routes/user/[id]/data.ts
export async function loader({ params }: LoaderFunctionArgs) {
  const user = await fetchUser(params.id)
  return { user }
}

// 推荐：使用 client data 进行客户端状态管理
// src/routes/user/[id]/data.client.ts
export function useUserPreferences() {
  return useLocalStorage('user-preferences', {})
}
```

### 3. 错误处理

```typescript
// src/routes/error.tsx
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status}</h1>
        <p>{error.statusText}</p>
      </div>
    )
  }
  
  return (
    <div>
      <h1>未知错误</h1>
      <p>{error.message}</p>
    </div>
  )
}
```

### 4. 类型安全

```typescript
// 为每个路由定义类型
// src/routes/user/[id]/types.ts
export interface User {
  id: string
  name: string
  email: string
}

export interface UserLoaderData {
  user: User
}

// 在组件中使用类型
// src/routes/user/[id]/page.tsx
import type { UserLoaderData } from './types'
import { useLoaderData } from 'react-router-dom'

export default function UserPage() {
  const { user } = useLoaderData<UserLoaderData>()
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

## 🔧 故障排除

### 常见问题

#### 1. 路由不生效

**问题**: 路由文件创建后，路由没有生效

**解决方案**:
- 检查文件命名是否正确（如 `page.tsx`）
- 确认构建工具插件已正确配置
- 检查控制台是否有错误信息
- 重启开发服务器

#### 2. 类型错误

**问题**: TypeScript 报类型错误

**解决方案**:
- 确保安装了 `@types/react-router-dom`
- 检查路由类型是否正确生成
- 确认参数类型匹配

#### 3. 热更新不工作

**问题**: 文件修改后路由没有自动更新

**解决方案**:
- 检查文件监听配置
- 确认路由目录路径正确
- 重启开发服务器

#### 4. 代码分割不生效

**问题**: 代码分割没有按预期工作

**解决方案**:
- 确认 `splitting` 配置为 `true`
- 检查 `@loadable/component` 是否正确安装
- 查看构建输出确认分割情况

### 调试技巧

#### 1. 查看生成的路由

```typescript
// 查看生成的路由配置
import { routes } from './routes'
console.log('Generated routes:', routes)
```

#### 2. 启用调试模式

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    fileBasedRouter({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx',
      enableGeneration: true, // 确保启用生成
    })
  ]
})
```

#### 3. 检查文件结构

```bash
# 检查路由目录结构
tree src/routes

# 检查生成的文件
cat src/routes.tsx
```

### 性能优化

#### 1. 代码分割

```typescript
// 确保启用代码分割
fileBasedRouter({
  splitting: true,
  // ...其他配置
})
```

#### 2. 预加载

```typescript
// 在关键路由上添加预加载
import { useNavigation } from '@feoe/fs-router'

function Navigation() {
  const navigation = useNavigation()
  
  const handlePreload = () => {
    // 预加载用户页面
    import('./routes/user/page.tsx')
  }
  
  return (
    <a href="/user" onMouseEnter={handlePreload}>
      用户页面
    </a>
  )
}
```

#### 3. 缓存策略

```typescript
// 使用 React.memo 优化组件
import React from 'react'

const UserPage = React.memo(function UserPage() {
  // 组件逻辑
})

export default UserPage
```

## 📞 获取帮助

如果您在使用过程中遇到问题，可以通过以下方式获取帮助：

1. **查看文档** - 仔细阅读本文档和相关设计文档
2. **检查示例** - 查看 `examples` 目录中的示例项目
3. **运行测试** - 查看 `tests` 目录了解预期行为
4. **提交 Issue** - 在 GitHub 上提交问题报告

## 📄 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。 
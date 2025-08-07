# 类型安全

@feoe/fs-router 提供完整的 TypeScript 支持，确保路由导航的类型安全。

## 自动类型生成

插件会自动分析你的路由结构，生成对应的类型定义：

```typescript
// 自动生成的类型文件 src/routes-type.ts
export interface Routes {
  '/': {}
  '/about': {}
  '/user': {}
  '/user/:id': { id: string }
  '/blog/:category/:slug': { category: string; slug: string }
}
```

## 类型安全的导航

### 使用 Link 组件

```tsx
import { Link } from 'react-router-dom'

// ✅ 类型安全的链接
<Link to="/user/123">用户详情</Link>
<Link to="/blog/tech/react-hooks">博客文章</Link>

// ❌ TypeScript 会报错
<Link to="/invalid-route">无效路由</Link>
```

### 编程式导航

```tsx
import { useNavigate } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()
  
  // ✅ 类型安全的导航
  const goToUser = (id: string) => {
    navigate(`/user/${id}`)
  }
  
  // ✅ 带参数的导航
  const goToBlog = (category: string, slug: string) => {
    navigate(`/blog/${category}/${slug}`)
  }
}
```

## 参数类型推断

### useParams Hook

```tsx
import { useParams } from 'react-router-dom'

// src/routes/user/[id]/page.tsx
export default function UserPage() {
  // TypeScript 自动推断 id 为 string 类型
  const { id } = useParams()
  
  return <div>用户 ID: {id}</div>
}
```

### 自定义参数类型

```tsx
// src/routes/user/[id]/page.tsx
interface UserParams {
  id: string
}

export default function UserPage() {
  const { id } = useParams<UserParams>()
  
  return <div>用户 ID: {id}</div>
}
```

## Loader 数据类型

### 类型安全的数据加载

```tsx
// src/routes/user/[id]/page.tsx
import { useLoaderData } from 'react-router-dom'

interface User {
  id: string
  name: string
  email: string
}

export async function loader({ params }): Promise<{ user: User }> {
  const user = await fetchUser(params.id)
  return { user }
}

export default function UserPage() {
  // TypeScript 自动推断数据类型
  const { user } = useLoaderData<typeof loader>()
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

## 配置类型定义

### 插件配置

```typescript
// vite.config.ts
import { FileBasedRouterVite } from '@feoe/fs-router/vite'

export default defineConfig({
  plugins: [
    FileBasedRouterVite({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx',
      // 启用类型生成
      enableGeneration: true,
      typeGenerateOptions: {
        routesTypeFile: 'src/routes-type.ts',
        // 自定义类型生成选项
        generateRouteParams: true,
        generateLoaderTypes: true,
        routesDirectories: []
      }
    })
  ]
})
```

## 高级类型特性

### 路由守卫类型

```tsx
interface RouteGuard<T = any> {
  canActivate: (params: T) => boolean | Promise<boolean>
}

// src/routes/admin/[id]/page.tsx
export const guard: RouteGuard<{ id: string }> = {
  canActivate: ({ id }) => {
    return checkAdminPermission(id)
  }
}
```

### 元数据类型

```tsx
interface RouteMeta {
  title?: string
  description?: string
  requiresAuth?: boolean
}

// src/routes/user/[id]/page.tsx
export const meta: RouteMeta = {
  title: '用户详情',
  description: '查看用户详细信息',
  requiresAuth: true
}
```

## 类型检查配置

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/routes": ["./src/routes.tsx"],
      "@/routes-type": ["./src/routes-type.ts"]
    }
  },
  "include": [
    "src/**/*",
    "src/routes-type.ts"
  ]
}
```

## 最佳实践

### 1. 启用严格模式

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 2. 使用接口定义

```tsx
// 定义清晰的接口
interface BlogPost {
  id: string
  title: string
  content: string
  author: User
  createdAt: Date
}

export async function loader({ params }) {
  const post: BlogPost = await fetchBlogPost(params.slug)
  return { post }
}
```

### 3. 错误类型处理

```tsx
import { isRouteErrorResponse } from 'react-router-dom'

export default function ErrorBoundary() {
  const error = useRouteError()
  
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status} {error.statusText}</h1>
        <p>{error.data}</p>
      </div>
    )
  }
  
  return <div>未知错误</div>
}
```
# 最佳实践

本页面介绍使用 @feoe/fs-router 的最佳实践和推荐模式。

## 项目结构

### 推荐的目录结构

```
src/
├── components/         # 可复用组件
│   ├── ui/            # 基础 UI 组件
│   ├── layout/        # 布局相关组件
│   └── business/      # 业务组件
├── routes/            # 路由文件
│   ├── layout.tsx     # 根布局
│   ├── page.tsx       # 首页
│   ├── (auth)/        # 认证相关路由组
│   │   ├── login/
│   │   └── register/
│   └── (dashboard)/   # 仪表板路由组
│       ├── layout.tsx
│       ├── analytics/
│       └── settings/
├── services/          # API 服务
├── hooks/             # 自定义 Hooks
├── utils/             # 工具函数
└── types/             # 类型定义
```

### 路由组织原则

1. **按功能模块分组** - 使用路由组 `()` 组织相关功能
2. **合理使用布局** - 为相关页面创建共享布局
3. **分离关注点** - 将业务逻辑、数据获取和 UI 分离

## 命名约定

### 文件命名

```
✅ 推荐
page.tsx           # 页面组件
layout.tsx         # 布局组件
error.tsx          # 错误边界
loading.tsx        # 加载状态
not-found.tsx      # 404 页面

❌ 避免
index.tsx          # 容易混淆
HomePage.tsx       # 不符合约定
user-page.tsx      # 不符合约定
```

### 组件命名

```tsx
// ✅ 推荐 - 使用 PascalCase
export default function UserProfilePage() {
  return <div>用户资料</div>
}

// ✅ 推荐 - 描述性命名
export default function UserLayout() {
  return <div>用户布局</div>
}

// ❌ 避免 - 过于简单
export default function Page() {
  return <div>页面</div>
}
```

### 路由参数命名

```
✅ 推荐
[id]/page.tsx          # 简洁明了
[userId]/page.tsx      # 具有描述性
[slug]/page.tsx        # 语义清晰

❌ 避免
[param]/page.tsx       # 过于通用
[data]/page.tsx        # 不够具体
```

## 性能优化

### 代码分割

```tsx
// 使用 React.lazy 进行组件懒加载
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))

export default function MyPage() {
  return (
    <div>
      <Suspense fallback={<div>加载中...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  )
}
```

### 数据预加载

```tsx
// 使用 loader 预加载关键数据
export async function loader({ params }) {
  // 并行加载多个数据源
  const [user, posts] = await Promise.all([
    fetchUser(params.id),
    fetchUserPosts(params.id)
  ])
  
  return { user, posts }
}
```

### 缓存策略

```tsx
// 实现简单的内存缓存
const cache = new Map()

export async function loader({ params }) {
  const cacheKey = `user-${params.id}`
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }
  
  const user = await fetchUser(params.id)
  cache.set(cacheKey, { user })
  
  return { user }
}
```

## 错误处理

### 分层错误处理

```
src/routes/
├── error.tsx           # 全局错误处理
├── user/
│   ├── error.tsx       # 用户模块错误处理
│   └── [id]/
│       ├── error.tsx   # 用户详情错误处理
│       └── page.tsx
```

### 错误边界实现

```tsx
// src/routes/error.tsx
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

export default function ErrorBoundary() {
  const error = useRouteError()
  
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="error-page">
          <h1>页面未找到</h1>
          <p>抱歉，您访问的页面不存在。</p>
        </div>
      )
    }
    
    if (error.status === 401) {
      return (
        <div className="error-page">
          <h1>未授权访问</h1>
          <p>请先登录后再访问此页面。</p>
        </div>
      )
    }
  }
  
  return (
    <div className="error-page">
      <h1>出现错误</h1>
      <p>抱歉，发生了意外错误。</p>
      <details>
        <summary>错误详情</summary>
        <pre>{error?.message}</pre>
      </details>
    </div>
  )
}
```

### 数据加载错误处理

```tsx
export async function loader({ params }) {
  try {
    const user = await fetchUser(params.id)
    
    if (!user) {
      throw new Response('用户不存在', { status: 404 })
    }
    
    return { user }
  } catch (error) {
    if (error instanceof Response) {
      throw error
    }
    
    // 记录错误日志
    console.error('加载用户数据失败:', error)
    
    throw new Response('服务器错误', { status: 500 })
  }
}
```

## 类型安全

### 严格的 TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 路由参数类型定义

```tsx
// 定义参数接口
interface UserParams {
  id: string
}

interface BlogParams {
  category: string
  slug: string
}

// 在组件中使用
export default function UserPage() {
  const { id } = useParams<UserParams>()
  // TypeScript 会确保 id 是 string 类型
}
```

## 测试策略

### 单元测试

```tsx
// UserPage.test.tsx
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import UserPage from './page'

test('渲染用户页面', () => {
  const router = createMemoryRouter([
    {
      path: '/user/:id',
      element: <UserPage />,
      loader: () => ({ user: { id: '1', name: '测试用户' } })
    }
  ], {
    initialEntries: ['/user/1']
  })
  
  render(<RouterProvider router={router} />)
  
  expect(screen.getByText('测试用户')).toBeInTheDocument()
})
```

### 集成测试

```tsx
// 测试路由导航
test('用户导航流程', async () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ['/']
  })
  
  render(<RouterProvider router={router} />)
  
  // 点击用户链接
  fireEvent.click(screen.getByText('用户'))
  
  // 验证导航到用户页面
  await waitFor(() => {
    expect(screen.getByText('用户列表')).toBeInTheDocument()
  })
})
```

## 安全考虑

### 路由权限控制

```tsx
// 创建权限检查 Hook
function useAuth() {
  const user = useUser()
  return {
    isAuthenticated: !!user,
    hasRole: (role: string) => user?.roles?.includes(role)
  }
}

// 在 loader 中检查权限
export async function loader({ request }) {
  const user = await getUser(request)
  
  if (!user) {
    throw redirect('/login')
  }
  
  if (!user.roles.includes('admin')) {
    throw new Response('权限不足', { status: 403 })
  }
  
  return { user }
}
```

### 输入验证

```tsx
// 验证路由参数
export async function loader({ params }) {
  const { id } = params
  
  // 验证 ID 格式
  if (!/^\d+$/.test(id)) {
    throw new Response('无效的用户 ID', { status: 400 })
  }
  
  const user = await fetchUser(id)
  return { user }
}
```

## 开发工具

### 调试技巧

```tsx
// 开发环境下显示路由信息
if (process.env.NODE_ENV === 'development') {
  console.log('当前路由:', location.pathname)
  console.log('路由参数:', params)
  console.log('加载数据:', loaderData)
}
```

### 性能监控

```tsx
// 监控页面加载时间
export async function loader({ params }) {
  const start = performance.now()
  
  const data = await fetchData(params.id)
  
  const end = performance.now()
  console.log(`数据加载耗时: ${end - start}ms`)
  
  return data
}
```

## 总结

遵循这些最佳实践可以帮助你：

1. **提高代码质量** - 通过一致的命名和结构约定
2. **增强性能** - 通过合理的代码分割和缓存策略
3. **改善用户体验** - 通过完善的错误处理和加载状态
4. **确保类型安全** - 通过严格的 TypeScript 配置
5. **提升可维护性** - 通过清晰的项目结构和测试策略
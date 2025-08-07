# 进阶功能

本页面介绍 @feoe/fs-router 的进阶功能和高级用法。

## 路由守卫

路由守卫允许你在用户访问特定路由前进行权限检查和验证。

### 使用 Loader 实现路由守卫

```tsx
// src/routes/admin/page.tsx
import { redirect } from 'react-router-dom'

export async function loader({ request }) {
  const user = await getCurrentUser(request)
  
  // 检查用户是否已登录
  if (!user) {
    throw redirect('/login')
  }
  
  // 检查用户权限
  if (!user.roles.includes('admin')) {
    throw new Response('权限不足', { status: 403 })
  }
  
  return { user }
}

export default function AdminPage() {
  const { user } = useLoaderData()
  
  return (
    <div>
      <h1>管理后台</h1>
      <p>欢迎，{user.name}</p>
    </div>
  )
}
```

### 创建可复用的权限检查函数

```tsx
// src/utils/auth.ts
export async function requireAuth(request: Request) {
  const user = await getCurrentUser(request)
  
  if (!user) {
    throw redirect('/login')
  }
  
  return user
}

export async function requireRole(request: Request, role: string) {
  const user = await requireAuth(request)
  
  if (!user.roles.includes(role)) {
    throw new Response('权限不足', { status: 403 })
  }
  
  return user
}

// 在路由中使用
export async function loader({ request }) {
  const user = await requireRole(request, 'admin')
  return { user }
}
```

## 路由中间件

通过 Action 和 Loader 实现类似中间件的功能。

### 请求拦截

```tsx
// src/utils/middleware.ts
export async function withAuth(handler: Function) {
  return async (args: any) => {
    const user = await getCurrentUser(args.request)
    
    if (!user) {
      throw redirect('/login')
    }
    
    return handler({ ...args, user })
  }
}

// 使用中间件
export const loader = withAuth(async ({ params, user }) => {
  const data = await fetchUserData(params.id, user)
  return { data }
})
```

### 日志记录中间件

```tsx
export function withLogging(handler: Function, name: string) {
  return async (args: any) => {
    console.log(`[${name}] 开始执行`, args.params)
    const start = performance.now()
    
    try {
      const result = await handler(args)
      const end = performance.now()
      console.log(`[${name}] 执行成功，耗时: ${end - start}ms`)
      return result
    } catch (error) {
      console.error(`[${name}] 执行失败:`, error)
      throw error
    }
  }
}
```

## 嵌套路由

深入了解嵌套路由的高级用法。

### 复杂嵌套结构

```
src/routes/
├── layout.tsx                    # 根布局
├── (app)/                        # 应用路由组
│   ├── layout.tsx               # 应用布局
│   ├── dashboard/
│   │   ├── layout.tsx           # 仪表板布局
│   │   ├── page.tsx             # /dashboard
│   │   ├── analytics/
│   │   │   └── page.tsx         # /dashboard/analytics
│   │   └── settings/
│   │       ├── layout.tsx       # 设置布局
│   │       ├── page.tsx         # /dashboard/settings
│   │       ├── profile/
│   │       │   └── page.tsx     # /dashboard/settings/profile
│   │       └── security/
│   │           └── page.tsx     # /dashboard/settings/security
│   └── user/
│       ├── layout.tsx           # 用户布局
│       ├── page.tsx             # /user
│       └── [id]/
│           ├── layout.tsx       # 用户详情布局
│           ├── page.tsx         # /user/:id
│           ├── posts/
│           │   └── page.tsx     # /user/:id/posts
│           └── settings/
│               └── page.tsx     # /user/:id/settings
```

### 布局数据共享

```tsx
// src/routes/(app)/layout.tsx
export async function loader({ request }) {
  const user = await getCurrentUser(request)
  const notifications = await getNotifications(user.id)
  
  return { user, notifications }
}

export default function AppLayout() {
  const { user, notifications } = useLoaderData()
  
  return (
    <div className="app-layout">
      <Header user={user} notifications={notifications} />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

## 路由懒加载

实现高效的代码分割和懒加载。

### 组件级懒加载

```tsx
// src/routes/heavy-page/page.tsx
import { lazy, Suspense } from 'react'

const HeavyChart = lazy(() => import('@/components/HeavyChart'))
const DataTable = lazy(() => import('@/components/DataTable'))

export default function HeavyPage() {
  return (
    <div>
      <h1>数据分析</h1>
      
      <Suspense fallback={<div>加载图表中...</div>}>
        <HeavyChart />
      </Suspense>
      
      <Suspense fallback={<div>加载表格中...</div>}>
        <DataTable />
      </Suspense>
    </div>
  )
}
```

### 路由级懒加载

```tsx
// src/routes/dashboard/page.tsx
import { lazy } from 'react'

// 动态导入子组件
const loadAnalytics = () => import('./analytics/page')
const loadReports = () => import('./reports/page')

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  
  return (
    <div>
      <nav>
        <button onClick={() => setActiveTab('overview')}>概览</button>
        <button onClick={() => setActiveTab('analytics')}>分析</button>
        <button onClick={() => setActiveTab('reports')}>报告</button>
      </nav>
      
      {activeTab === 'analytics' && (
        <Suspense fallback={<div>加载分析页面...</div>}>
          <AsyncComponent loader={loadAnalytics} />
        </Suspense>
      )}
      
      {activeTab === 'reports' && (
        <Suspense fallback={<div>加载报告页面...</div>}>
          <AsyncComponent loader={loadReports} />
        </Suspense>
      )}
    </div>
  )
}
```

## 数据预取

优化用户体验的数据预取策略。

### 鼠标悬停预取

```tsx
import { useFetcher } from 'react-router-dom'

export default function UserCard({ userId }) {
  const fetcher = useFetcher()
  
  const handleMouseEnter = () => {
    if (fetcher.state === 'idle' && !fetcher.data) {
      fetcher.load(`/api/user/${userId}`)
    }
  }
  
  return (
    <Link 
      to={`/user/${userId}`}
      onMouseEnter={handleMouseEnter}
    >
      <div>用户卡片</div>
    </Link>
  )
}
```

### 视口预取

```tsx
import { useEffect, useRef } from 'react'
import { useFetcher } from 'react-router-dom'

export default function LazyLoadCard({ userId }) {
  const ref = useRef()
  const fetcher = useFetcher()
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && fetcher.state === 'idle') {
          fetcher.load(`/api/user/${userId}`)
        }
      },
      { threshold: 0.1 }
    )
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [userId, fetcher])
  
  return (
    <div ref={ref}>
      {fetcher.data ? (
        <UserDetails user={fetcher.data} />
      ) : (
        <div>加载中...</div>
      )}
    </div>
  )
}
```

## 状态管理集成

与状态管理库的集成模式。

### 与 Zustand 集成

```tsx
// src/stores/userStore.ts
import { create } from 'zustand'

interface UserStore {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
}))

// 在路由中使用
export async function loader({ request }) {
  const user = await getCurrentUser(request)
  
  // 更新全局状态
  useUserStore.getState().setUser(user)
  
  return { user }
}
```

## 错误恢复

高级错误处理和恢复策略。

### 错误重试机制

```tsx
export default function ErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()
  const [retryCount, setRetryCount] = useState(0)
  
  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1)
      navigate(0) // 重新加载当前路由
    }
  }
  
  return (
    <div className="error-page">
      <h1>出现错误</h1>
      <p>{error.message}</p>
      
      {retryCount < 3 && (
        <button onClick={handleRetry}>
          重试 ({retryCount}/3)
        </button>
      )}
    </div>
  )
}
```

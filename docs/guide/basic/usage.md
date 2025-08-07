# 基础使用

本指南将带你了解 @feoe/fs-router 的基础使用方法。

## 目录结构约定

@feoe/fs-router 使用文件系统作为路由的基础，遵循以下约定：

```
src/routes/
├── layout.tsx          # 根布局组件
├── page.tsx            # 首页 (/)
├── about/
│   └── page.tsx        # /about 页面
├── user/
│   ├── layout.tsx      # 用户页面布局
│   ├── page.tsx        # /user 页面
│   └── [id]/
│       └── page.tsx    # /user/:id 页面
└── error.tsx           # 错误页面
```

## 页面组件

### 基础页面

每个 `page.tsx` 文件代表一个路由页面：

```tsx
// src/routes/page.tsx
export default function HomePage() {
  return (
    <div>
      <h1>欢迎使用 fs-router</h1>
      <p>这是首页</p>
    </div>
  )
}
```

### 嵌套页面

通过文件夹嵌套创建嵌套路由：

```tsx
// src/routes/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>关于我们</h1>
      <p>这是关于页面</p>
    </div>
  )
}
```

## 布局组件

### 根布局

`layout.tsx` 文件定义页面布局：

```tsx
// src/routes/layout.tsx
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div className="app">
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

### 嵌套布局

可以为特定路由段创建专门的布局：

```tsx
// src/routes/user/layout.tsx
import { Outlet } from 'react-router-dom'

export default function UserLayout() {
  return (
    <div className="user-layout">
      <aside>
        <nav>
          <a href="/user">用户首页</a>
          <a href="/user/profile">个人资料</a>
          <a href="/user/settings">设置</a>
        </nav>
      </aside>
      <div className="user-content">
        <Outlet />
      </div>
    </div>
  )
}
```

## 动态路由

使用方括号 `[]` 创建动态路由：

```tsx
// src/routes/user/[id]/page.tsx
import { useParams } from 'react-router-dom'

export default function UserDetailPage() {
  const { id } = useParams()
  
  return (
    <div>
      <h1>用户详情</h1>
      <p>用户 ID: {id}</p>
    </div>
  )
}
```

## 错误处理

创建 `error.tsx` 文件处理错误：

```tsx
// src/routes/error.tsx
import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  
  return (
    <div className="error-page">
      <h1>出错了！</h1>
      <p>抱歉，发生了意外错误。</p>
      <p>
        <i>{error?.statusText || error?.message}</i>
      </p>
    </div>
  )
}
```

## 导航

### Link 组件

```tsx
import { Link } from 'react-router-dom'

export default function Navigation() {
  return (
    <nav>
      <Link to="/">首页</Link>
      <Link to="/about">关于</Link>
      <Link to="/user/123">用户详情</Link>
    </nav>
  )
}
```

### 编程式导航

```tsx
import { useNavigate } from 'react-router-dom'

export default function MyComponent() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate('/about')
  }
  
  return (
    <button onClick={handleClick}>
      前往关于页面
    </button>
  )
}
```

## 数据加载

在 React-Router 的设计中 Loader **仅支持 DataRouter 数据路由**。

### 定义 loader

```tsx {4}
// src/routes/user/[id]/page.data.ts
import { fetchUser } from '@/services/user.service.ts'

export async function loader({ params }) {
  const user = await fetchUser(params.id)
  return { user }
}
```

### 使用 loader

```tsx {6}
// src/routes/user/[id]/page.tsx
import { useLoaderData } from 'react-router-dom'
import { loader } from './page.data'

export default function UserDetailPage() {
  const { user } = useLoaderData<typeof loader>()
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

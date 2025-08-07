# 约定式路由

@feoe/fs-router 采用基于文件系统的约定式路由，通过文件和文件夹的组织结构自动生成路由配置。

## 基本概念

约定式路由是一种通过文件系统结构来定义路由的方式，无需手动配置路由表。每个文件和文件夹都有特定的含义和作用。

## 文件命名约定

### 页面文件 (page.tsx)

`page.tsx` 文件定义路由的页面组件：

```
src/routes/page.tsx                 → /
src/routes/about/page.tsx           → /about
src/routes/user/profile/page.tsx    → /user/profile
```

### 布局文件 (layout.tsx)

`layout.tsx` 文件定义路由段的布局组件：

```
src/routes/layout.tsx               → 根布局
src/routes/user/layout.tsx          → /user/* 的布局
src/routes/admin/layout.tsx         → /admin/* 的布局
```

### 错误文件 (error.tsx)

`error.tsx` 文件定义错误边界组件：

```
src/routes/error.tsx                → 根错误边界
src/routes/user/error.tsx           → /user/* 的错误边界
```

### 加载文件 (loading.tsx)

`loading.tsx` 文件定义加载状态组件：

```
src/routes/loading.tsx              → 根加载状态
src/routes/user/loading.tsx         → /user/* 的加载状态
```

## 目录结构规范

### 基础结构

```
src/routes/
├── layout.tsx          # 根布局
├── layout.data.ts      # 根布局数据请求，仅支持 DataRouter
├── page.tsx            # 首页 (/)
├── page.data.ts        # 首页数据请求，仅支持 DataRouter
├── loading.tsx         # 根加载状态
├── error.tsx           # 根错误边界
└── not-found.tsx       # 404 页面
```

### 嵌套路由

```
src/routes/
├── layout.tsx
├── page.tsx            # /
├── about/
│   └── page.tsx        # /about
├── blog/
│   ├── layout.tsx      # /blog/* 布局
│   ├── page.tsx        # /blog
│   ├── [slug]/
│   │   └── page.tsx    # /blog/:slug
│   └── category/
│       ├── page.tsx    # /blog/category
│       └── [name]/
│           └── page.tsx # /blog/category/:name
└── user/
    ├── layout.tsx      # /user/* 布局
    ├── page.tsx        # /user
    ├── profile/
    │   └── page.tsx    # /user/profile
    └── settings/
        └── page.tsx    # /user/settings
```

## 动态路由

### 单个参数

使用方括号 `[]` 创建动态路由段：

```
src/routes/user/[id]/page.tsx       → /user/:id
src/routes/post/[slug]/page.tsx     → /post/:slug
```

### 多个参数

```
src/routes/blog/[category]/[slug]/page.tsx  → /blog/:category/:slug
src/routes/user/[id]/post/[postId]/page.tsx → /user/:id/post/:postId
```

### 可选参数

使用双方括号 `[[]]` 创建可选参数：

```
src/routes/shop/[[category]]/page.tsx       → /shop 和 /shop/:category
src/routes/docs/[[...slug]]/page.tsx        → /docs 和 /docs/*
```

### 捕获所有路由

使用三个点 `...` 捕获所有剩余路径：

```
src/routes/docs/[...slug]/page.tsx          → /docs/*
src/routes/api/[...path]/page.tsx           → /api/*
```

## 路由生成规则

### 路径映射

| 文件路径 | 生成路由 | 说明 |
|---------|---------|------|
| `page.tsx` | `/` | 根路由 |
| `about/page.tsx` | `/about` | 静态路由 |
| `[id]/page.tsx` | `/:id` | 动态参数 |
| `[[id]]/page.tsx` | `/` 和 `/:id` | 可选参数 |
| `[...slug]/page.tsx` | `/*` | 捕获所有 |

### 布局嵌套

布局文件会自动包装其子路由：

```
src/routes/
├── layout.tsx          # 包装所有路由
├── page.tsx            # /
└── user/
    ├── layout.tsx      # 包装 /user/* 路由
    ├── page.tsx        # /user
    └── profile/
        └── page.tsx    # /user/profile
```

生成的路由结构：

```tsx
{
  path: '/',
  element: <RootLayout />,
  children: [
    {
      index: true,
      element: <HomePage />
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
          path: 'profile',
          element: <UserProfilePage />
        }
      ]
    }
  ]
}
```

## 特殊文件

### 根文件

- `layout.tsx` - 应用根布局
- `layout.data.ts` - 应用根布局数据请求，仅支持 DataRouter
- `page.tsx` - 首页 (/)
- `page.data.ts` - 首页数据请求，仅支持 DataRouter
- `error.tsx` - 全局错误边界
- `loading.tsx` - 全局加载状态
- `not-found.tsx` - 404 页面

### 路由组

使用括号 `()` 创建路由组，不影响 URL 结构：

```
src/routes/
├── (auth)/
│   ├── login/
│   │   └── page.tsx    # /login
│   └── register/
│       └── page.tsx    # /register
└── (dashboard)/
    ├── layout.tsx      # 仅包装 dashboard 相关路由
    ├── analytics/
    │   └── page.tsx    # /analytics
    └── settings/
        └── page.tsx    # /settings
```

## 文件导出约定

### 默认导出

页面和布局组件必须使用默认导出：

```tsx
// ✅ 正确
export default function HomePage() {
  return <div>首页</div>
}

// ❌ 错误
export function HomePage() {
  return <div>首页</div>
}
```

### 数据加载

可以导出 `loader` 函数进行数据预加载：

```tsx
// src/routes/user/[id]/page.tsx
export async function loader({ params }) {
  const user = await fetchUser(params.id)
  return { user }
}

export default function UserPage() {
  const { user } = useLoaderData()
  return <div>{user.name}</div>
}
```

### 操作处理

可以导出 `action` 函数处理表单提交：

```tsx
// src/routes/contact/page.tsx
export async function action({ request }) {
  const formData = await request.formData()
  await sendEmail(formData)

  return redirect('/thank-you')
}

export default function ContactPage() {
  return (
    <Form method="post">
      {/* 表单内容 */}
    </Form>
  )
}
```

## 最佳实践

### 1. 保持结构清晰

```
✅ 推荐
src/routes/
├── layout.tsx
├── page.tsx
├── about/
│   └── page.tsx
└── user/
    ├── layout.tsx
    ├── page.tsx
    └── [id]/
        └── page.tsx

❌ 不推荐
src/routes/
├── index.tsx
├── about.tsx
└── user-detail.tsx
```

### 2. 合理使用布局

为相关页面创建共享布局：

```tsx
// src/routes/admin/layout.tsx
export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

### 3. 错误边界分层

在不同层级设置错误边界：

```
src/routes/
├── error.tsx           # 全局错误
├── user/
│   ├── error.tsx       # 用户模块错误
│   └── [id]/
│       └── page.tsx
```

### 4. 组件复用

将可复用组件放在 `src/components` 文件夹：

```
src/
├── components/         # 组件文件
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
├── routes/             # 路由文件
│   ├── layout.tsx
│   └── page.tsx
```

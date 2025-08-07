# 动态路由

动态路由允许你创建可以匹配多个 URL 路径的路由，通过参数来处理不同的内容。

## 基础动态路由

使用方括号 `[]` 创建动态路由段：

```
src/routes/user/[id]/page.tsx       → /user/123, /user/456
src/routes/post/[slug]/page.tsx     → /post/hello-world, /post/my-story
```

### 获取路由参数

```tsx
// src/routes/user/[id]/page.tsx
import { useParams } from 'react-router-dom'

export default function UserPage() {
  const { id } = useParams()
  
  return (
    <div>
      <h1>用户详情</h1>
      <p>用户 ID: {id}</p>
    </div>
  )
}
```

## 多层动态路由

```
src/routes/blog/[category]/[slug]/page.tsx  → /blog/tech/react-hooks
```

```tsx
// src/routes/blog/[category]/[slug]/page.tsx
import { useParams } from 'react-router-dom'

export default function BlogPostPage() {
  const { category, slug } = useParams()
  
  return (
    <div>
      <h1>博客文章</h1>
      <p>分类: {category}</p>
      <p>文章: {slug}</p>
    </div>
  )
}
```

## 可选参数

使用双方括号 `[[]]` 创建可选参数：

```
src/routes/shop/[[category]]/page.tsx       → /shop 和 /shop/electronics
```

```tsx
// src/routes/shop/[[category]]/page.tsx
import { useParams } from 'react-router-dom'

export default function ShopPage() {
  const { category } = useParams()
  
  return (
    <div>
      <h1>商店</h1>
      {category ? (
        <p>分类: {category}</p>
      ) : (
        <p>所有商品</p>
      )}
    </div>
  )
}
```

## 捕获所有路由

使用 `[...param]` 捕获所有剩余路径：

```
src/routes/docs/[...slug]/page.tsx          → /docs/guide/getting-started
```

```tsx
// src/routes/docs/[...slug]/page.tsx
import { useParams } from 'react-router-dom'

export default function DocsPage() {
  const { slug } = useParams()
  const path = Array.isArray(slug) ? slug.join('/') : slug
  
  return (
    <div>
      <h1>文档</h1>
      <p>路径: {path}</p>
    </div>
  )
}
```

## 数据加载

### 使用 loader 预加载数据

```tsx
// src/routes/user/[id]/page.tsx
import { useLoaderData } from 'react-router-dom'

export async function loader({ params }) {
  const user = await fetchUser(params.id)
  if (!user) {
    throw new Response('User not found', { status: 404 })
  }
  return { user }
}

export default function UserPage() {
  const { user } = useLoaderData()
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

## 类型安全

配合 TypeScript 使用类型安全的参数：

```tsx
// src/routes/user/[id]/page.tsx
import { useParams } from 'react-router-dom'

interface UserParams {
  id: string
}

export default function UserPage() {
  const { id } = useParams<UserParams>()
  
  return (
    <div>
      <h1>用户 {id}</h1>
    </div>
  )
}
```

## 最佳实践

### 1. Loader 参数验证

```tsx
export async function loader({ params }) {
  const { id } = params
  
  // 验证参数格式
  if (!/^\d+$/.test(id)) {
    throw new Response('Invalid user ID', { status: 400 })
  }
  
  const user = await fetchUser(id)
  return { user }
}
```

### 2. Error 错误处理

```tsx
// src/routes/user/[id]/error.tsx
import { useRouteError } from 'react-router-dom'

export default function UserError() {
  const error = useRouteError()
  
  if (error.status === 404) {
    return <div>用户不存在</div>
  }
  
  return <div>加载用户信息时出错</div>
}
```

### 3. Loading 加载状态

```tsx
// src/routes/user/[id]/loading.tsx
export default function UserLoading() {
  return (
    <div>
      <div className="skeleton">加载中...</div>
    </div>
  )
}
```
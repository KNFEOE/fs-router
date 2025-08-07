# TypeScript 配置

了解如何配置 @feoe/fs-router 的 TypeScript 支持，获得完整的类型安全体验。

## 基础 TypeScript 配置

### tsconfig.json 配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    // 路径映射
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/routes": ["./src/routes.tsx"],
      "@/routes-type": ["./src/routes-type.ts"]
    }
  },
  "include": [
    "src/**/*",
    "src/routes.tsx",
    "src/routes-type.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### 插件 TypeScript 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { FileBasedRouterVite } from '@feoe/fs-router/vite'

export default defineConfig({
  plugins: [
    FileBasedRouterVite({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx',
      enableGeneration: true,
      
      // TypeScript 配置
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

## 类型生成选项

### 基础类型生成

```typescript
interface TypeGenerateOptions {
  /** 类型文件输出路径 */
  routesTypeFile: string
  /** 是否生成路由参数类型 */
  generateRouteParams?: boolean
  /** 是否生成 Loader 类型 */
  generateLoaderTypes?: boolean
  /** 路由目录配置 */
  routesDirectories?: RouteDirectory[]
}

interface RouteDirectory {
  /** 路由前缀 */
  prefix?: string
  /** 路由目录路径 */
  path: string
}
```

### 生成的类型文件示例

```typescript
// 生成的 src/routes-type.ts
export interface RouteParams {
  '/': {}
  '/about': {}
  '/user': {}
  '/user/:id': { id: string }
  '/blog/:category/:slug': { 
    category: string
    slug: string 
  }
  '/docs/*': { '*': string }
}

export interface LoaderData {
  '/user/:id': {
    user: User
    posts: Post[]
  }
  '/blog/:category/:slug': {
    post: BlogPost
    related: BlogPost[]
  }
}

export interface ActionData {
  '/user/:id': {
    success: boolean
    message: string
  }
}

export interface RouteMeta {
  '/admin/*': {
    requiresAuth: true
    roles: string[]
  }
}
```

## 路由参数类型

### 自动类型推断

```tsx
// src/routes/user/[id]/page.tsx
import { useParams } from 'react-router-dom'

export default function UserPage() {
  // TypeScript 自动推断 id 为 string 类型
  const { id } = useParams()
  
  return <div>用户 ID: {id}</div>
}
```

### 手动类型定义

```tsx
// src/routes/blog/[category]/[slug]/page.tsx
import { useParams } from 'react-router-dom'

// 定义参数接口
interface BlogParams {
  category: string
  slug: string
}

export default function BlogPostPage() {
  const { category, slug } = useParams<BlogParams>()
  
  return (
    <div>
      <h1>分类: {category}</h1>
      <h2>文章: {slug}</h2>
    </div>
  )
}
```

### 复杂参数类型

```tsx
// src/routes/search/[[...filters]]/page.tsx
import { useParams } from 'react-router-dom'

interface SearchParams {
  filters?: string[]
}

export default function SearchPage() {
  const params = useParams<SearchParams>()
  const filters = params.filters || []
  
  return (
    <div>
      <h1>搜索结果</h1>
      <p>过滤器: {filters.join(', ')}</p>
    </div>
  )
}
```

## Loader 类型安全

### 基础 Loader 类型

```tsx
// src/routes/user/[id]/page.tsx
import { useLoaderData } from 'react-router-dom'

// 定义数据接口
interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface UserLoaderData {
  user: User
  posts: Post[]
}

// Loader 函数
export async function loader({ params }): Promise<UserLoaderData> {
  const [user, posts] = await Promise.all([
    fetchUser(params.id),
    fetchUserPosts(params.id)
  ])
  
  return { user, posts }
}

// 组件中使用
export default function UserPage() {
  // TypeScript 自动推断数据类型
  const { user, posts } = useLoaderData<typeof loader>()
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <div>文章数量: {posts.length}</div>
    </div>
  )
}
```

### 泛型 Loader

```tsx
// src/utils/loaders.ts
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export async function createPaginatedLoader<T>(
  fetcher: (page: number, pageSize: number) => Promise<PaginatedResponse<T>>
) {
  return async ({ request }): Promise<PaginatedResponse<T>> => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    
    return fetcher(page, pageSize)
  }
}

// 使用泛型 Loader
export const loader = createPaginatedLoader<User>(fetchUsers)
```

## Action 类型安全

### 基础 Action 类型

```tsx
// src/routes/user/[id]/edit/page.tsx
import { redirect } from 'react-router-dom'

interface UpdateUserData {
  name: string
  email: string
  avatar?: string
}

interface ActionResult {
  success: boolean
  message: string
  errors?: Record<string, string>
}

export async function action({ request, params }): Promise<ActionResult | Response> {
  const formData = await request.formData()
  
  const userData: UpdateUserData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    avatar: formData.get('avatar') as string || undefined
  }
  
  try {
    await updateUser(params.id, userData)
    return redirect(`/user/${params.id}`)
  } catch (error) {
    return {
      success: false,
      message: '更新失败',
      errors: { general: error.message }
    }
  }
}

export default function EditUserPage() {
  const actionData = useActionData<typeof action>()
  
  return (
    <form method="post">
      {actionData && !actionData.success && (
        <div className="error">{actionData.message}</div>
      )}
      {/* 表单字段 */}
    </form>
  )
}
```

### 表单验证类型

```tsx
// src/utils/validation.ts
export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: Partial<Record<keyof T, string>>
}

export function validateUserForm(formData: FormData): ValidationResult<UpdateUserData> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  
  const errors: Partial<Record<keyof UpdateUserData, string>> = {}
  
  if (!name || name.length < 2) {
    errors.name = '姓名至少需要2个字符'
  }
  
  if (!email || !email.includes('@')) {
    errors.email = '请输入有效的邮箱地址'
  }
  
  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }
  
  return {
    success: true,
    data: { name, email }
  }
}
```

## 错误类型处理

### 类型安全的错误处理

```tsx
// src/routes/error.tsx
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

interface CustomError {
  message: string
  code?: string
  details?: any
}

export default function ErrorBoundary() {
  const error = useRouteError()
  
  // 类型守卫函数
  function isCustomError(error: any): error is CustomError {
    return error && typeof error.message === 'string'
  }
  
  if (isRouteErrorResponse(error)) {
    return (
      <div className="error-page">
        <h1>{error.status} {error.statusText}</h1>
        <p>{error.data}</p>
      </div>
    )
  }
  
  if (isCustomError(error)) {
    return (
      <div className="error-page">
        <h1>应用错误</h1>
        <p>{error.message}</p>
        {error.code && <p>错误代码: {error.code}</p>}
      </div>
    )
  }
  
  return (
    <div className="error-page">
      <h1>未知错误</h1>
      <p>发生了意外错误</p>
    </div>
  )
}
```

## 元数据类型

### 路由元数据类型定义

```tsx
// src/types/route-meta.ts
export interface RouteMeta {
  title?: string
  description?: string
  keywords?: string[]
  requiresAuth?: boolean
  roles?: string[]
  layout?: 'default' | 'admin' | 'auth'
  breadcrumbs?: BreadcrumbItem[]
}

export interface BreadcrumbItem {
  label: string
  path?: string
}

// 在路由中使用
export const meta: RouteMeta = {
  title: '用户管理',
  description: '管理系统用户',
  requiresAuth: true,
  roles: ['admin'],
  layout: 'admin',
  breadcrumbs: [
    { label: '首页', path: '/' },
    { label: '管理', path: '/admin' },
    { label: '用户管理' }
  ]
}
```

### 元数据访问 Hook

```tsx
// src/hooks/useRouteMeta.ts
import { useMatches } from 'react-router-dom'
import type { RouteMeta } from '@/types/route-meta'

export function useRouteMeta(): RouteMeta {
  const matches = useMatches()
  
  // 合并所有匹配路由的元数据
  return matches.reduce((meta, match) => {
    const routeMeta = match.handle?.meta as RouteMeta
    return { ...meta, ...routeMeta }
  }, {} as RouteMeta)
}

// 在组件中使用
export default function PageHeader() {
  const meta = useRouteMeta()
  
  return (
    <header>
      <h1>{meta.title}</h1>
      {meta.description && <p>{meta.description}</p>}
      {meta.breadcrumbs && (
        <nav>
          {meta.breadcrumbs.map((item, index) => (
            <span key={index}>
              {item.path ? (
                <Link to={item.path}>{item.label}</Link>
              ) : (
                item.label
              )}
              {index < meta.breadcrumbs!.length - 1 && ' > '}
            </span>
          ))}
        </nav>
      )}
    </header>
  )
}
```

## 高级类型特性

### 条件类型

```typescript
// src/types/route-utils.ts
type RouteWithParams<T extends string> = T extends `${string}:${infer Param}${infer Rest}`
  ? { [K in Param]: string } & RouteWithParams<Rest>
  : {}

type ExtractParams<T extends string> = RouteWithParams<T>

// 使用示例
type UserRouteParams = ExtractParams<'/user/:id/posts/:postId'>
// 结果: { id: string; postId: string }
```

### 模板字面量类型

```typescript
// src/types/routes.ts
type StaticRoutes = '/' | '/about' | '/contact'
type UserRoutes = `/user/${string}`
type AdminRoutes = `/admin/${string}`

type AllRoutes = StaticRoutes | UserRoutes | AdminRoutes

// 类型安全的导航函数
function navigate<T extends AllRoutes>(path: T): void {
  // 导航逻辑
}

// 使用
navigate('/user/123')  // ✅ 正确
navigate('/invalid')   // ❌ TypeScript 错误
```

## 开发工具集成

### VS Code 配置

```json
// .vscode/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

### ESLint TypeScript 规则

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error'
  }
}
```

## 故障排除

### 常见类型错误

1. **参数类型不匹配**
   ```tsx
   // ❌ 错误
   const { id } = useParams<{ id: number }>()
   
   // ✅ 正确 - 路由参数总是字符串
   const { id } = useParams<{ id: string }>()
   const numericId = parseInt(id)
   ```

2. **Loader 数据类型错误**
   ```tsx
   // ❌ 错误
   const data = useLoaderData() as UserData
   
   // ✅ 正确
   const data = useLoaderData<typeof loader>()
   ```

3. **可选参数处理**
   ```tsx
   // ❌ 错误
   const { category } = useParams<{ category: string }>()
   
   // ✅ 正确 - 可选参数可能为 undefined
   const { category } = useParams<{ category?: string }>()
   ```

### 类型生成问题

1. **类型文件未生成**
   - 检查 `enableGeneration` 配置
   - 确认 `routesTypeFile` 路径正确
   - 验证文件写入权限

2. **类型不准确**
   - 检查路由文件导出
   - 确认参数命名规范
   - 验证 TypeScript 配置

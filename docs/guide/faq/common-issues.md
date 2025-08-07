# 常见问题

这里收集了使用 @feoe/fs-router 时最常遇到的问题和解决方案。

## 安装和配置问题

### Q: 安装后插件不工作怎么办？

**A:** 请检查以下几点：

1. **确认插件配置正确**
   ```typescript
   // vite.config.ts
   import { FileBasedRouterVite } from '@feoe/fs-router/vite'
   
   export default defineConfig({
     plugins: [
       react(),
       FileBasedRouterVite({
         routesDirectory: 'src/routes',
         generatedRoutesPath: 'src/routes.tsx'
       })
     ]
   })
   ```

2. **检查路由目录是否存在**
   ```bash
   # 确保路由目录存在
   mkdir -p src/routes
   ```

3. **重启开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

### Q: TypeScript 报错找不到模块？

**A:** 这通常是路径配置问题：

1. **检查 tsconfig.json 配置**
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"],
         "@/routes": ["./src/routes.tsx"]
       }
     },
     "include": [
       "src/**/*",
       "src/routes.tsx"
     ]
   }
   ```

2. **确认生成的路由文件存在**
   ```bash
   # 检查文件是否生成
   ls -la src/routes.tsx
   ```

3. **重启 TypeScript 服务**
   - VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Q: 构建时出现路径错误？

**A:** 检查相对路径配置：

1. **使用绝对路径或别名**
   ```typescript
   // ❌ 避免使用相对路径
   import { routes } from './routes'
   
   // ✅ 使用别名
   import { routes } from '@/routes'
   ```

2. **配置构建工具别名**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src')
       }
     }
   })
   ```

## 路由相关问题

### Q: 路由不生效，页面显示 404？

**A:** 检查以下几个方面：

1. **文件命名是否正确**
   ```
   ✅ 正确命名
   src/routes/page.tsx          # 首页
   src/routes/about/page.tsx    # 关于页面
   
   ❌ 错误命名
   src/routes/index.tsx         # 应该是 page.tsx
   src/routes/about.tsx         # 应该在 about/page.tsx
   ```

2. **组件导出是否正确**
   ```tsx
   // ✅ 正确导出
   export default function HomePage() {
     return <div>首页</div>
   }
   
   // ❌ 错误导出
   export function HomePage() {  // 缺少 default
     return <div>首页</div>
   }
   ```

3. **路由配置是否正确使用**
   ```tsx
   // src/main.tsx
   import { createBrowserRouter, RouterProvider } from 'react-router-dom'
   import { routes } from '@/routes'
   
   const router = createBrowserRouter(routes)
   
   ReactDOM.createRoot(document.getElementById('root')!).render(
     <RouterProvider router={router} />
   )
   ```

### Q: 动态路由参数获取不到？

**A:** 检查动态路由配置：

1. **文件命名格式**
   ```
   ✅ 正确格式
   src/routes/user/[id]/page.tsx     # 单个参数
   src/routes/blog/[...slug]/page.tsx # 捕获所有参数
   
   ❌ 错误格式
   src/routes/user/{id}/page.tsx     # 应该用方括号
   src/routes/user/id/page.tsx       # 缺少方括号
   ```

2. **参数获取方式**
   ```tsx
   import { useParams } from 'react-router-dom'
   
   export default function UserPage() {
     const { id } = useParams()  // 参数名对应文件名
     
     return <div>用户 ID: {id}</div>
   }
   ```

### Q: 嵌套路由布局不显示？

**A:** 检查布局组件配置：

1. **确保使用 Outlet**
   ```tsx
   // src/routes/layout.tsx
   import { Outlet } from 'react-router-dom'
   
   export default function RootLayout() {
     return (
       <div>
         <header>导航</header>
         <main>
           <Outlet />  {/* 必须包含 Outlet */}
         </main>
       </div>
     )
   }
   ```

2. **检查嵌套结构**
   ```
   src/routes/
   ├── layout.tsx        # 根布局
   ├── page.tsx          # 首页
   └── user/
       ├── layout.tsx    # 用户布局
       ├── page.tsx      # 用户首页
       └── [id]/
           └── page.tsx  # 用户详情
   ```

## 开发环境问题

### Q: 热更新不工作？

**A:** 检查开发环境配置：

1. **确认插件配置**
   ```typescript
   FileBasedRouterVite({
     routesDirectory: 'src/routes',
     generatedRoutesPath: 'src/routes.tsx',
     watch: true  // 确保启用监听
   })
   ```

2. **检查文件监听**
   ```bash
   # 检查文件是否被正确监听
   # 修改路由文件后应该看到重新生成的日志
   ```

3. **重启开发服务器**
   ```bash
   # 有时需要重启服务器
   npm run dev
   ```

### Q: 开发时路由文件频繁重新生成？

**A:** 这可能是文件监听配置问题：

1. **配置忽略文件**
   ```typescript
   FileBasedRouterVite({
     routesDirectory: 'src/routes',
     generatedRoutesPath: 'src/routes.tsx',
     watchOptions: {
       ignored: ['**/*.test.tsx', '**/*.spec.tsx', '**/node_modules/**']
     }
   })
   ```

2. **调整防抖延迟**
   ```typescript
   FileBasedRouterVite({
     watchOptions: {
       debounceMs: 300  // 增加防抖延迟
     }
   })
   ```

## 构建和部署问题

### Q: 生产构建失败？

**A:** 检查构建配置：

1. **确认所有依赖已安装**
   ```bash
   npm install
   # 或
   yarn install
   ```

2. **检查 TypeScript 错误**
   ```bash
   npx tsc --noEmit
   ```

3. **检查导入路径**
   ```tsx
   // 确保所有导入路径正确
   import { routes } from '@/routes'  // 使用配置的别名
   ```

### Q: 部署后路由不工作？

**A:** 这通常是服务器配置问题：

1. **配置服务器重写规则**
   ```nginx
   # Nginx 配置
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

   ```apache
   # Apache 配置 (.htaccess)
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

2. **使用 HashRouter（临时方案）**
   ```tsx
   // 如果无法配置服务器，可以临时使用 HashRouter
   import { createHashRouter } from 'react-router-dom'
   
   const router = createHashRouter(routes)
   ```

## 性能问题

### Q: 首次加载很慢？

**A:** 优化加载性能：

1. **启用代码分割**
   ```typescript
   FileBasedRouterVite({
     typeGenerateOptions: {
       routesTypeFile: 'src/routes-type.ts',
       generateRouteParams: true,
       generateLoaderTypes: true,
       routesDirectories: []
     }
   })
   ```

2. **预加载关键路由**
   ```tsx
   // 预加载重要页面
   import('./routes/home/page')
   import('./routes/about/page')
   ```

### Q: 路由切换卡顿？

**A:** 优化路由切换：

1. **使用 Suspense 和 Loading**
   ```tsx
   import { Suspense } from 'react'
   
   function App() {
     return (
       <Suspense fallback={<div>加载中...</div>}>
         <RouterProvider router={router} />
       </Suspense>
     )
   }
   ```

2. **优化组件渲染**
   ```tsx
   import { memo } from 'react'
   
   const ExpensiveComponent = memo(function ExpensiveComponent() {
     // 复杂组件逻辑
   })
   ```

## 集成问题

### Q: 与状态管理库冲突？

**A:** 正确集成状态管理：

1. **在 loader 中更新状态**
   ```tsx
   // 使用 Zustand
   export async function loader({ params }) {
     const user = await fetchUser(params.id)
     useUserStore.getState().setUser(user)
     return { user }
   }
   ```

2. **避免在组件中直接调用 API**
   ```tsx
   // ❌ 避免
   useEffect(() => {
     fetchUser(id).then(setUser)
   }, [id])
   
   // ✅ 推荐 - 使用 loader
   const { user } = useLoaderData()
   ```

### Q: 与 UI 库样式冲突？

**A:** 解决样式冲突：

1. **使用 CSS Modules 或 Styled Components**
   ```tsx
   import styles from './page.module.css'
   
   export default function Page() {
     return <div className={styles.container}>内容</div>
   }
   ```

2. **配置 CSS 作用域**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     css: {
       modules: {
         scopeBehaviour: 'local'
       }
     }
   })
   ```

## 调试技巧

### 启用调试模式

```typescript
// 开发环境启用详细日志
FileBasedRouterVite({
  development: {
    logGeneration: true,
    showDebugInfo: true
  }
})
```

### 检查生成的路由

```tsx
// 在控制台查看生成的路由
console.log('生成的路由:', routes)
```

### 使用 React Developer Tools

安装 React Developer Tools 浏览器扩展，可以查看路由状态和组件树。

## 获取帮助

如果以上解决方案都无法解决您的问题：

1. **查看 GitHub Issues**
   - 搜索相似问题
   - 查看已知问题列表

2. **提交 Bug 报告**
   - 提供详细的错误信息
   - 包含最小复现示例
   - 说明环境信息

3. **社区讨论**
   - 参与社区讨论
   - 分享使用经验
   - 帮助其他用户

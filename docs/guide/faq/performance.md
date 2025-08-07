# 性能问题

了解如何诊断和解决 @feoe/fs-router 相关的性能问题。

## 性能诊断

### 识别性能瓶颈

1. **使用浏览器开发者工具**
   ```javascript
   // 在控制台中测量路由切换时间
   console.time('route-change')
   navigate('/new-route')
   // 在新页面加载完成后
   console.timeEnd('route-change')
   ```

2. **React Profiler**
   ```tsx
   import { Profiler } from 'react'
   
   function onRenderCallback(id, phase, actualDuration) {
     console.log('组件渲染时间:', { id, phase, actualDuration })
   }
   
   <Profiler id="App" onRender={onRenderCallback}>
     <RouterProvider router={router} />
   </Profiler>
   ```

3. **网络面板分析**
   - 检查 JavaScript bundle 大小
   - 分析代码分割效果
   - 监控资源加载时间

### 性能指标监控

```tsx
// 自定义性能监控 Hook
function usePerformanceMonitor() {
  const location = useLocation()
  
  useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // 记录页面停留时间
      console.log(`页面 ${location.pathname} 停留时间: ${duration}ms`)
      
      // 发送到分析服务
      analytics.track('page_duration', {
        path: location.pathname,
        duration
      })
    }
  }, [location])
}
```

## 首次加载优化

### 减少初始 Bundle 大小

1. **启用代码分割**
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
     ],
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom', 'react-router-dom'],
             ui: ['@mui/material', 'antd']  // UI 库单独打包
           }
         }
       }
     }
   })
   ```

2. **路由级别的代码分割**
   ```tsx
   // 自动生成的懒加载组件
   const HomePage = lazy(() => import('./routes/page'))
   const AboutPage = lazy(() => import('./routes/about/page'))
   const UserPage = lazy(() => import('./routes/user/[id]/page'))
   ```

3. **预加载关键路由**
   ```tsx
   // 在应用启动时预加载重要路由
   const preloadRoutes = [
     () => import('./routes/page'),
     () => import('./routes/about/page')
   ]
   
   // 在空闲时间预加载
   if ('requestIdleCallback' in window) {
     requestIdleCallback(() => {
       preloadRoutes.forEach(load => load())
     })
   }
   ```

### 优化资源加载

1. **使用 Resource Hints**
   ```html
   <!-- 在 index.html 中添加 -->
   <link rel="preload" href="/src/routes.tsx" as="script">
   <link rel="prefetch" href="/src/routes/about/page.tsx" as="script">
   ```

2. **配置 Webpack/Vite 预加载**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           chunkFileNames: (chunkInfo) => {
             // 为路由 chunk 添加预加载提示
             if (chunkInfo.name?.includes('routes')) {
               return 'routes/[name]-[hash].js'
             }
             return '[name]-[hash].js'
           }
         }
       }
     }
   })
   ```

## 路由切换优化

### 减少切换延迟

1. **智能预加载**
   ```tsx
   // 鼠标悬停时预加载
   function PreloadLink({ to, children, ...props }) {
     const [isHovered, setIsHovered] = useState(false)
     
     useEffect(() => {
       if (isHovered) {
         // 预加载目标路由
         import(`./routes${to}/page`)
       }
     }, [isHovered, to])
     
     return (
       <Link
         to={to}
         onMouseEnter={() => setIsHovered(true)}
         {...props}
       >
         {children}
       </Link>
     )
   }
   ```

2. **视口预加载**
   ```tsx
   // 当链接进入视口时预加载
   function useIntersectionPreload(ref, importFn) {
     useEffect(() => {
       const observer = new IntersectionObserver(
         ([entry]) => {
           if (entry.isIntersecting) {
             importFn()
             observer.disconnect()
           }
         },
         { threshold: 0.1 }
       )
       
       if (ref.current) {
         observer.observe(ref.current)
       }
       
       return () => observer.disconnect()
     }, [importFn])
   }
   ```

### 优化 Suspense 边界

1. **分层 Suspense**
   ```tsx
   function App() {
     return (
       <Router>
         <Suspense fallback={<AppSkeleton />}>
           <Layout>
             <Suspense fallback={<PageSkeleton />}>
               <Routes />
             </Suspense>
           </Layout>
         </Suspense>
       </Router>
     )
   }
   ```

2. **智能 Loading 状态**
   ```tsx
   function SmartSuspense({ children, fallback }) {
     const [showFallback, setShowFallback] = useState(false)
     
     useEffect(() => {
       const timer = setTimeout(() => {
         setShowFallback(true)
       }, 200) // 200ms 后才显示 loading
       
       return () => clearTimeout(timer)
     }, [])
     
     return (
       <Suspense fallback={showFallback ? fallback : null}>
         {children}
       </Suspense>
     )
   }
   ```

## 数据加载优化

### Loader 性能优化

1. **并行数据加载**
   ```tsx
   export async function loader({ params }) {
     // 并行加载多个数据源
     const [user, posts, comments] = await Promise.all([
       fetchUser(params.id),
       fetchUserPosts(params.id),
       fetchUserComments(params.id)
     ])
     
     return { user, posts, comments }
   }
   ```

2. **数据缓存策略**
   ```tsx
   // 简单的内存缓存
   const cache = new Map()
   const CACHE_TTL = 5 * 60 * 1000 // 5分钟
   
   export async function loader({ params }) {
     const cacheKey = `user-${params.id}`
     const cached = cache.get(cacheKey)
     
     if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
       return cached.data
     }
     
     const user = await fetchUser(params.id)
     cache.set(cacheKey, {
       data: { user },
       timestamp: Date.now()
     })
     
     return { user }
   }
   ```

3. **增量数据加载**
   ```tsx
   export async function loader({ params, request }) {
     const url = new URL(request.url)
     const page = parseInt(url.searchParams.get('page') || '1')
     const pageSize = 20
     
     // 只加载当前页数据
     const posts = await fetchPosts({
       userId: params.id,
       page,
       pageSize
     })
     
     return { posts, page, hasMore: posts.length === pageSize }
   }
   ```

### 避免数据重复加载

1. **使用 React Query 集成**
   ```tsx
   import { useQuery } from '@tanstack/react-query'
   
   export async function loader({ params }) {
     // 在 loader 中预填充查询缓存
     const queryClient = getQueryClient()
     
     await queryClient.prefetchQuery({
       queryKey: ['user', params.id],
       queryFn: () => fetchUser(params.id)
     })
     
     return null // 数据通过 React Query 管理
   }
   
   export default function UserPage() {
     const { id } = useParams()
     const { data: user } = useQuery({
       queryKey: ['user', id],
       queryFn: () => fetchUser(id)
     })
     
     return <div>{user?.name}</div>
   }
   ```

## 内存优化

### 避免内存泄漏

1. **清理事件监听器**
   ```tsx
   export default function UserPage() {
     useEffect(() => {
       const handleResize = () => {
         // 处理窗口大小变化
       }
       
       window.addEventListener('resize', handleResize)
       
       return () => {
         window.removeEventListener('resize', handleResize)
       }
     }, [])
   }
   ```

2. **清理定时器**
   ```tsx
   export default function AutoRefreshPage() {
     useEffect(() => {
       const interval = setInterval(() => {
         // 自动刷新数据
       }, 30000)
       
       return () => clearInterval(interval)
     }, [])
   }
   ```

3. **取消未完成的请求**
   ```tsx
   export async function loader({ params, signal }) {
     try {
       const user = await fetchUser(params.id, { signal })
       return { user }
     } catch (error) {
       if (error.name === 'AbortError') {
         // 请求被取消，不需要处理
         return null
       }
       throw error
     }
   }
   ```

### 组件优化

1. **使用 React.memo**
   ```tsx
   const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
     // 复杂的渲染逻辑
     return <div>{/* 渲染内容 */}</div>
   })
   ```

2. **优化依赖数组**
   ```tsx
   // ❌ 避免
   useEffect(() => {
     fetchData(user)
   }, [user]) // user 对象每次都不同
   
   // ✅ 推荐
   useEffect(() => {
     fetchData(user)
   }, [user.id]) // 只依赖必要的属性
   ```

## 构建优化

### Bundle 分析

1. **分析 Bundle 大小**
   ```bash
   # 使用 webpack-bundle-analyzer
   npm install --save-dev webpack-bundle-analyzer
   
   # 或使用 Vite 插件
   npm install --save-dev rollup-plugin-visualizer
   ```

2. **配置分析工具**
   ```typescript
   // vite.config.ts
   import { visualizer } from 'rollup-plugin-visualizer'
   
   export default defineConfig({
     plugins: [
       // ... 其他插件
       visualizer({
         filename: 'dist/stats.html',
         open: true
       })
     ]
   })
   ```

### Tree Shaking 优化

1. **确保正确的导入方式**
   ```tsx
   // ❌ 避免 - 导入整个库
   import * as _ from 'lodash'
   
   // ✅ 推荐 - 只导入需要的函数
   import { debounce } from 'lodash'
   
   // 或使用具体路径
   import debounce from 'lodash/debounce'
   ```

2. **配置 sideEffects**
   ```json
   // package.json
   {
     "sideEffects": false
   }
   ```

## 监控和测量

### 性能指标收集

```tsx
// 性能监控服务
class PerformanceMonitor {
  static measureRouteChange(from: string, to: string) {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // 发送到分析服务
      this.sendMetric('route_change_duration', {
        from,
        to,
        duration
      })
    }
  }
  
  static measureComponentRender(componentName: string) {
    return (id: string, phase: string, actualDuration: number) => {
      if (actualDuration > 16) { // 超过一帧的时间
        this.sendMetric('slow_component_render', {
          component: componentName,
          phase,
          duration: actualDuration
        })
      }
    }
  }
  
  private static sendMetric(name: string, data: any) {
    // 发送到分析服务
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, data)
    }
  }
}

// 在组件中使用
export default function UserPage() {
  const location = useLocation()
  
  useEffect(() => {
    const cleanup = PerformanceMonitor.measureRouteChange(
      document.referrer,
      location.pathname
    )
    
    return cleanup
  }, [location])
  
  return (
    <Profiler
      id="UserPage"
      onRender={PerformanceMonitor.measureComponentRender('UserPage')}
    >
      {/* 页面内容 */}
    </Profiler>
  )
}
```

### Core Web Vitals 监控

```tsx
// 监控 Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // 发送到分析服务
  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_category: 'Web Vitals',
    event_label: metric.id,
    non_interaction: true
  })
}

// 测量所有指标
getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

## 性能最佳实践总结

1. **启用代码分割和懒加载**
2. **实现智能预加载策略**
3. **优化数据加载和缓存**
4. **使用适当的 Loading 状态**
5. **避免内存泄漏**
6. **监控性能指标**
7. **定期分析 Bundle 大小**
8. **优化关键渲染路径**

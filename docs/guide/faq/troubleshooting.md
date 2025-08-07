# 故障排除

系统性的问题诊断和解决方法，帮助您快速定位和解决 @feoe/fs-router 相关问题。

## 诊断流程

### 1. 问题分类

首先确定问题类型：

- **配置问题** - 插件配置、构建配置
- **路由问题** - 路由不生效、参数获取失败
- **类型问题** - TypeScript 错误、类型不匹配
- **性能问题** - 加载慢、内存泄漏
- **构建问题** - 打包失败、部署错误

### 2. 收集信息

```bash
# 收集环境信息
node --version
npm --version
# 或
yarn --version

# 查看项目依赖
npm list @feoe/fs-router
npm list react-router-dom
npm list typescript

# 检查构建工具版本
npm list vite
# 或
npm list webpack
```

### 3. 启用调试模式

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    FileBasedRouterVite({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx',
      
      // 启用调试
      development: {
        logGeneration: true,
        showDebugInfo: true,
        validateRoutes: true
      }
    })
  ]
})
```

## 常见问题诊断

### 路由文件未生成

**症状：** `src/routes.tsx` 文件不存在或内容为空

**诊断步骤：**

1. **检查插件配置**
   ```typescript
   // 确认插件已正确添加到配置中
   console.log('Vite 插件:', config.plugins)
   ```

2. **检查路由目录**
   ```bash
   # 确认目录存在且包含路由文件
   ls -la src/routes/
   find src/routes -name "*.tsx" -o -name "*.ts"
   ```

3. **检查文件权限**
   ```bash
   # 确认有写入权限
   touch src/routes.tsx
   ls -la src/routes.tsx
   ```

4. **查看构建日志**
   ```bash
   # 启动开发服务器并查看日志
   npm run dev --verbose
   ```

**解决方案：**

```typescript
// 确保配置正确
FileBasedRouterVite({
  routesDirectory: 'src/routes',        // 确保路径正确
  generatedRoutesPath: 'src/routes.tsx', // 确保父目录存在
  enableGeneration: true,               // 确保启用生成
  watch: true                          // 确保启用监听
})
```

### TypeScript 类型错误

**症状：** 编译时出现类型相关错误

**诊断步骤：**

1. **检查 TypeScript 配置**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "moduleResolution": "node",
       "esModuleInterop": true,
       "allowSyntheticDefaultImports": true,
       "jsx": "react-jsx"
     },
     "include": [
       "src/**/*",
       "src/routes.tsx"  // 确保包含生成的文件
     ]
   }
   ```

2. **检查类型生成**
   ```bash
   # 确认类型文件是否生成
   ls -la src/routes-type.ts
   ```

3. **验证导入路径**
   ```tsx
   // 检查导入是否正确
   import { routes } from '@/routes'  // 使用别名
   // 或
   import { routes } from './routes'  // 使用相对路径
   ```

**解决方案：**

```typescript
// 启用类型生成
FileBasedRouterVite({
  enableGeneration: true,
  typeGenerateOptions: {
    routesTypeFile: 'src/routes-type.ts',
    generateRouteParams: true,
    generateLoaderTypes: true,
    routesDirectories: []
  }
})
```

### 路由不匹配

**症状：** 访问路由时显示 404 或错误页面

**诊断步骤：**

1. **检查生成的路由配置**
   ```tsx
   // 在控制台查看生成的路由
   import { routes } from '@/routes'
   console.log('生成的路由:', JSON.stringify(routes, null, 2))
   ```

2. **验证文件结构**
   ```bash
   # 检查文件命名和结构
   tree src/routes/
   ```

3. **检查路由器配置**
   ```tsx
   // 确认路由器配置正确
   const router = createBrowserRouter(routes)
   // 或
   const router = createHashRouter(routes)
   ```

**解决方案：**

```tsx
// 确保文件命名正确
src/routes/
├── page.tsx          # 对应 /
├── about/
│   └── page.tsx      # 对应 /about
└── user/
    └── [id]/
        └── page.tsx  # 对应 /user/:id

// 确保组件正确导出
export default function HomePage() {
  return <div>首页</div>
}
```

### 动态路由参数问题

**症状：** `useParams()` 返回 undefined 或错误的值

**诊断步骤：**

1. **检查文件命名**
   ```bash
   # 确认使用方括号命名
   ls -la src/routes/user/[id]/
   ```

2. **检查参数获取**
   ```tsx
   // 调试参数获取
   const params = useParams()
   console.log('路由参数:', params)
   ```

3. **验证路由匹配**
   ```tsx
   // 检查当前路由
   const location = useLocation()
   console.log('当前路径:', location.pathname)
   ```

**解决方案：**

```tsx
// 正确的文件命名和参数获取
// 文件: src/routes/user/[id]/page.tsx
import { useParams } from 'react-router-dom'

export default function UserPage() {
  const { id } = useParams()  // 参数名对应文件名
  
  if (!id) {
    return <div>用户 ID 不存在</div>
  }
  
  return <div>用户 ID: {id}</div>
}
```

## 高级诊断技巧

### 使用 React Developer Tools

1. **安装扩展**
   - Chrome: React Developer Tools
   - Firefox: React Developer Tools

2. **检查路由状态**
   ```tsx
   // 在组件中添加调试信息
   const location = useLocation()
   const params = useParams()
   const matches = useMatches()
   
   console.log('路由调试信息:', {
     location,
     params,
     matches
   })
   ```

### 网络请求调试

```tsx
// 监控 loader 请求
export async function loader({ params, request }) {
  console.log('Loader 调用:', {
    params,
    url: request.url,
    method: request.method
  })
  
  try {
    const data = await fetchData(params.id)
    console.log('Loader 数据:', data)
    return data
  } catch (error) {
    console.error('Loader 错误:', error)
    throw error
  }
}
```

### 性能分析

```tsx
// 测量组件渲染时间
import { Profiler } from 'react'

function onRenderCallback(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  console.log('组件性能:', {
    id,
    phase,
    actualDuration,
    baseDuration
  })
  
  if (actualDuration > 16) {
    console.warn(`组件 ${id} 渲染时间过长: ${actualDuration}ms`)
  }
}

export default function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <RouterProvider router={router} />
    </Profiler>
  )
}
```

## 错误处理和日志

### 全局错误捕获

```tsx
// 全局错误边界
class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('全局错误:', error, errorInfo)
    
    // 发送错误报告
    this.reportError(error, errorInfo)
  }
  
  reportError(error, errorInfo) {
    // 发送到错误监控服务
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      })
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h1>应用出现错误</h1>
          <details>
            <summary>错误详情</summary>
            <pre>{this.state.error?.toString()}</pre>
          </details>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

### 结构化日志

```tsx
// 日志工具
class Logger {
  static debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data)
    }
  }
  
  static info(message: string, data?: any) {
    console.info(`[INFO] ${message}`, data)
  }
  
  static warn(message: string, data?: any) {
    console.warn(`[WARN] ${message}`, data)
  }
  
  static error(message: string, error?: Error, data?: any) {
    console.error(`[ERROR] ${message}`, error, data)
    
    // 发送到错误监控服务
    this.reportError(message, error, data)
  }
  
  private static reportError(message: string, error?: Error, data?: any) {
    // 实现错误报告逻辑
  }
}

// 在路由中使用
export async function loader({ params }) {
  Logger.debug('加载用户数据', { userId: params.id })
  
  try {
    const user = await fetchUser(params.id)
    Logger.info('用户数据加载成功', { userId: params.id })
    return { user }
  } catch (error) {
    Logger.error('用户数据加载失败', error, { userId: params.id })
    throw error
  }
}
```

## 问题报告模板

当需要寻求帮助时，请提供以下信息：

```markdown
## 问题描述
[简要描述遇到的问题]

## 环境信息
- Node.js 版本: 
- 包管理器: npm/yarn/pnpm
- @feoe/fs-router 版本: 
- React 版本: 
- React Router 版本: 
- 构建工具: Vite/Webpack/Rspack
- 操作系统: 

## 重现步骤
1. 
2. 
3. 

## 期望行为
[描述期望的正确行为]

## 实际行为
[描述实际发生的行为]

## 配置文件
```typescript
// vite.config.ts 或 webpack.config.js
```

## 错误信息
```
[粘贴完整的错误信息和堆栈跟踪]
```

## 最小复现示例
[提供最小的可复现示例代码]
```

## 预防措施

### 代码审查清单

- [ ] 文件命名符合约定
- [ ] 组件正确导出
- [ ] 路由配置正确
- [ ] TypeScript 类型正确
- [ ] 错误处理完善
- [ ] 性能考虑充分

### 自动化测试

```tsx
// 路由测试示例
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '@/routes'

describe('路由测试', () => {
  test('首页路由正常工作', () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/']
    })
    
    render(<RouterProvider router={router} />)
    
    expect(screen.getByText('首页')).toBeInTheDocument()
  })
  
  test('动态路由参数正确传递', () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/user/123']
    })
    
    render(<RouterProvider router={router} />)
    
    expect(screen.getByText('用户 ID: 123')).toBeInTheDocument()
  })
})
```

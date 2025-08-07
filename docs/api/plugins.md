# 插件 API

@feoe/fs-router 为不同的构建工具提供了插件支持。

## Vite 插件

### FileBasedRouterVite

```typescript
import { FileBasedRouterVite } from '@feoe/fs-router/vite'

export interface PluginConfig {
  /** 路由文件目录 */
  routesDirectory: string
  /** 生成的路由文件路径 */
  generatedRoutesPath: string
  /** 路由文件扩展名 */
  routeExtensions?: string[]
  /** 是否启用路由生成 */
  enableGeneration?: boolean
  /** 路径别名配置 */
  alias?: {
    name: string
    basename: string
  }
  /** 是否启用代码分割 */
  splitting?: boolean
  /** 是否启用默认错误边界 */
  defaultErrorBoundary?: boolean
  /** 类型生成选项 */
  typeGenerateOptions?: TypeGenerateOptions
}
```

### 配置示例

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    FileBasedRouterVite({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx',
      enableGeneration: true,
      typeGenerateOptions: {
        routesTypeFile: 'src/routes-type.ts'
      }
    })
  ]
})
```

## Rspack 插件

### FileBasedRouterRspack

```typescript
const { FileBasedRouterRspack } = require('@feoe/fs-router/rspack')

// 使用相同的 PluginConfig 接口
export type RspackPluginOptions = PluginConfig
```

## Webpack 插件

### FileBasedRouterWebpack

```typescript
const { FileBasedRouterWebpack } = require('@feoe/fs-router/webpack')

// 使用相同的 PluginConfig 接口
export type WebpackPluginOptions = PluginConfig
```

## 通用配置选项

### TypeGenerateOptions

```typescript
interface TypeGenerateOptions {
  /** 类型文件输出路径 */
  routesTypeFile: string
  /** 是否生成路由参数类型 */
  generateRouteParams?: boolean
  /** 是否生成 Loader 类型 */
  generateLoaderTypes?: boolean
  /** 路由目录配置（仅 Rspack） */
  routesDirectories?: RouteDirectory[]
}

interface RouteDirectory {
  /** 路由前缀 */
  prefix?: string
  /** 路由目录路径 */
  path: string
}
```
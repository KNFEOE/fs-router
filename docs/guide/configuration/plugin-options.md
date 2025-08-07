# 插件配置

详细了解 @feoe/fs-router 各个构建工具插件的配置选项。

## 通用配置选项

所有构建工具插件都支持以下配置选项：

```typescript
interface PluginConfig {
  /** 路由文件目录，默认 'src/routes' */
  routesDirectory: string
  /** 生成的路由文件路径，默认 'src/routes.tsx' */
  generatedRoutesPath: string
  /** 路由文件扩展名，默认 ['.js', '.jsx', '.ts', '.tsx'] */
  routeExtensions?: string[]
  /** 是否启用路由生成，默认 true */
  enableGeneration?: boolean
  /** 路径别名配置 */
  alias?: {
    name: string
    basename: string
  }
  /** 是否启用代码分割，默认 true */
  splitting?: boolean
  /** 是否启用默认错误边界，默认 false */
  defaultErrorBoundary?: boolean
  /** 类型生成选项 */
  typeGenerateOptions?: TypeGenerateOptions
}

export interface TypeGenerateOptions {
  /** 类型文件输出路径 */
  routesTypeFile: string
  /** 是否生成路由参数类型 */
  generateRouteParams?: boolean
  /** 是否生成 Loader 类型 */
  generateLoaderTypes?: boolean
  /** 路由目录配置 */
  routesDirectories?: RouteDirectory[]
}

export interface RouteDirectory {
  /** 路由前缀 */
  prefix?: string
  /** 路由目录路径 */
  path: string
}
```

## Vite 插件配置

### 基础配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { FileBasedRouterVite } from '@feoe/fs-router/vite'

export default defineConfig({
  plugins: [
    react(),
    FileBasedRouterVite({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx',
      enableGeneration: true,
      // 类型生成选项
      typeGenerateOptions: {
        routesTypeFile: 'src/routes-type.ts',
        generateRouteParams: true,
        generateLoaderTypes: true,
        routesDirectories: []
      },
    })
  ]
})
```

## Webpack 插件配置

### 基础配置

```javascript
// webpack.config.js
const { FileBasedRouterWebpack } = require('@feoe/fs-router/webpack')

module.exports = {
  plugins: [
    new FileBasedRouterWebpack({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx',
      enableGeneration: true,
    })
  ]
}
```

## Rspack 插件配置

### 基础配置

```javascript
// rspack.config.js
const { FileBasedRouterRspack } = require('@feoe/fs-router/rspack')

module.exports = {
  plugins: [
    new FileBasedRouterRspack({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx',
      enableGeneration: true
    })
  ]
}
```


## Rsbuild 插件配置

### 基础配置

```javascript
// rsbuild.config.js
import { FileBasedRouterRspack } from "@feoe/fs-router/rspack"

const pluginRouter = FileBasedRouterRspack({
  routesDirectory: 'src/routes',
  generatedRoutesPath: 'src/routes.tsx',
  enableGeneration: true
})

export default defineConfig({
  tools: {
    rspack: {
      plugins: [pluginRouter]
    }
  }
})
```

## 详细配置选项

### 类型生成选项

```typescript
interface TypeGenerateOptions {
  /** 类型文件输出路径，默认 'src/routes-type.ts' */
  routesTypeFile: string
  /** 是否生成路由参数类型，默认 true */
  generateRouteParams?: boolean
  /** 是否生成 Loader 类型，默认 true */
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

## 故障排除

### 常见配置问题

1. **路由文件未生成**
   ```typescript
   // 确保路径正确且有写入权限
   FileBasedRouterVite({
     routesDirectory: 'src/routes',  // 确保目录存在
     generatedRoutesPath: 'src/routes.tsx'  // 确保父目录存在
   })
   ```

2. **类型生成失败**
   ```typescript
   // 确保 TypeScript 配置正确
   FileBasedRouterVite({
     enableGeneration: true,
     typeGenerateOptions: {
       routesTypeFile: 'src/routes-type.ts'  // 确保路径有效
     }
   })
   ```

3. **热更新不工作**

  确保监听选项正确配置，参考[贡献指南](./contributing/index)
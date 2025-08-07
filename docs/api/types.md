# 类型定义

@feoe/fs-router 的 TypeScript 类型定义。

## 核心类型

```typescript
export interface RouteConfig {
  path: string
  element: React.ComponentType
  children?: RouteConfig[]
  loader?: LoaderFunction
  action?: ActionFunction
}

export interface LoaderFunction {
  (args: LoaderFunctionArgs): Promise<any> | any
}

export interface ActionFunction {
  (args: ActionFunctionArgs): Promise<any> | any
}
```

## 插件选项类型

```typescript
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
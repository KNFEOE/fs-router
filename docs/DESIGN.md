# FileBasedReactRouter 设计文档

## 📋 目录

- [项目概述](#项目概述)
- [设计理念](#设计理念)
- [架构设计](#架构设计)
- [核心组件](#核心组件)
- [约定式路由](#约定式路由)
- [插件系统](#插件系统)
- [性能优化](#性能优化)
- [类型系统](#类型系统)

## 🎯 项目概述

FileBasedReactRouter 是一个基于文件系统的约定式路由解决方案，旨在为 React 应用提供类型安全、高性能的路由管理。该项目借鉴了 Modern.js、Next.js、Remix 等现代框架的路由设计理念，同时保持了轻量级和高度可定制的特性。

### 核心目标

1. **简化路由管理** - 通过文件系统约定自动生成路由配置
2. **类型安全** - 提供完整的 TypeScript 支持
3. **高性能** - 支持代码分割和懒加载
4. **开发体验** - 热更新和实时路由生成
5. **构建工具集成** - 支持主流构建工具

## 🏗️ 设计理念

### 约定优于配置

项目采用"约定优于配置"的设计理念，通过文件系统的组织结构来定义路由结构，减少配置的复杂性。

### 类型安全优先

从设计之初就考虑 TypeScript 支持，确保路由参数、查询参数等都具有完整的类型推导。

### 插件化架构

采用插件化设计，支持多种构建工具，便于扩展和定制。

## 🏛️ 架构设计

### 整体架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   文件系统扫描    │───▶│   路由树生成      │───▶│   代码生成       │
│  (Extractor)    │    │  (RouteNode)    │    │  (Generator)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   路径解析       │    │   类型解析        │    │   插件系统       │
│  (PathParser)   │    │  (RouteFileParser)│  │  (Plugin)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 数据流

1. **文件扫描** - `RouteExtractor` 扫描路由目录
2. **路径解析** - `pathParser` 解析动态路由参数
3. **类型解析** - `parseRouteFile` 解析 TypeScript 类型
4. **路由树构建** - 构建 `RouteNode` 树结构
5. **代码生成** - `RouteCodeGenerator` 生成 React Router 配置
6. **插件处理** - 各构建工具插件集成

## 🔧 核心组件

### 1. RouteExtractor (路由提取器)

**职责**: 扫描文件系统并构建路由树

**核心功能**:
- 递归扫描路由目录
- 识别约定式路由文件
- 构建嵌套路由结构
- 处理动态路由参数

**关键方法**:
```typescript
class RouteExtractor {
  async extract(): Promise<RouteNode[]>
  private async walkDirectory(dirname: string): Promise<RouteNode | null>
  private optimizeRoute(routeTree: RouteNode): RouteNode[]
}
```

### 2. PathParser (路径解析器)

**职责**: 解析文件路径为路由路径和参数

**支持的动态路由模式**:
- `[param]` - 必需参数
- `[[param]]` - 可选参数
- `[param$]` - 可选参数（另一种语法）
- `$` - catch-all 路由
- `[[...param]]` - 可选 catch-all 参数

**示例**:
```typescript
pathParser("user/[id]/[type$]")
// 结果: { route: "user/:id/:type?", params: [...] }
```

### 3. RouteFileParser (路由文件解析器)

**职责**: 解析路由文件中的 TypeScript 类型定义

**功能**:
- 解析 `PageQueryParams` 类型定义
- 支持联合类型、交叉类型
- 提取查询参数类型信息
- 生成类型安全的导航代码

### 4. RouteCodeGenerator (路由代码生成器)

**职责**: 生成 React Router 配置代码

**特性**:
- 支持代码分割
- 懒加载组件
- 错误边界处理
- 加载状态管理

**生成的代码结构**:
```typescript
import loadable from '@loadable/component';

const Component_0 = loadable(() => import(/* webpackChunkName: "user" */ './routes/user/page.tsx'));

export const routes = [
  {
    path: '/user',
    element: <Component_0 />
  }
];
```

### 5. Plugin System (插件系统)

**职责**: 集成各种构建工具

**支持的构建工具**:
- Vite
- Webpack  
- Rspack

**核心功能**:
- 文件监听和热更新
- 开发/生产环境适配
- 虚拟模块处理

## 📁 约定式路由

### 文件命名约定

| 文件名 | 用途 | 路由行为 |
|--------|------|----------|
| `layout.tsx` | 布局组件 | 嵌套布局 |
| `page.tsx` | 页面组件 | 索引路由 |
| `$.tsx` | Catch-all 路由 | 匹配所有未匹配路径 |
| `loading.tsx` | 加载组件 | 路由加载状态 |
| `error.tsx` | 错误组件 | 错误边界 |
| `*.data.ts` | 数据加载器 | 服务端数据加载 |
| `*.data.client.ts` | 客户端数据加载器 | 客户端数据加载 |
| `*.loader.ts` | 加载器 | 路由加载器 |
| `*.config.ts` | 路由配置 | 路由元数据 |

### 目录结构约定

```
routes/
├── layout.tsx              # 根布局
├── page.tsx                # 首页 (/)
├── about/
│   └── page.tsx            # /about
├── user/
│   ├── layout.tsx          # 用户页面布局
│   ├── page.tsx            # /user
│   └── [id]/
│       └── page.tsx        # /user/:id
├── (auth)/                 # 路由分组（不影响 URL）
│   ├── login/
│   │   └── page.tsx        # /login
│   └── register/
│       └── page.tsx        # /register
└── error.tsx               # 错误页面
```

### 特殊目录处理

- `(group)` - 路由分组，不影响 URL 结构
- `__dirname` - 无路径布局，用于共享布局
- `$.tsx` - catch-all 路由，匹配所有未匹配路径

## 🔌 插件系统

### 插件架构

插件系统基于 `unplugin` 构建，提供统一的插件接口：

```typescript
interface RouterGeneratorPluginContext {
  root: string;
  config: PluginConfig;
  watcher: FSWatcher | null;
  lock: boolean;
  generated: boolean;
}
```

### 配置选项

```typescript
interface PluginConfig {
  routesDirectory: string;        // 路由目录
  generatedRoutesPath: string;    // 生成的路由文件路径
  routeExtensions?: string[];     // 支持的文件扩展名
  enableGeneration?: boolean;     // 是否启用路由生成
  alias?: {                       // 路径别名
    name: string;
    basename: string;
  };
  splitting?: boolean;            // 是否启用代码分割
  defaultErrorBoundary?: boolean; // 是否使用默认错误边界
  typeGenerateOptions?: GenerateRouteTypeOptions; // 类型生成选项
}
```

### 构建工具适配

#### Vite 插件
- 支持 HMR 热更新
- 虚拟模块处理
- 开发服务器集成

#### Webpack 插件
- 生产环境优化
- 文件监听
- 代码分割支持

#### Rspack 插件
- 与 Webpack 兼容的 API
- 更快的构建速度

## ⚡ 性能优化

### 代码分割

- 基于路由的代码分割
- 动态导入支持
- 预加载优化

### 懒加载

- 组件级别的懒加载
- 加载状态管理
- 错误边界处理

### 缓存策略

- 路由配置缓存
- 文件监听优化
- 增量更新

## 🔒 类型系统

### 路由类型生成

自动生成基于文件系统的路由类型：

```typescript
interface RouteTypes {
  '/': {};
  '/about': {};
  '/user': {};
  '/user/:id': { id: string };
  '/user/:id/:type?': { id: string; type?: string };
}
```

### 类型安全导航

提供类型安全的导航 API：

```typescript
const navigation = useNavigation();

// 类型安全的导航
navigation.push('/user', { id: '123' });
navigation.push('/user/:id/:type?', { id: '123', type: 'profile' });
```

### 查询参数类型

支持查询参数的类型推导：

```typescript
// 在路由文件中定义
export type PageQueryParams = {
  search?: string;
  page: number;
  category: 'all' | 'featured';
};

// 自动推导查询参数类型
navigation.push('/search', undefined, {
  search: 'react',
  page: 1,
  category: 'featured'
});
```

## 🔄 开发工作流

### 开发模式

1. **文件监听** - 监听路由目录变化
2. **实时生成** - 文件变更时重新生成路由
3. **热更新** - 支持 HMR 热更新
4. **类型检查** - 实时类型错误检查

### 生产模式

1. **预构建** - 构建时生成路由配置
2. **代码分割** - 优化包大小
3. **类型生成** - 生成完整的类型定义
4. **错误处理** - 完善的错误边界

## 📝 总结

FileBasedReactRouter 通过约定式路由、类型安全和插件化架构，为 React 应用提供了现代化的路由解决方案。其设计充分考虑了开发体验、性能和可扩展性，为构建大型 React 应用提供了强有力的支持。
# 配置

了解 @feoe/fs-router 的各种配置选项和自定义设置。

## 配置概述

@feoe/fs-router 提供了灵活的配置选项，支持不同的构建工具和使用场景。本节将详细介绍各种配置方式和选项。

## 主要配置项

- [插件配置](./plugin-options.md) - 详细的插件配置选项
- [路由生成](./route-generation.md) - 路由生成相关配置
- [TypeScript 配置](./typescript.md) - TypeScript 相关配置

## 基础配置

所有构建工具的基础配置都包含以下选项：

```typescript
{
  routesDirectory: 'src/routes',    // 路由文件目录
  generatedRoutesPath: 'src/routes.tsx'  // 生成的路由文件路径
}
```

## 构建工具特定配置

不同的构建工具可能有特定的配置要求：

- **Vite** - 使用 `@feoe/fs-router/vite`
- **Webpack** - 使用 `@feoe/fs-router/webpack`
- **Rspack** - 使用 `@feoe/fs-router/rspack`
- **Rsbuild** - 基于 Rspack 插件配置

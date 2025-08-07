# Rspack 集成示例

本指南展示如何在 Rspack 项目中集成 @feoe/fs-router。

## 安装依赖

```bash
npm install @feoe/fs-router -D
```

## Rspack 配置

```javascript
// rspack.config.js
const { FileBasedRouterRspack as fileBasedRouter } = require('@feoe/fs-router/rspack')

module.exports = {
  entry: './src/main.tsx',
  plugins: [
    fileBasedRouter({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx',
      // 启用类型生成
      enableGeneration: true,
      typeGenerateOptions: {
        routesTypeFile: "src/routes-type.ts",
        // 微前端应用配置
        routesDirectories: [
          {
            path: path.join(__dirname, "../shell/src/routes"),
          },
          {
            prefix: "admin",
            path: path.join(__dirname, "src/routes"),
          },
        ],
      },
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
          },
        },
      },
    ],
  },
}
```

## 微前端配置

```javascript
// 主应用配置
const { FileBasedRouterRspack as fileBasedRouter } = require('@feoe/fs-router/rspack')

module.exports = {
  plugins: [
    fileBasedRouter({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx',
      enableGeneration: true,
      typeGenerateOptions: {
        routesTypeFile: "src/routes-type.ts",
        routesDirectories: [
          // 主应用路由
          {
            path: path.join(__dirname, "src/routes"),
          },
          // 子应用路由
          {
            prefix: "admin",
            path: path.join(__dirname, "../admin/src/routes"),
          },
          {
            prefix: "user",
            path: path.join(__dirname, "../user/src/routes"),
          },
        ],
      },
    })
  ]
}
```

## 完整示例

查看完整的 Rspack 集成示例：
- [基础示例](https://github.com/feoe/fs-router/tree/main/examples/kn-admin)
- [微前端示例](https://github.com/feoe/fs-router/tree/main/examples/rsbuild-react-monorepo)
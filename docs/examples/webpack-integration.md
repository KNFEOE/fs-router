# Webpack 集成示例

本指南展示如何在 Webpack 项目中集成 @feoe/fs-router。

## 安装依赖

```bash
npm install @feoe/fs-router -D
```

## Webpack 配置

```javascript
// webpack.config.js
const { FileBasedRouterWebpack as fileBasedRouter } = require('@feoe/fs-router/webpack')

module.exports = {
  entry: './src/index.tsx',
  plugins: [
    fileBasedRouter({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx',
      enableGeneration: true,
      typeGenerateOptions: {
        routesTypeFile: 'src/routes-type.ts'
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}
```

## 开发配置

```javascript
// webpack.dev.js
const { merge } = require('webpack-merge')
const common = require('./webpack.config.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    historyApiFallback: true,
  },
})
```
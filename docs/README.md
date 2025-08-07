# @feoe/fs-router 文档站点

这是 @feoe/fs-router 项目的官方文档站点，使用 Rspress 构建。

## 开发

### 启动开发服务器

```bash
pnpm docs:dev
```

### 构建文档

```bash
pnpm docs:build
```

### 预览构建结果

```bash
pnpm docs:preview
```

## 目录结构

```
docs/
├── .rspress/
│   ├── config.ts              # Rspress 配置文件
│   ├── theme/                 # 自定义主题
│   └── public/                # 静态资源
├── guide/                     # 使用指南
├── api/                       # API 参考
├── examples/                  # 示例和教程
├── concepts/                  # 核心概念
├── migration/                 # 迁移指南
└── contributing/              # 贡献指南
```

## 贡献

欢迎为文档贡献内容！请查看 [贡献指南](./contributing/index.md)。
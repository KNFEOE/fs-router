# 常见问题

这里收集了使用 @feoe/fs-router 时经常遇到的问题和解决方案。

## 问题分类

- [常见问题](./common-issues.md) - 使用过程中的常见问题
- [性能问题](./performance.md) - 性能相关的问题和优化
- [故障排除](./troubleshooting.md) - 问题诊断和解决方法

## 快速解答

### 路由不生效怎么办？

1. 检查文件命名是否符合约定（使用 `page.tsx`）
2. 确认构建工具插件配置正确
3. 验证路由文件目录路径设置

### 如何调试路由生成？

1. 查看生成的 `routes.tsx` 文件
2. 检查控制台是否有错误信息
3. 确认文件结构符合约定

### TypeScript 类型错误？

1. 确保安装了正确的类型定义
2. 检查 tsconfig.json 配置
3. 重启 TypeScript 服务

## 获取帮助

如果您遇到的问题不在此列表中，可以：

1. 查看 [GitHub Issues](https://github.com/knfeoe/fs-router/issues)
2. 提交新的 Issue
3. 参与社区讨论

## 贡献

如果您发现了新的常见问题或有更好的解决方案，欢迎：

1. 提交 Pull Request
2. 分享您的经验
3. 帮助改进文档

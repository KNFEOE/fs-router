import React from 'react';
import { Provider as KeepAliveProvider, KeepAlive } from 'react-keep-alive';

// 配置优化的 KeepAlive 方案
export const OptimizedApp: React.FC = () => {
  return (
    <KeepAliveProvider
      // 设置最大缓存数量，避免内存占用过多
      max={20}
      // 定义包含规则，只缓存需要的组件
      include={/^Tab-/}
      // 排除某些不需要缓存的组件
      exclude={/Modal|Popup/}
    >
    </KeepAliveProvider>
  );
};

// 标签内容组件
const TabContent: React.FC<{ tabName: string }> = ({ tabName }) => {
  // 使用懒加载减少初始加载
  const Component = React.lazy(() =>
    import(`./tabs/${tabName}`).catch(() =>
      import('./tabs/DefaultTab')
    )
  );

  return (
    <React.Suspense fallback={<div>加载中...</div>}>
      <Component />
    </React.Suspense>
  );
}; 
import type { Router } from 'react-router';

let router: typeof Router;

export function setRouter(r: typeof Router) {
  router = r;
}

if (import.meta && import.meta.hot) {
  import.meta.hot.on('routes-changed', () => {
    // 重新获取路由配置并更新
    import('virtual:generated-routes').then(({ routes }) => {
      // 更新路由配置
      // router.dispose();
      // 重新创建路由
      // TODO: 实现路由热更新逻辑
    });
  });
}

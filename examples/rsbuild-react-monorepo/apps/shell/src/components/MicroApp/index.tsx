import { useEffect } from 'react';
import { useRouteInjector } from '@/contexts/router.context';
import type { RouteObject } from 'react-router';

interface IRouteInjectorProps {
  routes: RouteObject[];
  namespace: string;
}

export function MicroApp({ routes, namespace }: IRouteInjectorProps) {
  const { inject, remove } = useRouteInjector(namespace);

  useEffect(() => {
    // 注入路由
    inject(routes);

    // 组件卸载时清理路由
    return () => {
      remove();
    };
  }, [inject, remove, routes]);

  return null;
}

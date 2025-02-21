import { useEffect } from 'react';
import { useRouteInjector } from '@/contexts/router.context';
import type { RouteObject } from 'react-router';

interface RouteInjectorProps {
	routes: RouteObject[];
	namespace: string;
	prefix?: string;
}

export function RouteInjector({ routes, namespace, prefix }: RouteInjectorProps) {
  const { inject, remove } = useRouteInjector(namespace, prefix);

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
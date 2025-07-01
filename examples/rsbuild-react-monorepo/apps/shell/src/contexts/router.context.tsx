import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { type RouteObject, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { findAndUpdateRoute } from '@/utils/router.util';

interface RouterContainer {
  /**
   * 注入新的路由配置
   * @param routes 要注入的路由配置
   * @param namespace 路由命名空间，用于后续移除
   * @param prefix 路由前缀，将路由注入到该前缀的 children 中
   */
  injectRoutes: (routes: RouteObject[], namespace: string, prefix?: string) => void;
  /**
   * 移除指定命名空间的路由配置
   * @param namespace 要移除的路由命名空间
   */
  removeRoutes: (namespace: string) => void;
  /**
   * 获取当前所有路由配置
   */
  getRoutes: () => RouteObject[];
}

const RouterContainerContext = createContext<RouterContainer | null>(null);

interface RouterContainerProviderProps {
  /**
   * 基础路由配置
   */
  baseRoutes: RouteObject[];
  /**
   * 路由器配置选项
   */
  routerOptions?: Parameters<typeof createBrowserRouter>[1];
}

export function RouterContainerProvider({
  baseRoutes,
  routerOptions,
}: RouterContainerProviderProps) {
  // 使用 Map 存储不同命名空间的路由配置
  const [routesMap, setRoutesMap] = useState<Map<string, RouteObject[]>>(
    new Map([['base', baseRoutes]])
  );

  const injectRoutes = useCallback((routes: RouteObject[], namespace: string) => {
    setRoutesMap((prev) => {
      const next = new Map(prev);

      if (namespace) {
        // 使用深度优先搜索查找并更新路由
        const baseRoutes = next.get('base') || [];
        const updatedBaseRoutes = findAndUpdateRoute(
          baseRoutes,
          namespace,
          (route) => ({
            ...route,
            children: [...(route.children || []), ...routes]
          } as RouteObject)
        );
        console.log("updatedBaseRoutes", updatedBaseRoutes);
        next.set('base', updatedBaseRoutes);
      } else {
        next.set(namespace, routes);
      }

      return next;
    });
  }, []);

  const removeRoutes = useCallback((namespace: string) => {
    setRoutesMap((prev) => {
      const next = new Map(prev);
      next.delete(namespace);
      return next;
    });
  }, []);

  const getRoutes = useCallback(() => {
    const allRoutes: RouteObject[] = [];

    routesMap.forEach((routes) => {
      allRoutes.push(...routes);
    });

    console.log("next allRoutes", allRoutes);

    return allRoutes;
  }, [routesMap]);

  // 合并所有路由配置并创建路由器
  const router = useMemo(() => {
    const allRoutes = getRoutes();
    return createBrowserRouter(allRoutes, routerOptions);
  }, [getRoutes, routerOptions]);

  const contextValue = useMemo(
    () => ({
      injectRoutes,
      removeRoutes,
      getRoutes,
    }),
    [injectRoutes, removeRoutes, getRoutes]
  );

  return (
    <RouterContainerContext.Provider value={contextValue}>
      <RouterProvider router={router} />
    </RouterContainerContext.Provider>
  );
}

export function useRouterContainer() {
  const context = useContext(RouterContainerContext);

  if (!context) {
    throw new Error('useRouterContainer must be used within a RouterContainerProvider');
  }

  return context;
}

// 导出一个便捷的 hook 用于注入和清理路由
export function useRouteInjector(namespace: string, prefix?: string) {
  const { injectRoutes, removeRoutes } = useRouterContainer();

  const inject = useCallback(
    (routes: RouteObject[]) => {
      injectRoutes(routes, namespace, prefix);
    },
    [injectRoutes, namespace, prefix]
  );

  const remove = useCallback(() => {
    removeRoutes(namespace);
  }, [removeRoutes, namespace]);

  return { inject, remove };
}

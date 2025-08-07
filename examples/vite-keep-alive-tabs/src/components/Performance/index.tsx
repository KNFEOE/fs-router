import { memo, Suspense, useEffect, type PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import { startTimer, endTimer } from '@/utils/performance.util';
import { useRoutePerformance } from '@/hooks/routeTransition.hook';
import { PerformancePanel } from '../RouteTransition';

// 示例：带性能监控的路由组件
export const PerformanceMonitoredRoute = memo(() => {
	useEffect(() => {
		// 监控组件加载时间
		startTimer("route-component-mount");

		// 使用 requestIdleCallback 在浏览器空闲时结束计时
		const idleCallback = requestIdleCallback(() => {
			endTimer("route-component-mount");
		});

		return () => {
			cancelIdleCallback(idleCallback);
		};
	}, []);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">性能监控示例页面</h1>
			<p>这个页面的加载时间正在被监控。</p>

			<Outlet />
		</div>
	);
});

// 示例：完整的性能监控布局
export const PerformanceMonitoringLayout = memo(
  ({ children }: PropsWithChildren) => {
    const routePerformance = useRoutePerformance();

    return (
      <div className="min-h-screen bg-gray-50">
        {/* 主要内容 */}
        <div className="container mx-auto px-4 py-8">
          {/* 性能状态指示器 */}
          <div className="mb-4 p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">实时性能监控</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {/* 路由状态 */}
              <div>
                <span className="font-medium">路由状态:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded ${
                    routePerformance.isTransitioning
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {routePerformance.isTransitioning ? '切换中' : '就绪'}
                </span>
              </div>

              {/* 当前路由 */}
              <div>
                <span className="font-medium">当前路由:</span>
                <span
                  className="ml-2 text-gray-600 truncate"
                  title={routePerformance.currentRoute}
                >
                  {routePerformance.currentRoute}
                </span>
              </div>
            </div>

            {/* 性能数据统计 */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold mb-2 text-gray-700">
                性能数据
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">路由渲染:</span>
                  <div className="text-lg font-mono">
                    {routePerformance.routeRenderTime
                      ? `${routePerformance.routeRenderTime.toFixed(2)}ms`
                      : '--'}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-600">路由切换:</span>
                  <div className="text-lg font-mono">
                    {routePerformance.lastTransitionDuration
                      ? `${routePerformance.lastTransitionDuration.toFixed(2)}ms`
                      : '--'}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-600">
                    路由切换次数:
                  </span>
                  <div className="text-lg font-mono">
                    {routePerformance.totalRouteChanges}
                  </div>
                </div>
              </div>
            </div>

            {/* 上一个路由信息 */}
            {routePerformance.previousRoute && (
              <div className="mt-2 text-xs text-gray-500">
                <span className="font-medium">上一路由:</span>{' '}
                {routePerformance.previousRoute}
              </div>
            )}
          </div>

          {/* 页面内容 */}
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
                  <p>加载中...</p>
                </div>
              </div>
            }
          >
            {children}
          </Suspense>
        </div>

        {/* 性能监控面板 (只在开发环境显示) */}
        <PerformancePanel />
      </div>
    );
  },
);

PerformanceMonitoredRoute.displayName = "PerformanceMonitoredRoute";
PerformanceMonitoringLayout.displayName = "PerformanceMonitoringLayout"; 
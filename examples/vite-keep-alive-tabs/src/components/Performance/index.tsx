import { memo, Suspense, useEffect } from "react";
import { Outlet } from "react-router";
import { startTimer, endTimer } from "../../utils/performance.util";
import { useRouteTransition } from "../../hooks/routeTransition.hook";
import {
	RouteProgressBar,
	PerformancePanel,
	RouteLoadingOverlay,
} from "../RouteTransition";

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
	({
		children,
	}: {
		children: React.ReactNode;
	}) => {
		const transitionState = useRouteTransition();

		return (
			<div className="min-h-screen bg-gray-50">
				{/* 路由进度条 */}
				<RouteProgressBar />

				{/* 路由加载覆盖层 */}
				<RouteLoadingOverlay />

				{/* 主要内容 */}
				<div className="container mx-auto px-4 py-8">
					{/* 性能状态指示器 */}
					<div className="mb-4 p-4 bg-white rounded-lg shadow">
						<h2 className="text-lg font-semibold mb-2">当前性能状态</h2>
						<div className="grid grid-cols-3 gap-4 text-sm">
							<div>
								<span className="font-medium">过渡状态:</span>
								<span
									className={`ml-2 px-2 py-1 rounded ${
										transitionState.isTransitioning
											? "bg-yellow-100 text-yellow-800"
											: "bg-green-100 text-green-800"
									}`}
								>
									{transitionState.isTransitioning ? "切换中" : "就绪"}
								</span>
							</div>
							<div>
								<span className="font-medium">加载状态:</span>
								<span
									className={`ml-2 px-2 py-1 rounded ${
										transitionState.isLoading
											? "bg-blue-100 text-blue-800"
											: "bg-gray-100 text-gray-800"
									}`}
								>
									{transitionState.isLoading ? "加载中" : "完成"}
								</span>
							</div>
							<div>
								<span className="font-medium">当前路由:</span>
								<span className="ml-2 text-gray-600">
									{transitionState.currentRoute}
								</span>
							</div>
						</div>
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
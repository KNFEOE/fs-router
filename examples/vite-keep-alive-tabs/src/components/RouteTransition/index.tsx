import { memo, useEffect, useState } from "react";
import { useRouteTransition } from "../../hooks/routeTransition.hook";
import { getPerformanceReport } from "../../utils/performance.util";

// 进度条组件
export const RouteProgressBar = memo(() => {
	const { isTransitioning, progress } = useRouteTransition();

	if (!isTransitioning) return null;

	return (
		<div className="fixed top-0 left-0 right-0 z-50">
			<div className="h-1 bg-blue-200">
				<div
					className="h-full bg-blue-500 transition-all duration-200 ease-out"
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	);
});

// 性能监控面板
export const PerformancePanel = memo(() => {
	const [isVisible, setIsVisible] = useState(false);
	const [performanceData, setPerformanceData] = useState<
		{ name: string; duration: number; startTime: number }[]
	>([]);
	const [tabSwitchTimes, setTabSwitchTimes] = useState<number[]>([]);

	useEffect(() => {
		// 每秒更新性能数据
		const interval = setInterval(() => {
			const report = getPerformanceReport();
			setPerformanceData(report);

			// 提取 tab 切换时间
			const tabTimes = report
				.filter((entry) => entry.name.includes("route-transition"))
				.map((entry) => entry.duration);
			setTabSwitchTimes(tabTimes);
		}, 3000);

		return () => clearInterval(interval);
	}, []);

	// 只在开发环境显示
	if (process.env.NODE_ENV !== "development") return null;

	return (
		<>
			{/* 切换按钮 */}
			<button
				type="button"
				onClick={() => setIsVisible(!isVisible)}
				className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
			>
				📊 性能监控
			</button>

			{/* 性能面板 */}
			{isVisible && (
				<div className="fixed bottom-16 right-4 bg-white border rounded-lg shadow-xl p-4 max-w-md max-h-96 overflow-auto z-50">
					<div className="flex justify-between items-center mb-4">
						<h3 className="font-bold">性能监控面板</h3>
						<button
							type="button"
							onClick={() => setIsVisible(false)}
							className="text-gray-500 hover:text-gray-700"
						>
							✕
						</button>
					</div>

					{/* Tab 切换性能统计 */}
					<div className="mb-4">
						<h4 className="font-semibold mb-2">Tab 切换性能 📈</h4>
						{tabSwitchTimes.length > 0 ? (
							<div className="text-sm space-y-1">
								<div>
									平均耗时:{" "}
									{(
										tabSwitchTimes.reduce((a, b) => a + b, 0) /
										tabSwitchTimes.length
									).toFixed(2)}
									ms
								</div>
								<div>最快: {Math.min(...tabSwitchTimes).toFixed(2)}ms</div>
								<div>最慢: {Math.max(...tabSwitchTimes).toFixed(2)}ms</div>
								<div>总次数: {tabSwitchTimes.length}</div>
							</div>
						) : (
							<div className="text-gray-500 text-sm">暂无数据</div>
						)}
					</div>

					{/* 详细性能数据 */}
					<div>
						<h4 className="font-semibold mb-2">详细性能数据 🔍</h4>
						<div className="max-h-40 overflow-auto">
							{performanceData.map((entry, index) => (
								<div key={index} className="text-xs p-2 border-b">
									<div className="font-medium">{entry.name}</div>
									<div className="text-gray-600">
										{entry.duration.toFixed(2)}ms
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	);
});

// 路由加载状态组件
export const RouteLoadingOverlay = memo(() => {
	const { isLoading, isTransitioning, currentRoute } = useRouteTransition();
	const [showDelay, setShowDelay] = useState(false);

	// 延迟显示 loading，避免闪烁
	useEffect(() => {
		if (isLoading || isTransitioning) {
			const timer = setTimeout(() => setShowDelay(true), 0);
			return () => clearTimeout(timer);
		}

		setShowDelay(false);
	}, [isLoading, isTransitioning]);

	if (!showDelay) return null;

	return (
		<div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center">
			<div className="text-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
				<div className="text-gray-600">加载中...</div>
				<div className="text-sm text-gray-400 mt-1">{currentRoute}</div>
			</div>
		</div>
	);
});

RouteProgressBar.displayName = "RouteProgressBar";
PerformancePanel.displayName = "PerformancePanel";
RouteLoadingOverlay.displayName = "RouteLoadingOverlay";
import React, { useState, useEffect, useMemo } from "react";
import { useRoutes, type RouteObject } from "react-router";
import { Spin, Result } from "antd";

// 使用 WeakMap 缓存路由配置
const routeCache = new Map<string, RouteObject[]>();

export function MicroApp({
	prefix,
	children,
}: { prefix: string; children?: React.ReactNode }) {
	const [routes, setRoutes] = useState<RouteObject[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	// 动态加载子应用路由
	useEffect(() => {
		let isMounted = true;

		const loadRemoteRoutes = async () => {
			try {
				if (routeCache.has(prefix)) {
					return routeCache.get(prefix);
				}

				// 动态加载子应用模块
				// @ts-ignore
				const remoteModule = await import("app_admin/routes");
				// 转换路由路径
				const processedRoutes = processRoutes(remoteModule.routes);
				// 添加404路由
				const currentAppRoutes = [
					{
						path: prefix,
						children: [
							...processedRoutes,
							{
								path: "*",
								element: (
									<Result status="404" title="404" subTitle="页面不存在" />
								),
							},
						],
					},
				];

				if (isMounted) {
					if (currentAppRoutes.length > 0) {
						console.log("currentAppRoutes: ", currentAppRoutes);
						// 缓存路由配置
						routeCache.set(prefix, currentAppRoutes);
						setRoutes(currentAppRoutes);
					}
					setLoading(false);
				}
			} catch (error) {
				console.log("error: ", error);
				if (isMounted) {
					setError(error as Error);
					setLoading(false);
				}
			}
		};

		loadRemoteRoutes();

		return () => {
			isMounted = false;
		};
	}, [prefix]);

	console.log("routes: ", routes);
	const element = useRoutes(routes);
	console.log("element: ", element);

	// 异常处理
	if (error) {
		console.log("error: ", error);

		return (
			<div className="p-4 text-red-500">子应用加载失败: {error.message}</div>
		);
	}

	return (
		<>
			{loading ? (
				<Spin size="large" />
			) : (
				<React.Suspense fallback={<Spin size="large" />}>
					{element || children}
				</React.Suspense>
			)}
		</>
	);
}

// 路由路径处理工具
function processRoutes(routes: RouteObject[]): RouteObject[] {
	const route = routes[0];
	if (route.path === "/") {
		// route.index = true
		route.path = "";
	}

	return routes;
}

import { Result, Spin } from "antd";
import { useState, useEffect } from "react";
import {
	type LoaderFunction,
	useRoutes,
	type RouteObject,
	type LoaderFunctionArgs,
	useMatches,
} from "react-router";

export interface MicroAppGatewayProps {
	prefix: string;
	routesLoader: () => Promise<RouteObject[]>;
}

const routesCache = new Map<string, RouteObject[]>();

export function MicroAppGateway({
	prefix,
	routesLoader,
}: MicroAppGatewayProps) {
	const [routes, setRoutes] = useState<RouteObject[]>(
		routesCache.get(prefix) || [],
	);
	const [loading, setLoading] = useState(routes.length === 0);

	// 动态加载子路由
	useEffect(() => {
		const load = async () => {
			const remoteRoutes = await routesLoader();
			const processedRoutes = processRoutes(remoteRoutes, prefix);

			setLoading(false);
			setRoutes(processedRoutes);
			routesCache.set(prefix, processedRoutes);

			console.log("remoteRoutes", remoteRoutes);
			console.log("processedRoutes", processedRoutes);
		};

		if (routes.length === 0) {
			load();
		}
	}, [prefix, routesLoader, routes.length]);

	const matched = useMatches();
	const element = useRoutes(routes);

	console.log("loading", loading);
	console.log("routes", routes);
	console.log("matched", matched);
	console.log("element", element);

	if (loading) {
		return (
			<div className="w-full h-full flex justify-center items-center">
				<Spin size="large" />
			</div>
		);
	}

	if (routes.length === 0) {
		return (
			<Result
				status="404"
				title={`No routes found for ${prefix}`}
				subTitle={`please check if ${prefix} is correctly configured`}
			/>
		);
	}

	return element;
}

// 路由路径处理器
const processRoutes = (routes: RouteObject[], prefix: string) => {
	return routes.map((route) => ({
		...route,
		path: route.path === "/" ? prefix : route.path,
		loader: route.loader
			? wrapLoader(route.loader as LoaderFunction<unknown>, prefix)
			: undefined, // 封装 loader 以隔离上下文
	}));
};

// 隔离子应用 loader 上下文
const wrapLoader = (loader: LoaderFunction<unknown>, prefix: string) => {
	return (args: LoaderFunctionArgs) => {
		// 注入子应用专属上下文
		const context = {
			isRunInShell: true,
			isMicroApp: true,
			prefix,
		};

		return loader?.({ ...args, context }) || null;
	};
};

import { Result, Spin } from "antd";
import { useState, useEffect } from "react";
import {
	useRoutes,
	type RouteObject,
	useMatches,
} from "react-router-dom";

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

			setLoading(false);
			setRoutes(remoteRoutes);
			routesCache.set(prefix, remoteRoutes);

			console.log("remoteRoutes", remoteRoutes);
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
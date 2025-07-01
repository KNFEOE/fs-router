import type { LoaderFunction, LoaderFunctionArgs, RouteObject } from "react-router-dom";

// 路由路径处理器
export const processRoutes = (routes: RouteObject[], namespace: string) => {
	return routes.map((route) => ({
		...route,
		path: route.path === "/" ? '' : route.path,
		loader: route.loader
			? wrapLoader(route.loader as LoaderFunction<unknown>, namespace)
			: undefined, // 封装 loader 以隔离上下文
	})) as RouteObject[];
};

// 隔离子应用 loader 上下文
export const wrapLoader = (loader: LoaderFunction<unknown>, namespace: string) => {
	return (args: LoaderFunctionArgs) => {
		// 注入子应用专属上下文
		const context = {
			isRunInShell: true,
			isMicroApp: true,
			namespace,
		};

		return loader?.({ ...args, context }) || null;
	};
};

/**
 * 深度优先搜索查找并更新路由
 * @param routes 路由配置数组
 * @param targetPath 目标路径
 * @param updater 更新函数
 * @returns 更新后的路由配置数组
 */
export const findAndUpdateRoute = (
	routes: RouteObject[],
	targetPath: string,
	updater: (route: RouteObject) => RouteObject
): RouteObject[] => {
	return routes.map(route => {
		// 检查当前路由
		if (route.path && route.path === targetPath) {
			return updater(route);
		}

		// 如果有子路由，递归处理
		if (route.children && route.children.length > 0) {
			return {
				...route,
				children: findAndUpdateRoute(route.children, targetPath, updater)
			};
		}

		return route;
	});
};

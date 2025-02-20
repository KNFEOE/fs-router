import type { RouteObject } from "react-router";

const replaceAbsoluteChildren = (
	routes: RouteObject[],
	defaultPath: string,
) => {
	return routes.map((route) => {
		if (route.path === "/") {
			route.path = defaultPath;
			route.index = undefined;
		}
		if (route.children?.length) {
			route.children = replaceAbsoluteChildren(route.children, defaultPath);
		}
		return route;
	});
};

// 使用资源加载模式
const routeResource = {
	adminRoutes: null as Promise<RouteObject[]> | null,
	load() {
		if (!this.adminRoutes) {
      // @ts-ignore
			this.adminRoutes = import("app_admin/routes")
				.then((module) => replaceAbsoluteChildren(module.routes, "admin") || [])
				.catch((err) => {
					console.error("Error loading admin routes:", err);
					return [];
				});
		}
		return this.adminRoutes;
	},
};

export function useRemoteRoutes() {
	return {
		read() {
			return routeResource.load();
		},
	};
}

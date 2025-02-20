import type { RouteObject } from "react-router";

export const loader = async () => {
  // @ts-ignore
  return import("app_admin/routes")
		.then((module) => module.routes as RouteObject[])
		.catch((error) => {
			console.error("Failed to load remote routes:", error);
			return [] as RouteObject[];
		});
};

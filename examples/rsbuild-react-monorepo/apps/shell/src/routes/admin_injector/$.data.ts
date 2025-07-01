import { processRoutes } from "@/utils/router.util";
import type { RouteObject } from "react-router-dom";

export const loader = async () => {
	console.log("admin$.data loader called");
	// @ts-ignore
	return import("app_admin/routes")
		.then((module) => processRoutes(module.routes as RouteObject[], "admin_injector"))
		.catch((error) => {
			console.error("Failed to load remote routes:", error);
			throw error;
		});
};

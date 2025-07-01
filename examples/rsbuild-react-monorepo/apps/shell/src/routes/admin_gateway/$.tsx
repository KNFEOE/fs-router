import React, { useEffect } from "react";
import { RouteObject } from "react-router-dom";
import { MicroAppGateway } from "@/components/MicroAppGateway";
import { processRoutes } from "@/utils/router.util";

const AdminContext = React.createContext({
	prefix: "admin",
	isShellRuntime: true,
});


export const loader = async () => {
	console.log("admin$.data loader called");
	// @ts-ignore
	return import("app_admin/routes")
		.then((module) => processRoutes(module.routes as RouteObject[], "admin"))
		.catch((error) => {
			console.error("Failed to load remote routes:", error);
			return [] as RouteObject[];
		});
};


export default function AdminPage() {
	useEffect(() => {
		console.log("into admin_gateway page");
	}, []);

	return (
		<AdminContext.Provider value={{ prefix: "admin", isShellRuntime: true }}>
			<div className="flex flex-col gap-4">
				<h1 className="text-2xl font-bold">This is admin page</h1>
				<div className="flex flex-col gap-2">
					<MicroAppGateway
						prefix="admin_gateway"
						routesLoader={loader}
					/>
				</div>
			</div>
		</AdminContext.Provider>
	);
}

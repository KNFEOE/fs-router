import React, { useEffect } from "react";
import { loader } from "./$.data";
import { RouteInjector } from "@/components/RouteInjector";
import { useLoaderData } from "react-router";

const AdminContext = React.createContext({
	prefix: "admin",
	isShellRuntime: true,
});

export default function AdminPage() {
	const routes = useLoaderData<Awaited<ReturnType<typeof loader>>>();

	useEffect(() => {
		console.log("after rendered routes", routes);
	}, [routes]);

	return (
		<AdminContext.Provider value={{ prefix: "admin", isShellRuntime: true }}>
			<div className="flex flex-col gap-4">
				<h1 className="text-2xl font-bold">This is admin page</h1>
				<div className="flex flex-col gap-2">
					<RouteInjector
						namespace="admin_injector"
						routes={routes}
					/>
				</div>
			</div>
		</AdminContext.Provider>
	);
}

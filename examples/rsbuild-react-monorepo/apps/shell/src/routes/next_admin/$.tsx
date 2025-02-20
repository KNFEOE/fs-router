// import { MicroApp } from "@/components/MicroApp";
import { MicroAppGateway } from "@/components/MicroAppGateway";
import React from "react";
import { loader } from "./$.data";

const AdminContext = React.createContext({
	prefix: "admin",
	isShellRuntime: true,
});

export default function AdminPage() {
	return (
		<AdminContext.Provider value={{ prefix: "admin", isShellRuntime: true }}>
			<div className="flex flex-col gap-4">
				<h1 className="text-2xl font-bold">This is admin page</h1>
				<div className="flex flex-col gap-2">
					<MicroAppGateway prefix="admin" routesLoader={loader}>
					</MicroAppGateway>
				</div>
			</div>
		</AdminContext.Provider>
	);
}

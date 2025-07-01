import { Outlet } from "react-router-dom";

export default function UsersLayout() {
	return (
		<div className="p-4 m-4 flex flex-col gap-4 border border-gray-200 rounded-lg">
			<h1>This is the user layout</h1>
			<Outlet />
		</div>
	);
}

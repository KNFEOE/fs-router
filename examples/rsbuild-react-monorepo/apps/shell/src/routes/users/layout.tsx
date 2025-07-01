import { Outlet } from "react-router-dom";

export default function UsersLayout() {
	return (
		<div className="p-4">
			<h1>This is the user layout</h1>
			<Outlet />
		</div>
	);
}

import { Outlet } from "react-router";

export default function UserLayout() {
	return (
		<div className="p-4">
			<h1>This is the user/:userId layout</h1>
			<Outlet />
		</div>
	);
}
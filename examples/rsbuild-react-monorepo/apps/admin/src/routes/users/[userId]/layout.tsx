import { Outlet } from "react-router";

export default function UserLayout() {
	return (
		<div className="p-4 m-4 border border-gray-300 rounded-md">
			<Outlet />
		</div>
	);
}
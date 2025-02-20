import { Outlet } from "react-router";

export default function AboutLayout() {
	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold">This is the about layout</h1>
      <div className="border-t border-gray-300 pt-4">
        <Outlet />
      </div>
		</div>
	);
}
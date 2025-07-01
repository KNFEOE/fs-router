import { NavLink, Link } from "react-router-dom";

export function Header() {
	const className = ({ isActive }: { isActive: boolean }) =>
		isActive
			? "text-blue-500 hover:text-blue-400"
			: "hover:text-blue-400";

	return (
		<div className="flex flex-col bg-gray-800 text-white gap-2 p-2">
			<nav className="flex gap-4 bg-gray-800 text-white">
				<h2 className="font-bold">Shell Routes: </h2>

				<div className="flex gap-4">
					<NavLink
						to="/"
						className={className}
					>
						Home
					</NavLink>
					<NavLink to="/users" className={className}>
						Users
					</NavLink>
					<NavLink to="/users/13431452" className={className}>
						Users/13431452
					</NavLink>
					<NavLink to="/not-found" className={className}>
						Not Found
					</NavLink>
				</div>
			</nav>

			<nav className="flex gap-4 bg-gray-800 text-white">
				<h2 className="font-bold">Admin Routes(injector-style): </h2>
				<div className="flex gap-4">
					<NavLink className={className} to="/admin_injector">Home</NavLink>
					<NavLink className={className} to="/admin_injector/about">About</NavLink>
					<NavLink className={className} to="/admin_injector/users">Users</NavLink>
					<NavLink className={className} to="/admin_injector/users/error">Error</NavLink>
					<NavLink className={className} to="/admin_injector/users/13431452">Users/13431452</NavLink>
					<NavLink className={className} to="/admin_injector/not-found">Not Found</NavLink>
				</div>
			</nav>

			<nav className="flex gap-4 bg-gray-800 text-white">
				<h2 className="font-bold">Admin Routes(gateway-style): </h2>
				<div className="flex gap-4">
					<NavLink to="/admin_gateway">Home</NavLink>
					<NavLink to="/admin_gateway/about">About</NavLink>
					<NavLink to="/admin_gateway/users">Users</NavLink>
					<NavLink to="/admin_gateway/users/13431452">
						Users/13431452
					</NavLink>
					<NavLink to="/admin_gateway/not-found">
						Not Found
					</NavLink>
				</div>
			</nav>
		</div>
	);
}

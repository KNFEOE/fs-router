import { NavLink, Link } from "react-router";

export function Header() {
  return (
			<nav className="flex justify-around gap-2 p-4 bg-gray-800 text-white">
				{/* NavLink makes it easy to show active states */}
				<NavLink
					to="/"
					className={({ isActive }) => (isActive ? "active" : "")}
				>
					Home
				</NavLink>

				<Link to="/about">About</Link>
				<Link to="/users">Users</Link>
				<Link to="/admin">Admin</Link>
				<Link to="/not-found">Not Found</Link>
				<Link to="/admin/users">Admin/Users</Link>
				<Link to="/admin/users/123">Admin/Users/123</Link>
				<Link to="/users/123">Users/123</Link>
			</nav>
		);
}

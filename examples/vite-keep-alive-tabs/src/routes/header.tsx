import { NavLink } from "react-router";
import { links } from "./links";

export default function Header() {
	return (
		<div className="bg-white shadow-md p-4">
			<div className="container max-w-screen-lg mx-auto flex justify-between items-center">
				<div>KeepAliveTabs</div>
				<nav className="flex justify-center">
					<ul className="flex gap-4">
						{links.map((link) => (
							<li key={link.value}>
								<NavLink to={link.value} className={({ isActive }) => isActive ? 'text-blue-500' : 'text-blue-200'}>{link.label}</NavLink>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</div>
	);
}
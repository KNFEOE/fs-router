import { NavLink } from "react-router";

export function Header() {
  const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-blue-500 font-bold" : "";

  return (
    <nav className="flex justify-around gap-2 p-4 bg-gray-800 text-white">
      {/* NavLink makes it easy to show active states */}
      <NavLink
        to="/"
        className={navLinkClassName}
      >
        Home
      </NavLink>

      <NavLink to="/about" className={navLinkClassName}>About</NavLink>
      <NavLink to="/users" className={navLinkClassName}>Users</NavLink>
      <NavLink to="/users/123" className={navLinkClassName}>Not Found</NavLink>
    </nav>
  );
}

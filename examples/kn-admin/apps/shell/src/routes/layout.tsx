import { DashboardLayout, Label, SvgColor } from "@kn-admin/shared";
import { Outlet } from "react-router";

const icon = (name: string) => (
	<SvgColor
		width="100%"
		height="100%"
		src={`/assets/icons/navbar/${name}.svg`}
	/>
);

export const navData = [
	{
		title: "Dashboard",
		path: "/dashboard",
		icon: icon("ic-analytics"),
	},
	{
		title: "User",
		path: "/user",
		icon: icon("ic-user"),
	},
	{
		title: "Product",
		path: "/product",
		icon: icon("ic-cart"),
		info: (
			<Label color="error" variant="inverted">
				+3
			</Label>
		),
	},
	{
		title: "Blog",
		path: "/blog",
		icon: icon("ic-blog"),
	},
	{
		title: "Sign in",
		path: "/sign-in",
		icon: icon("ic-lock"),
	},
	{
		title: "Not found",
		path: "/404",
		icon: icon("ic-disabled"),
	},
];

export default function Layout() {
	return (
		<DashboardLayout.DashboardLayout navData={navData}>
			<Outlet />
		</DashboardLayout.DashboardLayout>
	);
}

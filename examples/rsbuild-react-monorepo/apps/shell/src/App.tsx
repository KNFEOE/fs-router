import { Suspense, useEffect } from "react";
import { Result, Spin } from "antd";
import {
	type RouteObject,
	RouterProvider,
	createBrowserRouter,
} from "react-router";
import { routes } from "./routes";

const processRoutes = (routes: RouteObject[]) => {
	return routes.map((route) => {
		if (route.path === '/') {
			route.path = ''

			if (routes.length === 1) {
				route.index = true;
			}
		}

		return {
			...route,
		};
	});
};

(routes[0].children as RouteObject[]).push({
	path: "admin/*",
	async lazy() {
		// @ts-ignore
		const { routes } = await import("app_admin/routes");
		const processedRoutes = processRoutes(routes);
		console.log("admin processed routes: ", processedRoutes);

		return {
			element: <Suspense fallback="Loading Admin..." />,
			children: processedRoutes,
		};
	},
});

const router = createBrowserRouter([
	...routes,
	{
		path: "*",
		element: <Result status="404" title="404" subTitle="Shell 的页面不存在" />,
	},
]);

export default function App() {
	useEffect(() => {
		console.log("router: ", router);
		console.log("routes: ", router.routes);

		const unsubscribe = router.subscribe((state) => {
			console.log("state: ", state);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<Suspense
			fallback={
				<div
					style={{
						height: "100vh",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Spin size="large" />
				</div>
			}
		>
			<RouterProvider router={router} />
		</Suspense>
	);
}

import { Suspense, useEffect } from "react";
import { Result, Spin } from "antd";
import {
	Outlet,
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
    // 1. 动态加载子应用路由
		// @ts-ignore
    const adminModule = await import("app_admin/routes");
    // 2. 获取子应用路由配置
    const rawRoutes = processRoutes(adminModule.routes) as RouteObject[];
    // 3. 创建子应用路由容器组件
    const AdminLayout = () => (
      <Suspense fallback={<Spin size="large" />}>
        <Outlet /> {/* 关键：提供子路由渲染出口 */}
      </Suspense>
    );

    // 4. 构造完整子路由配置
    return {
      element: <AdminLayout />,
      children: [
				...rawRoutes,
				{
					path: "*",
					element: <Result status="404" title="404" subTitle="Admin 的页面不存在" />,
				}
			]
    };
  }
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

	useEffect(() => {

  const printRoutes = (routes: RouteObject[], prefix = '') => {
    routes.forEach(route => {
      console.log(`[Route] ${prefix}${route.path || '/'}`);

      if (route.children) {
        printRoutes(route.children, `${prefix}${route.path}/`);
      }
    });
  };

  printRoutes(router.routes);
}, [router]);

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

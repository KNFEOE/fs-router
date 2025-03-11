import {
	BrowserRouter,
	createBrowserRouter,
	RouterProvider,
	useRoutes,
} from "react-router";
import { routes } from "./routes";
import { Suspense } from "react";
import { ThemeProvider } from "@kn-admin/shared";

const router = createBrowserRouter(routes);
export default function App() {

	return (
		<ThemeProvider>
			<RouterProvider router={router} />
		</ThemeProvider>
	);
}

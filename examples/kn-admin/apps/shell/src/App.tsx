import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./routes";
import { ThemeProvider } from "@kn-admin/shared";
import "./app.css";

const router = createBrowserRouter(routes);

export default function App() {
	return (
		<ThemeProvider>
			<RouterProvider router={router} />
		</ThemeProvider>
	);
}

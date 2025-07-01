import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";

const rootEl = document.getElementById("root");
const router = createBrowserRouter([...routes]);

if (rootEl) {
	const root = ReactDOM.createRoot(rootEl);

	root.render(
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>,
	);
}

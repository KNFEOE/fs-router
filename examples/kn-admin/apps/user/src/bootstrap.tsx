import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router";

const rootElement = document.getElementById("root");

if (rootElement) {
	const root = ReactDOM.createRoot(rootElement);

	root.render(
		<React.StrictMode>
			<BrowserRouter basename="/user">
				<App />
			</BrowserRouter>
		</React.StrictMode>,
	);
}

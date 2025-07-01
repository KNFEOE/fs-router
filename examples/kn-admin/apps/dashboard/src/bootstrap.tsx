import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root");

if (rootElement) {
	const root = ReactDOM.createRoot(rootElement);

	root.render(
		<React.StrictMode>
			<BrowserRouter basename="/dashboard">
				<App />
			</BrowserRouter>
		</React.StrictMode>,
	);
}

import ReactDOM from "react-dom/client";
import {
	BrowserRouter,
	// createBrowserRouter,
	// RouterProvider,
	useRoutes,
} from "react-router";
// import App from "./App";
import { routes } from "./routes";
import "./index.css";

// const router = createBrowserRouter(routes);

// 创建一个包装组件作为导出
export const App = () => {
	return <>{useRoutes(routes)}</>;
};

// 渲染应用
const rootEl = document.getElementById("root");

if (rootEl) {
	const root = ReactDOM.createRoot(rootEl);

	root.render(
		<BrowserRouter>
			<App />
		</BrowserRouter>,
	);
}


import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";

// 创建一个包装组件作为导出
export const Bootstrap = () => {
	return (
		<BrowserRouter>
			<App />
		</BrowserRouter>
	);
};

// 渲染应用
const rootEl = document.getElementById("root");

if (rootEl) {
	const root = ReactDOM.createRoot(rootEl);
	root.render(<Bootstrap />);
}


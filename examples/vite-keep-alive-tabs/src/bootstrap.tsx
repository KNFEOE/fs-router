import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router';
import App from './App';

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


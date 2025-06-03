import { useRoutes } from "react-router";
import { routes } from "./routes";
import "./index.css";

export default function App() {
	return <>{useRoutes(routes)}</>;
}

import { Suspense } from "react";
import { Spin } from "antd";
import { routes } from "./routes";
import { RouterContainerProvider } from "./contexts/router.context";

export default function App() {
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
			<RouterContainerProvider baseRoutes={routes} />
		</Suspense>
	);
}

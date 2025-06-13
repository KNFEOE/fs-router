import { PerformanceMonitoringLayout } from "@/components/Performance";
import ContextLayout from "./ContextNodeCacheKeepAlive";
import ReactPortalKeepAliveLayout from "./ReactPortalKeepAlive";

export default function RootLayout() {
	return (
		<PerformanceMonitoringLayout>
			<ReactPortalKeepAliveLayout />
		</PerformanceMonitoringLayout>
	);
}

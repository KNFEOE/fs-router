import { lazy, Suspense } from "react";
import Fallback from "@/components/Fallback";

const RemoteDashboard = lazy(() => import("app_dashboard/App"));
export default function Dashboard() {
	return (
		<Suspense fallback={<Fallback />}>
			<RemoteDashboard />
		</Suspense>
	);
}

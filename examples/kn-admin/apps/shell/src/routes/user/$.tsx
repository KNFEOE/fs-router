import { lazy, Suspense } from "react";
import Fallback from "@/components/Fallback";

const RemoteUser = lazy(() => import("app_user/App" as ""));
export default function User() {
	return (
		<Suspense fallback={<Fallback />}>
			<RemoteUser />
		</Suspense>
	);
}

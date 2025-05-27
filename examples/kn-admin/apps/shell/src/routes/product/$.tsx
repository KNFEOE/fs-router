import { lazy, Suspense } from "react";
import Fallback from "@/components/Fallback";

const RemoteProduct = lazy(() => import("app_product/App" as ""));

export default function Product() {
	return (
		<Suspense fallback={<Fallback />}>
			<RemoteProduct />
		</Suspense>
	);
}

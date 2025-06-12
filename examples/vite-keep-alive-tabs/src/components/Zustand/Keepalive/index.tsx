import { memo } from "react";
import { useTabs } from "@/store/tabs.store";
import { KeepaliveCache } from "./KeepaliveCache";

export const Keepalive = memo(() => {
	const tabs = useTabs();

	return (
		<div key="keep-alive-wrapper" style={{ minHeight: "100vh" }}>
			{tabs.map((tab) => (
				<KeepaliveCache key={`${tab.url}:${tab.timestamp}`} {...tab} />
			))}
		</div>
	);
});

Keepalive.displayName = "Keepalive";
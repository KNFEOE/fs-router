import { useActiveTab, type TabItem } from "@/store/tabs.store";
import { memo } from "react";

export const KeepaliveCache = memo((tab: TabItem) => {
	const activeTab = useActiveTab();
	const isActive = activeTab === tab.url;

	return (
		<div
			style={{ display: isActive ? "block" : "none" }}
			className="keep-alive-content"
		>
			{tab.component}
		</div>
	);
});

KeepaliveCache.displayName = "KeepaliveCache";
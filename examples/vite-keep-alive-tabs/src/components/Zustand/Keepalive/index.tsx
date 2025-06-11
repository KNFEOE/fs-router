import { memo, useEffect } from "react";
import { useActiveTab, useTabs } from "@/store/tabsStore";
import { useCurrentPath } from "@/hooks/currentPath.hook";

export const Keepalive = memo(() => {
	const tabs = useTabs();
	const activeTab = useActiveTab();
	const currentPath = useCurrentPath();

	useEffect(() => {
		console.log("activeTab in Keepalive: ", activeTab);
	}, [activeTab]);

	useEffect(() => {
		console.log("currentPath in Keepalive: ", currentPath);
	}, [currentPath]);

	return (
		<div key="keep-alive-wrapper" style={{ minHeight: "100vh" }}>
			{tabs.map((tab) => {
				const key = `${tab.url}:::${tab.timestamp}`;
				const isActive = activeTab === tab.url;

				return (
					<div
						key={key}
						style={{ display: isActive ? "block" : "none" }}
						className="keep-alive-content"
					>
						{tab.component}
					</div>
				);
			})}
		</div>
	);
});

Keepalive.displayName = "Keepalive";
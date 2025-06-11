import { memo } from "react";
import { Tab } from "./Tab";
import { useTabs } from "@/store/tabsStore";

export const Tabs = memo(() => {
	const tabs = useTabs();

	return (
		<div className="flex items-center overflow-x-auto">
			{tabs.map((tab) => (
				<Tab key={tab.url} {...tab} />
			))}
		</div>
	);
});

Tabs.displayName = "Tabs";
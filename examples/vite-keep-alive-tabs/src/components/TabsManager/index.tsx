import { memo, useDeferredValue, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { TabsManagerContext, type TabItem } from "./provider";
import { useLocation, useOutlet } from "react-router";

export const TabsManager = memo(({ children }: PropsWithChildren) => {
  const outlet = useOutlet();
  const location = useDeferredValue(useLocation());
  const urlPath = useDeferredValue(useMemo(() => location.pathname + location.search, [location]));

  const [tabs, setTabs] = useState<TabItem[]>([]);
  const uiTabs = useDeferredValue(tabs);

  const contextValue = useMemo(() => ({
    tabs: uiTabs,
    setTabs,
    activeTab: urlPath,
  }), [uiTabs, urlPath]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Outlet is not a dependency of the effect
  useEffect(() => {
    setTabs((prev: TabItem[]) => {
      const filtered = prev.filter(tab => tab.keepalive);
      const existingTab = filtered.find(
        tab => tab.url === urlPath,
      );

      if (!existingTab) {
        // add new tab
        const newTab: TabItem = {
          url: urlPath,
          title: urlPath,
          timestamp: Date.now(),
          keepalive: true,
          component: outlet,
        };

        return [...filtered, newTab];
      }

      return filtered;
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlPath])

  return (
    <TabsManagerContext.Provider value={contextValue}>
      {children}
    </TabsManagerContext.Provider>
  )
})

TabsManager.displayName = 'TabsManager'
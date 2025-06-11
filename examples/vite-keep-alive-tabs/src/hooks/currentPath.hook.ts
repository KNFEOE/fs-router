import { useEffect, useMemo } from 'react';
import { useLocation, useOutlet } from 'react-router';
import { useActiveTab, useTabs, useTabsActions, type TabItem } from '../store/tabsStore';

export const useCurrentPath = () => {
  const outlet = useOutlet();
  const location = useLocation();

  const currentPath = useMemo(
    () => location.pathname + location.search,
    [location.pathname, location.search]
  );

  const tabs = useTabs();
  const actions = useTabsActions()
  const activeTab = useActiveTab();

  useEffect(() => {
    if (activeTab === currentPath) return

    const existingTab = tabs.find(tab => tab.url === currentPath);

    if (!existingTab) {
      const newTab: TabItem = {
        url: currentPath,
        title: currentPath,
        timestamp: Date.now(),
        keepalive: true,
        component: outlet,
      };

      actions.addTab(newTab);
    }

    actions.setActiveTab(currentPath);
  }, [currentPath, outlet, tabs, actions, activeTab]);

  return currentPath
};
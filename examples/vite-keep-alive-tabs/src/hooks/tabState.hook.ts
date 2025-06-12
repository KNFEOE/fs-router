import { useEffect } from 'react';
import { useOutlet } from 'react-router';
import { useActiveTab, useTabs, useTabsActions, type TabItem } from '../store/tabs.store';
import { useCurrentPath } from './currentPath.hook';

export const useTabState = () => {
  const outlet = useOutlet();
  const currentPath = useCurrentPath();

  const tabs = useTabs();
  const actions = useTabsActions()
  const activeTab = useActiveTab();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath, tabs, actions, activeTab]);

  return currentPath
};
import { useEffect, useTransition } from 'react';
import { useOutlet } from 'react-router-dom';
import { useActiveTab, useTabs, useTabsActions, type TabItem } from '../store/tabs.store';
import { useCurrentPath } from './currentPath.hook';

export const useTabState = () => {
  const outlet = useOutlet();
  const currentPath = useCurrentPath();
  const [isPending, startTransition] = useTransition();

  const tabs = useTabs();
  const actions = useTabsActions()
  const activeTab = useActiveTab();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (activeTab === currentPath) return

    const existingTab = tabs.find(tab => tab.url === currentPath);

    // 使用 startTransition 优化状态更新
    startTransition(() => {
      if (!existingTab) {
        const newTab: TabItem = {
          url: currentPath,
          title: currentPath,
          timestamp: Date.now(),
          keepalive: true,
          isPending: isPending, // 设置初始 pending 状态
          component: outlet,
        };

        actions.addTab(newTab);
      }

      // 设置当前 Tab 为 pending 状态
      actions.setTabPending(currentPath, isPending);
      actions.setActiveTab(currentPath);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath, tabs, actions, activeTab, isPending]);

  // 监听 isPending 变化，更新当前活跃 Tab 的状态
  useEffect(() => {
    if (activeTab) {
      actions.setTabPending(activeTab, isPending);
    }
  }, [isPending, activeTab, actions]);

  return { currentPath, isPending }
};
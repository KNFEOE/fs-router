import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface TabItem {
  url: string;
  title: string;
  timestamp: number;
  keepalive: boolean;
  component?: React.ReactNode;
}

interface TabsState {
  tabs: TabItem[];
  activeTab: string;
}

interface TabsActions {
  setTabs: (tabs: TabItem[]) => void;
  setActiveTab: (activeTab: string) => void;
  addTab: (tab: TabItem) => void;
  removeTab: (url: string) => void;
  updateTabTitle: (url: string, title: string) => void;
}

export interface TabsStore extends TabsState {
  actions: TabsActions;
};

export const useTabsStore = create<TabsStore>()(
  subscribeWithSelector((set) => ({
    // 状态
    tabs: [],
    activeTab: '',

    // 操作方法集合
    actions: {
      setTabs: (tabs: TabItem[]) => set({ tabs }),

      setActiveTab: (activeTab: string) => set({ activeTab }),

      addTab: (newTab: TabItem) => set((state) => {
        const existingTabIndex = state.tabs.findIndex(tab => tab.url === newTab.url);

        if (existingTabIndex >= 0) {
          // 更新现有 tab
          const updatedTabs = [...state.tabs];
          updatedTabs[existingTabIndex] = { ...updatedTabs[existingTabIndex], ...newTab };
          return { tabs: updatedTabs };
        }

        // 添加新 tab
        return { tabs: [...state.tabs, newTab] };
      }),

      removeTab: (url: string) => set((state) => ({
        tabs: state.tabs.filter(tab => tab.url !== url)
      })),

      updateTabTitle: (url: string, title: string) => set((state) => ({
        tabs: state.tabs.map(tab =>
          tab.url === url ? { ...tab, title } : tab
        )
      }))
    }
  }))
);

export const useTab = (url: string) => useTabsStore(state => state.tabs.find(tab => tab.url === url))
export const useTabs = () => useTabsStore(state => state.tabs);
export const useIsExistTab = (url: string) => useTabsStore(state => state.tabs.find(tab => tab.url === url))

export const useActiveTab = () => useTabsStore(state => state.activeTab);
export const useIsActiveTab = (url: string) => useTabsStore((state) => state.activeTab === url)

export const useTabsActions = () => useTabsStore(state => state.actions);
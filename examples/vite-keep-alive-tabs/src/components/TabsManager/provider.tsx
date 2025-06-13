import { createContext, useContext } from "react";

export interface TabItem {
  url: string;
  title: string;
  timestamp: number;
  keepalive: boolean;
  isPending?: boolean;
  component?: React.ReactNode;
}

export const TabsManagerContext = createContext<{
  tabs: TabItem[];
  activeTab: string;
  setTabs: (tabs: TabItem[]) => void;
  isPending: boolean;
}>({
  tabs: [],
  activeTab: '',
  setTabs: () => {},
  isPending: false,
});

export const useTabsManager = () => {
  const context = useContext(TabsManagerContext);

  if (!context) {
    throw new Error("useTabsManager must be used within a TabsManager");
  }

  return context;
}
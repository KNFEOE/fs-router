import { createContext, useContext } from "react";

export interface TabItem {
  url: string;
  title: string;
  timestamp: number;
  keepalive: boolean;
  component?: React.ReactNode;
}

export const TabsManagerContext = createContext<{
  tabs: TabItem[];
  activeTab: string;
  setTabs: (tabs: TabItem[]) => void;
}>({
  tabs: [],
  activeTab: "",
  setTabs: () => { },
});

export const useTabsManager = () => {
  const context = useContext(TabsManagerContext);

  if (!context) {
    throw new Error("useTabsManager must be used within a TabsManager");
  }

  return context;
}
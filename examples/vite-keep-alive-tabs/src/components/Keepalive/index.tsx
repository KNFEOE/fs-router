import { memo } from "react";
import { useTabsManager } from "../TabsManager/provider";

export const Keepalive = memo(() => {
  const { tabs, activeTab } = useTabsManager();

  return <div key="keep-alive-wrapper" style={{ minHeight: '100vh' }}>
    {
      tabs.map(tab => {
        const key = `${tab.url}:::${tab.timestamp}`
        const isActive = activeTab === tab.url;

        return (
          <div key={key} style={{ display: isActive ? 'block' : 'none' }} className="keep-alive-content">
            {tab.component}
          </div>
        )
      })
    }
  </div>
});

Keepalive.displayName = "Keepalive";
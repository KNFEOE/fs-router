import { useTabsManager, type TabItem } from "@/components/TabsManager/provider"
import { useCallback } from "react"

export const useActivity = () => {
  const { setTabs } = useTabsManager()
  const refresh = useCallback((url: string) => {
    setTabs((tabs: TabItem[]) => {
      const tab = tabs.find((item: TabItem) => item.url === url)

      if (tab?.url) {
        tab.timestamp = Date.now()
      }

      return tabs
    })
  }, [setTabs])

  return {
    refresh
  }
}
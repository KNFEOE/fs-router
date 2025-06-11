import { memo } from "react"
import { useTabsManager } from "../TabsManager/provider"
import { Tab } from "./Tab"

export const Tabs = memo(() => {
  const { tabs } = useTabsManager()

  return (<div className="flex items-center overflow-x-auto">
    {
      tabs.map(tab => (
        <Tab key={tab.url} {...tab} />
      ))
    }
  </div>)
})

Tabs.displayName = 'Tabs'
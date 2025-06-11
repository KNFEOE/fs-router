import { memo } from "react"
import { useTabsManager, type TabItem } from "../TabsManager/provider"
import { cn } from "@/utils/tailwind.util"
import { Link } from "react-router"

export const Tab = memo((tab: TabItem) => {
  const { activeTab } = useTabsManager()

  return (
    <Link key={tab.url} to={tab.url} className={
      cn(
        activeTab === tab.url ? 'text-blue-500' : 'text-gray-950',
        'px-4 py-2 rounded-md border',
        'cursor-pointer',
        'hover:bg-gray-200'
      )
    }>
      {tab.title}
    </Link>
  )
})

Tab.displayName = 'Tab'
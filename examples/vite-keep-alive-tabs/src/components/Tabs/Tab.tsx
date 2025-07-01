import { memo } from "react"
import { useTabsManager, type TabItem } from "../TabsManager/provider"
import { cn } from "@/utils/tailwind.util"
import { Link } from 'react-router-dom-dom';

export const Tab = memo((tab: TabItem) => {
  const { activeTab, isPending } = useTabsManager();
  const isCurrentTabPending = isPending && activeTab === tab.url;

  return (
    <Link
      key={tab.url}
      to={tab.url}
      className={cn(
        activeTab === tab.url ? 'text-blue-500' : 'text-gray-950',
        'px-4 py-2 rounded-md border',
        'cursor-pointer',
        'hover:bg-gray-200',
        'relative',
        isCurrentTabPending && 'opacity-70',
      )}
    >
      {tab.title}
      {isCurrentTabPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </Link>
  );
})

Tab.displayName = 'Tab'
import { memo } from "react";
import { useActiveTab, useTabPending, type TabItem } from '@/store/tabs.store';
import { cn } from "@/utils/tailwind.util";
import { Link } from "react-router";

export const Tab = memo((tab: TabItem) => {
	const activeTab = useActiveTab();
  const isPending = useTabPending(tab.url);
const isActive = activeTab === tab.url;

	return (
  <Link
    key={tab.url}
    to={tab.url}
    className={cn(
      isActive ? 'text-blue-500' : 'text-gray-950',
      'px-4 py-2 rounded-md border',
      'cursor-pointer',
      'hover:bg-gray-200',
    )}
  >
    {isPending ? 'loading...' : tab.title}

    {/* 加载状态指示器 */}
    {isPending && (
      <div
        className="loading-spinner"
        style={{
          width: '12px',
          height: '12px',
          border: '2px solid #f3f3f3',
          borderTop: '2px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
    )}
  </Link>
);
});

Tab.displayName = "Tab";
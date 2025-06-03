import { useEffect } from "react";
import { useState } from "react";
import { KeepAlive } from "react-keep-alive";

// 标签管理器组件
export const TabManager: React.FC = () => {
  const [tabs] = useState<string[]>(['Tab-1', 'Tab-2']);
  const [activeTab, setActiveTab] = useState('Tab-1');

  // 定期清理不活跃的标签
  useEffect(() => {
    const timer = setInterval(() => {
      // 检查并清理超过 10 分钟未激活的标签
      cleanInactiveTabs();
    }, 60000); // 每分钟检查一次

    return () => clearInterval(timer);
  }, []);

  const cleanInactiveTabs = () => {
    // 实现清理逻辑
  };

  return (
    <div>
      <div className="tab-headers">
        {tabs.map(tab => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'active' : ''}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tabs.map(tab => (
          <KeepAlive
            key={tab}
            name={tab}
            // 只在激活时渲染
            disabled={activeTab !== tab}
          >
            {activeTab === tab && <TabContent tabName={tab} />}
          </KeepAlive>
        ))}
      </div>
    </div>
  );
};

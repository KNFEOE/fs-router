import React, { useState } from 'react';
import CodeExample from './CodeExample';

interface ConfigItem {
  name: string;
  language: string;
  code: string;
  filename?: string;
  description?: string;
}

interface ConfigComparisonProps {
  configs: ConfigItem[];
  title?: string;
  defaultTab?: string;
}

const ConfigComparison: React.FC<ConfigComparisonProps> = ({
  configs,
  title = "构建工具配置对比",
  defaultTab
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || configs[0]?.name || '');

  const activeConfig = configs.find(config => config.name === activeTab);

  const getTabIcon = (name: string) => {
    const icons: Record<string, string> = {
      'Vite': '⚡',
      'Webpack': '📦',
      'Rspack': '🚀',
      'Rollup': '🎯',
      'Parcel': '📮',
      'esbuild': '⚡',
      'SWC': '🦀',
      'Turbopack': '🌪️'
    };
    return icons[name] || '🔧';
  };

  if (!configs.length) {
    return (
      <div className="config-comparison-empty">
        <p>暂无配置示例</p>
      </div>
    );
  }

  return (
    <div className="config-comparison-container">
      {title && (
        <div className="config-comparison-title">
          <h3>{title}</h3>
        </div>
      )}
      
      <div className="config-comparison-tabs">
        {configs.map((config) => (
          <button
            key={config.name}
            className={`config-tab ${activeTab === config.name ? 'active' : ''}`}
            onClick={() => setActiveTab(config.name)}
          >
            <span className="config-tab-icon">
              {getTabIcon(config.name)}
            </span>
            <span className="config-tab-name">
              {config.name}
            </span>
          </button>
        ))}
      </div>

      <div className="config-comparison-content">
        {activeConfig && (
          <div className="config-item">
            {activeConfig.description && (
              <div className="config-description">
                <p>{activeConfig.description}</p>
              </div>
            )}
            <CodeExample
              language={activeConfig.language}
              code={activeConfig.code}
              filename={activeConfig.filename}
              showCopy={true}
              showLineNumbers={false}
            />
          </div>
        )}
      </div>

      <div className="config-comparison-footer">
        <div className="config-stats">
          <span className="config-count">
            {configs.length} 个配置示例
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConfigComparison;
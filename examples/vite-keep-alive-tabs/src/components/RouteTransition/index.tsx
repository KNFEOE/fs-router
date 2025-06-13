import { memo, useEffect, useState } from 'react';
import {
  getPerformanceReport,
  sumOfPerformanceDuration,
  type Performance,
} from '@/utils/performance.util';

// 性能监控面板
export const PerformancePanel = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [performanceData, setPerformanceData] = useState<Performance[]>([]);

  // 使用新的性能监控Hook
  useEffect(() => {
    // 每3秒更新一次详细性能数据
    const interval = setInterval(() => {
      const report = getPerformanceReport();
      setPerformanceData(report);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const values = Object.values(performanceData);
  const sumOfDuration = values.length ? sumOfPerformanceDuration(values) : 0;
  const avgDuration = values.length ? sumOfDuration / values.length : 0;

  // 只在开发环境显示
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      {/* 切换按钮 */}
      <button
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 hover:from-blue-600 hover:to-purple-700 transition-all"
      >
        渲染性能
      </button>

      {/* 性能面板 */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 bg-white border rounded-lg shadow-xl p-4 max-w-lg max-h-96 overflow-auto z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">渲染性能</h3>
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
          </div>

          {/* 路由性能统计 */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-blue-600">🚀 路由性能</h4>
            <div className="grid gap-2 text-sm">
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-xs text-gray-600">平均渲染时间</div>
                <div className="font-mono font-bold">
                  {avgDuration.toFixed(2)}ms
                </div>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-xs text-gray-600">总切换次数</div>
                <div className="font-mono font-bold">{values.length}</div>
              </div>
            </div>
          </div>

          {/* 详细性能数据 */}
          <div>
            <h4 className="font-semibold mb-2 text-gray-600">🔍 详细数据</h4>
            <div className="max-h-32 overflow-auto bg-gray-50 rounded p-2">
              {performanceData.length > 0 ? (
                performanceData.slice(-5).map((entry, index) => (
                  <div
                    key={`${entry.name}-${entry.startTime}-${index}`}
                    className="text-xs p-1 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="font-medium truncate" title={entry.name}>
                      {entry.name}
                    </div>
                    <div className="text-gray-600 font-mono">
                      {entry.duration.toFixed(2)}ms
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-500 text-center py-2">
                  暂无性能数据
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

PerformancePanel.displayName = 'PerformancePanel';

// 性能监控工具
const timers = new Map<string, number>();

/**
 * 开始计时
 */
export const startTimer = (name: string) => {
  timers.set(name, performance.now());
  performance.mark(`${name}-start`);
};

/**
 * 结束计时并返回耗时
 */
export const endTimer = (name: string): number => {
  const startTime = timers.get(name);
  if (!startTime) {
    console.warn(`Timer ${name} not found`);
    return 0;
  }

  const endTime = performance.now();
  const duration = endTime - startTime;

  performance.mark(`${name}-end`);
  performance.measure(name, `${name}-start`, `${name}-end`);

  timers.delete(name);

  // 在开发环境下输出性能日志
  if (process.env.NODE_ENV === 'development') {
    console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
  }

  return duration;
};

/**
 * 测量函数执行时间
 */
export const measureAsync = <T>(name: string, fn: () => Promise<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    startTimer(name);
    fn()
      .then((result) => {
        endTimer(name);
        resolve(result);
      })
      .catch((error) => {
        endTimer(name);
        reject(error);
      });
  });
};

/**
 * 测量同步函数执行时间
 */
export const measureSync = <T>(name: string, fn: () => T): T => {
  startTimer(name);
  try {
    const result = fn();
    endTimer(name);
    return result;
  } catch (error) {
    endTimer(name);
    throw error;
  }
};

/**
 * 获取性能指标报告
 */
export const getPerformanceReport = () => {
  const entries = performance.getEntriesByType('measure');
  const report = entries.map(entry => ({
    name: entry.name,
    duration: entry.duration,
    startTime: entry.startTime,
  }));

  console.table(report);
  return report;
};

/**
 * 清除性能数据
 */
export const clearPerformanceData = () => {
  performance.clearMarks();
  performance.clearMeasures();
  timers.clear();
};

/**
 * 监控路由变化性能
 */
export const monitorRouteChange = (from: string, to: string) => {
  const routeChangeId = `route-change-${from}-to-${to}`;
  startTimer(routeChangeId);
  return routeChangeId;
};

// React Hook 用于性能监控
export const usePerformanceMonitor = () => {
  return {
    startTimer,
    endTimer,
    measureAsync,
    getReport: getPerformanceReport,
    clearData: clearPerformanceData,
  };
};
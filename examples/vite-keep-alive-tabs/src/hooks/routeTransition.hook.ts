import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { startTimer, endTimer } from '@/utils/performance.util';

export interface RoutePerformanceData {
  currentRoute: string;
  previousRoute: string | null;
  isTransitioning: boolean;
  transitionStartTime: number | null;
  lastTransitionDuration: number | null;
  routeRenderTime: number | null;
  totalRouteChanges: number;
}

export const useRoutePerformance = () => {
  const location = useLocation();
  const [performanceData, setPerformanceData] = useState<RoutePerformanceData>({
    currentRoute: location.pathname + location.search,
    previousRoute: null,
    isTransitioning: false,
    transitionStartTime: null,
    lastTransitionDuration: null,
    routeRenderTime: null,
    totalRouteChanges: 0,
  });

  const transitionTimerRef = useRef<string | null>(null);
  const transitionStartRef = useRef<number | null>(null);

  // 监听路由变化并记录性能数据
  useEffect(() => {
    const currentPath = location.pathname + location.search;

    if (performanceData.currentRoute !== currentPath) {
      const startTime = performance.now();

      // 如果有上一次的过渡，计算耗时
      if (transitionStartRef.current !== null) {
        const transitionDuration = startTime - transitionStartRef.current;

        if (transitionTimerRef.current) {
          endTimer(transitionTimerRef.current);
        }

        setPerformanceData(prev => ({
          ...prev,
          lastTransitionDuration: transitionDuration,
          isTransitioning: false,
        }));
      }

      // 开始新的路由切换性能监控
      const timerId = `route-${Date.now()}-${currentPath}`;
      startTimer(timerId);
      transitionTimerRef.current = timerId;
      transitionStartRef.current = startTime;

      setPerformanceData(prev => ({
        ...prev,
        isTransitioning: true,
        previousRoute: prev.currentRoute,
        currentRoute: currentPath,
        transitionStartTime: startTime,
        totalRouteChanges: prev.totalRouteChanges + 1,
      }));
    }
  }, [location.pathname, location.search, performanceData.currentRoute]);

  // 监听组件挂载完成，记录渲染耗时
  useEffect(() => {
    if (performanceData.isTransitioning && transitionStartRef.current !== null) {
      // 使用 requestAnimationFrame 确保 DOM 更新完成后再测量
      requestAnimationFrame(() => {
        const startTime = transitionStartRef.current;
        if (startTime !== null) {
          const renderTime = performance.now() - startTime;

          if (transitionTimerRef.current) {
            endTimer(transitionTimerRef.current);
            transitionTimerRef.current = null;
          }

          setPerformanceData(prev => ({
            ...prev,
            isTransitioning: false,
            routeRenderTime: renderTime,
          }));

          transitionStartRef.current = null;
        }
      });
    }
  }, [performanceData.isTransitioning]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        endTimer(transitionTimerRef.current);
      }
    };
  }, []);

  return performanceData;
};

// Tab 切换性能统计 Hook
export const useTabSwitchPerformance = () => {
  const [tabPerformance, setTabPerformance] = useState<{
    activeTab: string | null;
    switchStartTime: number | null;
    lastSwitchDuration: number | null;
    totalSwitches: number;
  }>({
    activeTab: null,
    switchStartTime: null,
    lastSwitchDuration: null,
    totalSwitches: 0,
  });

  const startTabSwitch = useCallback((tabId: string) => {
    const startTime = performance.now();
    startTimer(`tab-switch-${tabId}`);

    setTabPerformance(prev => ({
      ...prev,
      activeTab: tabId,
      switchStartTime: startTime,
    }));
  }, []);

  const endTabSwitch = useCallback((tabId: string) => {
    setTabPerformance(prev => {
      if (prev.switchStartTime) {
        const duration = performance.now() - prev.switchStartTime;
        endTimer(`tab-switch-${tabId}`);

        return {
          ...prev,
          switchStartTime: null,
          lastSwitchDuration: duration,
          totalSwitches: prev.totalSwitches + 1,
        };
      }
      return prev;
    });
  }, []);

  return {
    ...tabPerformance,
    startTabSwitch,
    endTabSwitch,
  };
};

// 路由 Loader 性能统计 Hook
export const useRouteLoaderPerformance = () => {
  const [loaderPerformance, setLoaderPerformance] = useState<{
    isLoading: boolean;
    loadStartTime: number | null;
    lastLoadDuration: number | null;
    totalLoads: number;
  }>({
    isLoading: false,
    loadStartTime: null,
    lastLoadDuration: null,
    totalLoads: 0,
  });

  const startLoader = useCallback((loaderId: string) => {
    const startTime = performance.now();
    startTimer(`loader-${loaderId}`);

    setLoaderPerformance(prev => ({
      ...prev,
      isLoading: true,
      loadStartTime: startTime,
    }));
  }, []);

  const endLoader = useCallback((loaderId: string) => {
    setLoaderPerformance(prev => {
      if (prev.loadStartTime) {
        const duration = performance.now() - prev.loadStartTime;
        endTimer(`loader-${loaderId}`);

        return {
          ...prev,
          isLoading: false,
          loadStartTime: null,
          lastLoadDuration: duration,
          totalLoads: prev.totalLoads + 1,
        };
      }
      return prev;
    });
  }, []);

  return {
    ...loaderPerformance,
    startLoader,
    endLoader,
  };
};
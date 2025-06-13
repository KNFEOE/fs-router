import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigation } from 'react-router';
import { startTimer, endTimer } from '../utils/performance.util';

export interface RouteTransitionState {
  isTransitioning: boolean;
  isLoading: boolean;
  progress: number;
  error: string | null;
  currentRoute: string;
  previousRoute: string | null;
}

export const useRouteTransition = () => {
  const location = useLocation();
  // const navigation = useNavigation();
  const [transitionState, setTransitionState] = useState<RouteTransitionState>({
    isTransitioning: false,
    isLoading: false,
    progress: 0,
    error: null,
    currentRoute: location.pathname,
    previousRoute: null,
  });

  const transitionTimerRef = useRef<string | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 监听路由变化开始
  useEffect(() => {
    const currentPath = location.pathname + location.search;

    if (transitionState.currentRoute !== currentPath) {
      // 开始路由切换性能监控
      const timerId = `route-transition-${transitionState.currentRoute}-to-${currentPath}`;
      startTimer(timerId);
      transitionTimerRef.current = timerId;

      setTransitionState(prev => ({
        ...prev,
        isTransitioning: true,
        previousRoute: prev.currentRoute,
        currentRoute: currentPath,
        progress: 0,
        error: null,
      }));

      // 模拟进度条
      let progress = 0;
      progressTimerRef.current = setInterval(() => {
        progress += Math.random() * 15;
        if (progress < 90) {
          setTransitionState(prev => ({
            ...prev,
            progress: Math.min(progress, 90),
          }));
        }
      }, 100);
    }
  }, [location, transitionState.currentRoute]);

  // 监听导航状态
  useEffect(() => {
    const isLoading = false;

    setTransitionState(prev => ({
      ...prev,
      isLoading,
    }));

    // 如果加载完成，结束过渡
    if (!isLoading && transitionState.isTransitioning) {
      // 完成进度条
      setTransitionState(prev => ({
        ...prev,
        progress: 100,
      }));

      // 延迟结束过渡，让用户看到完成动画
      setTimeout(() => {
        if (transitionTimerRef.current) {
          endTimer(transitionTimerRef.current);
          transitionTimerRef.current = null;
        }

        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
          progressTimerRef.current = null;
        }

        setTransitionState(prev => ({
          ...prev,
          isTransitioning: false,
          progress: 0,
        }));
      }, 200);
    }
  }, [transitionState.isTransitioning]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  return transitionState;
};

// Hook 用于手动控制路由过渡
export const useRouteTransitionControl = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = (routeName: string) => {
    startTimer(`manual-route-${routeName}`);
    setIsTransitioning(true);
  };

  const endTransition = (routeName: string) => {
    endTimer(`manual-route-${routeName}`);
    setIsTransitioning(false);
  };

  return {
    isTransitioning,
    startTransition,
    endTransition,
  };
}; 
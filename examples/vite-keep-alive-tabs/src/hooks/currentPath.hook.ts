import { useMemo } from 'react';
import { useLocation } from 'react-router';

export const useCurrentPath = () => {
  const location = useLocation();

  const currentPath = useMemo(
    () => location.pathname + location.search,
    [location.pathname, location.search]
  );

  return currentPath
};
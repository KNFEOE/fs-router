/**
 * @overview
 * @author AEPKILL
 * @created 2025-02-11 19:26:23
 */
import { useMemo } from 'react';
import {
  useNavigate,
  parsePath,
  useRoutes,
  type NavigateOptions,
} from 'react-router';
import type { RouteType } from '../router-type';

export interface NavigationOptions extends NavigateOptions {}

export function useNavigation() {
  const navigate = useNavigate();

  const navigation = useMemo(() => {
    return {
      back() {
        return navigate(-1);
      },
      forward() {
        return navigate(1);
      },
      reload() {
        return location.reload();
      },
      push<Path extends keyof RouteType>(path: Path) {},
    };
  }, [navigate]);

  return navigation;
}

/**
 * 路由节点
 */
export interface RouteNode {
  id?: string;
  path?: string;
  _component?: string;
  loader?: string;
  config?: string;
  data?: string;
  clientData?: string;
  error?: string;
  loading?: string;
  children?: RouteNode[];
  index?: boolean;
  isRoot?: boolean;
  type?: 'nested';
  action?: string;
}

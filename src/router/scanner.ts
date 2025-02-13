import * as fs from 'fs';
import * as path from 'path';
import { NESTED_ROUTE } from './constants';

interface RouteNode {
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

/**
 * @class RouteScanner
 * @description The RouteScanner class is responsible for scanning the routes directory and generating the route tree.
 */
export class RouteScanner {
  private readonly routesDir: string;
  private readonly extensions = ['.js', '.jsx', '.ts', '.tsx'];
  private readonly entryName: string;
  private readonly isMainEntry: boolean;

  constructor(routesDir: string, entryName = 'main', isMainEntry = true) {
    this.routesDir = routesDir;
    this.entryName = entryName;
    this.isMainEntry = isMainEntry;
  }

  async scan(): Promise<RouteNode[]> {
    const route = await this.walkDirectory(this.routesDir);
    if (!route) return [];
    return this.optimizeRoute(route);
  }

  private async walkDirectory(dirname: string): Promise<RouteNode | null> {
    if (!await fs.promises.access(dirname).then(() => true).catch(() => false)) {
      return null;
    }

    const stats = await fs.promises.stat(dirname);
    if (!stats.isDirectory()) {
      return null;
    }

    const relativeDir = path.relative(this.routesDir, dirname);
    const pathSegments = relativeDir.split(path.sep);
    const lastSegment = pathSegments[pathSegments.length - 1];
    const isRoot = lastSegment === '';
    const isPathlessLayout = lastSegment.startsWith('__');
    const isWithoutLayoutPath = lastSegment.includes('.');

    let routePath = isRoot || isPathlessLayout ? '/' : `${lastSegment}`;
    if (isWithoutLayoutPath) {
      routePath = lastSegment.split('.').join('/');
    }
    routePath = this.replaceDynamicPath(routePath);

    const route: RouteNode = {
      path: routePath?.replace(/\$$/, '?'),
      children: [],
      isRoot,
      type: 'nested'
    };

    let pageFile = '';
    let pageLoader = '';
    let pageConfig = '';
    let pageClientData = '';
    let pageData = '';
    let pageAction = '';

    let splatFile = '';
    let splatLoader = '';
    let splatConfig = '';
    let splatClientData = '';
    let splatData = '';
    let splatAction = '';

    const entries = await fs.promises.readdir(dirname);

    for (const entry of entries) {
      const itemPath = path.join(dirname, entry);
      const extname = path.extname(entry);
      const itemWithoutExt = entry.slice(0, -extname.length);

      if (!this.isValidFile(entry)) continue;

      const relativePath = this.getRelativePath(itemPath);

      // Handle layout files
      if (itemWithoutExt === NESTED_ROUTE.LAYOUT_FILE) {
        route._component = relativePath;
      } else if (itemWithoutExt === NESTED_ROUTE.LAYOUT_LOADER_FILE) {
        route.loader = relativePath;
      } else if (itemWithoutExt === NESTED_ROUTE.LAYOUT_CONFIG_FILE) {
        route.config = relativePath;
      } else if (itemWithoutExt === NESTED_ROUTE.LAYOUT_CLIENT_LOADER) {
        route.clientData = relativePath;
      } else if (itemWithoutExt === NESTED_ROUTE.LAYOUT_DATA_FILE) {
        route.data = relativePath;
        if (await this.hasAction(itemPath)) {
          route.action = relativePath;
        }
      }
      // Handle page files
      else if (itemWithoutExt === NESTED_ROUTE.PAGE_FILE) {
        pageFile = relativePath;
      }
      // ... similarly handle other page and splat files ...

      // Handle error and loading
      else if (itemWithoutExt === NESTED_ROUTE.ERROR_FILE) {
        route.error = relativePath;
      } else if (itemWithoutExt === NESTED_ROUTE.LOADING_FILE) {
        route.loading = relativePath;
      }
    }

    // Process page and splat routes
    if (pageFile) {
      const pageRoute = this.createIndexRoute(pageFile, pageLoader, pageConfig, pageClientData, pageData, pageAction);
      route.children?.unshift(pageRoute);
    }

    if (splatFile) {
      const splatRoute = this.createSplatRoute(splatFile, splatLoader, splatConfig, splatClientData, splatData, splatAction);
      route.children?.push(splatRoute);
    }

    // Process children directories
    for (const entry of entries) {
      const childPath = path.join(dirname, entry);
      if ((await fs.promises.stat(childPath)).isDirectory()) {
        const childRoute = await this.walkDirectory(childPath);
        if (childRoute) {
          route.children?.push(childRoute);
        }
      }
    }

    // Generate route ID
    route.id = this.getRouteId(dirname);

    if (isPathlessLayout) {
      delete route.path;
    }

    route.children = route.children?.filter(Boolean);

    if (!route.children?.length && !route.index && !route._component) {
      return null;
    }

    if (isRoot && !route._component) {
      throw new Error('The root layout component is required');
    }

    return route;
  }

  private optimizeRoute(routeTree: RouteNode): RouteNode[] {
    if (!routeTree.children?.length) {
      return [routeTree];
    }

    if (!routeTree._component && !routeTree.error && !routeTree.loading && 
        !routeTree.config && !routeTree.clientData) {
      const newRoutes = routeTree.children.map(child => {
        const routePath = `${routeTree.path || ''}${child.path ? `/${child.path}` : ''}`;
        const newRoute: RouteNode = {
          ...child,
          path: routePath.replace(/\/\//g, '/'),
        };
        if (routePath.length > 0) {
          delete newRoute.index;
        } else {
          delete newRoute.path;
        }
        return newRoute;
      });
      return Array.from(new Set(newRoutes)).flatMap(route => this.optimizeRoute(route));
    }

    return [{
      ...routeTree,
      children: routeTree.children.flatMap(child => this.optimizeRoute(child))
    }];
  }

  private replaceDynamicPath(routePath: string): string {
    return routePath.replace(/\[(.*?)\]/g, ':$1');
  }

  private getRouteId(filepath: string): string {
    const relativePath = path.relative(this.routesDir, filepath);
    const pathWithoutExt = this.getPathWithoutExt(relativePath);

    return this.isMainEntry ?
      pathWithoutExt :
      `${this.entryName}_${pathWithoutExt}`.replace(/\[(.*?)\]/g, '($1)');
  }

  private isValidFile(filename: string): boolean {
    const ext = path.extname(filename);
    return this.extensions.includes(ext);
  }

  private getRelativePath(fullPath: string): string {
    return path.relative(this.routesDir, fullPath);
  }

  private getPathWithoutExt(filepath: string): string {
    return filepath.replace(/\.[^/.]+$/, '');
  }

  private async hasAction(filepath: string): Promise<boolean> {
    const content = await fs.promises.readFile(filepath, 'utf-8');
    return content.includes('export const action');
  }

  private createIndexRoute(pageFile: string, pageLoader: string, pageConfig: string, pageClientData: string, pageData: string, pageAction: string): RouteNode {
    return {
      path: '',
      _component: pageFile,
      loader: pageLoader,
      config: pageConfig,
      clientData: pageClientData,
      data: pageData,
      action: pageAction,
      index: true
    };
  }

  private createSplatRoute(splatFile: string, splatLoader: string, splatConfig: string, splatClientData: string, splatData: string, splatAction: string): RouteNode {
    return {
      path: '*',
      _component: splatFile,
      loader: splatLoader,
      config: splatConfig,
      clientData: splatClientData,
      data: splatData,
      action: splatAction
    };
  }
}
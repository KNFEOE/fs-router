import * as path from 'path';
import { RouteNode } from './type';

interface RouteCodeGeneratorOptions {
  splitting?: boolean;
  defaultErrorBoundary?: boolean; // 是否为所有路由添加默认错误边界
  defaultLoadingFallback?: any; // 是否为所有路由添加默认 Suspense Fallback
}

export class RouteCodeGenerator {
  private readonly options: RouteCodeGeneratorOptions;
  private imports: Set<string> = new Set();
  private loaderImports: Set<string> = new Set();
  private configImports: Set<string> = new Set();

  constructor(options?: RouteCodeGeneratorOptions) {
    this.options = {
      splitting: true,
      ...options
    };
  }

  generate(routes: RouteNode[]): string {
    const routeCode = this.generateRouteCode(routes);

    return this.wrapWithImports(routeCode);
  }

  private generateRouteCode(routes: RouteNode[]): string {
    const code = `export const routes = [
  ${routes.map(route => this.stringifyRoute(route)).join(',\n  ')}
];`;

    return JSON.parse(JSON.stringify(code, null, 2))
  }

  private stringifyRoute(route: RouteNode): string {
    const element = this.generateElementCode(route);
    const errorElement = this.generateErrorElement(route);
    const loader = this.generateLoaderCode(route);
    const action = this.generateActionCode(route);

    const routeObj = {
      path: route.path,
      index: route.index,
      element: element || undefined,
      errorElement: errorElement || undefined,
      loader: loader || undefined,
      action: action || undefined,
      children: undefined
    };

    // 处理子路由
    const childrenStr = route.children?.length ?
      `children: [${route.children.map(child => this.stringifyRoute(child)).join(',')}]` : '';

    // 合并所有属性
    const routeEntries = Object.entries(routeObj)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (key === 'path') return `${key}: '${value}'`;
        if (key === 'element') return `${key}: ${value}`;
        if (key === 'errorElement') return `${key}: ${value}`;
        return `${key}: ${value}`;
      });

    if (childrenStr) routeEntries.push(childrenStr);

    return `{
      ${routeEntries.join(',\n      ')}
    }`;
  }

  private generateElementCode(route: RouteNode): string {
    if (!route._component) return '';

    const chunkName = route.id || path.basename(route._component, path.extname(route._component));

    if (route.isRoot) {
      this.imports.add(`import RootLayout from '${route._component}';`);
      return 'RootLayout';
    }

    if (this.options.splitting) {
      const importPath = route._component;
      // 使用 loadable 进行代码分割
      return `loadable(() => import(/* webpackChunkName: "${chunkName}" */ '${importPath}'), {
        fallback: ${route.loading ? `loadable(() => import('${route.loading}'))` : this.options.defaultLoadingFallback || 'null'}
      })`;
    } else {
      const componentName = `Component_${this.imports.size}`;
      this.imports.add(`import ${componentName} from '${route._component}';`);
      return componentName;
    }
  }

  private generateErrorElement(route: RouteNode): string {
    if (!route.error) {
      return this.options.defaultErrorBoundary ? 'DefaultErrorBoundary' : '';
    }

    return `loadable(() => import('${route.error}'))`;
  }

  // 新增 action 处理
  private generateActionCode(route: RouteNode): string {
    if (!route.action) return '';

    const actionName = `action_${this.loaderImports.size}`;
    this.loaderImports.add(`import ${actionName} from '${route.action}';`);

    return actionName;
  }

  private generateLoaderCode(route: RouteNode): string {
    const loaders = [];

    // Handle data loader
    if (route.data) {
      const loaderName = `loader_${this.loaderImports.size}`;
      this.loaderImports.add(
        `import { loader as ${loaderName}${route.action ? `, action as ${loaderName}_action` : ''} } from '${route.data}';`
      );
      loaders.push(loaderName);
    }

    // Handle client data
    if (route.clientData) {
      const clientDataName = `clientData_${this.loaderImports.size}`;
      this.loaderImports.add(
        `import { loader as ${clientDataName} } from '${route.clientData}';`
      );
      loaders.push(clientDataName);
    }

    // Handle regular loader
    if (route.loader) {
      const loaderName = `loader_${this.loaderImports.size}`;
      this.loaderImports.add(`import ${loaderName} from '${route.loader}';`);
      loaders.push(loaderName);
    }

    if (loaders.length === 0) return '';

    // Combine multiple loaders if needed
    if (loaders.length > 1) {
      return `async (...args) => {
        const [${loaders.join(', ')}] = await Promise.all([${loaders.map(l => `${l}(...args)`).join(', ')}]);
        return { ...${loaders.join(', ...')} };
      }`;
    }

    return loaders[0];
  }

  private generateConfigCode(route: any): string {
    if (!route.config) return '';

    const configName = `config_${this.configImports.size}`;
    this.configImports.add(`import * as ${configName} from '${route.config}';`);
    return configName;
  }

  private wrapWithImports(routeCode: string): string {
    const runtimeImports = [];

    // 使用 loadable 替换 lazy
    runtimeImports.push(`import loadable from '@loadable/component';`);

    if (this.options.defaultErrorBoundary) {
      runtimeImports.push(`
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

function DefaultErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status} {error.statusText}</h1>
        <p>{error.data?.message}</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1>Oops!</h1>
      <p>Something went wrong</p>
    </div>
  );
}
`);
    }

    return `${runtimeImports.join('\n')}
${Array.from(this.imports).join('\n')}
${Array.from(this.loaderImports).join('\n')}
${Array.from(this.configImports).join('\n')}

${routeCode}`;
  }
}

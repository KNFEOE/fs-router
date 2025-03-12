import * as path from "node:path";
import type { RouteNode } from "./type";
import type { ActionFunction, LoaderFunction, RouteObject } from "react-router";

interface RouteCodeGeneratorOptions {
  splitting?: boolean;
}

export class RouteCodeGenerator {
  private readonly options: RouteCodeGeneratorOptions;
  /**
   * runtime imports
   * 使用 loadable 替换 lazy
   */
  private runtimeImports: Set<string> = new Set([
    `import loadable from '@loadable/component';`
  ]);
  /** loader imports */
  private loaderImports: Set<string> = new Set();
  /** loading imports */
  private loadingImports: Set<string> = new Set();
  /** error imports */
  private errorImports: Set<string> = new Set();
  /** config imports */
  private configImports: Set<string> = new Set();
  /** component declarations */
  private componentDeclarations: Set<string> = new Set();

  constructor(options?: RouteCodeGeneratorOptions) {
    this.options = {
      splitting: true,
      ...options,
    };
  }

  generate(routes: RouteNode[]): string {
    const routeCode = this.generateRouteCode(routes);

    return this.wrapWithImports(routeCode);
  }

  private generateRouteCode(routes: RouteNode[]): string {
    const code = `export const routes = [
  ${routes.map((route) => this.stringifyRoute(route)).join(",\n  ")}
];`;

    return JSON.parse(JSON.stringify(code, null, 2));
  }

  private stringifyRoute(route: RouteNode): string {
    const element = this.generateElementCode(route);
    const errorElement = this.generateErrorElement(route);
    const loader = this.generateLoaderCode(route) as unknown as LoaderFunction<any> | undefined;
    const action = this.generateActionCode(route) as unknown as ActionFunction<any> | undefined;

    const routeObj: RouteObject = {
      path: route.path,
      index: route.index,
      errorElement: errorElement || undefined,
      loader: loader || undefined,
      element: element || undefined,
      action: action || undefined,
      children: undefined,
    };

    // 处理子路由
    const childrenStr = route.children?.length
      ? `children: [${route.children.map((child) => this.stringifyRoute(child)).join(",")}]`
      : "";

    // 合并所有属性
    const routeEntries = Object.entries(routeObj)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (key === "path") return `${key}: '${value}'`;
        if (key === "element") return `${key}: ${value}`;
        if (key === "errorElement") return `${key}: ${value}`;
        return `${key}: ${value}`;
      });

    if (childrenStr) routeEntries.push(childrenStr);

    return `{
      ${routeEntries.join(",\n      ")}
    }`;
  }

  private generateElementCode(route: RouteNode): string {
    if (!route._component) return "";

    const chunkName =
      route.id ||
      path.basename(route._component, path.extname(route._component));

    if (route.isRoot) {
      this.runtimeImports.add(`import RootLayout from '${route._component}';`);
      return "<RootLayout />";
    }

    if (this.options.splitting) {
      const importPath = route._component;
      const componentName = `Component_${this.componentDeclarations.size}`;

      let loadingComponent = '';

      if (route.loading) {
        const loadingName = `Loading_${this.loadingImports.size}`;

        this.loadingImports.add(`import ${loadingName} from '${route.loading}';`);
        loadingComponent = `, { fallback: <${loadingName} /> }`;
      }

      // Define component using loadable for code splitting
      this.componentDeclarations.add(
        `const ${componentName} = loadable(() => import(/* webpackChunkName: "${chunkName}" */ '${importPath}')${loadingComponent});`
      );

      return `<${componentName} />`;
    }

    const componentName = `Component_${this.componentDeclarations.size}`;
    this.componentDeclarations.add(`import ${componentName} from '${route._component}';`);

    return `<${componentName} />`;
  }

  private generateErrorElement(route: RouteNode): string {
    if (!route.error) return "";

    const errorName = `Error_${this.errorImports.size}`;
    this.errorImports.add(`import ${errorName} from '${route.error}';`);

    return `<${errorName} />`;
  }

  // 新增 action 处理
  private generateActionCode(route: RouteNode): string {
    if (!route.action) return "";

    const actionName = `action_${this.loaderImports.size}`;
    this.loaderImports.add(`import ${actionName} from '${route.action}';`);

    return actionName;
  }

  // Do we need to handle route config? not yet maybe!
  private generateConfigCode(route: RouteNode): string {
    if (!route.config) return "";

    const configName = `config_${this.configImports.size}`;
    this.configImports.add(`import * as ${configName} from '${route.config}';`);

    return configName;
  }

  private generateLoaderCode(route: RouteNode): string {
    const loaders = [];

    // Handle data loader
    if (route.data) {
      const loaderName = `loader_${this.loaderImports.size}`;
      this.loaderImports.add(
        `import { loader as ${loaderName}${route.action ? `, action as ${loaderName}_action` : ""} } from '${route.data}';`,
      );
      loaders.push(loaderName);
    }

    // Handle client data
    if (route.clientData) {
      const clientDataName = `clientData_${this.loaderImports.size}`;
      this.loaderImports.add(
        `import { loader as ${clientDataName} } from '${route.clientData}';`,
      );
      loaders.push(clientDataName);
    }

    // Handle regular loader
    if (route.loader) {
      const loaderName = `loader_${this.loaderImports.size}`;
      this.loaderImports.add(`import ${loaderName} from '${route.loader}';`);
      loaders.push(loaderName);
    }

    if (loaders.length === 0) return "";

    // Combine multiple loaders if needed
    if (loaders.length > 1) {
      return `async (...args) => {
        const [${loaders.join(", ")}] = await Promise.all([${loaders.map((l) => `${l}(...args)`).join(", ")}]);
        return { ...${loaders.join(", ...")} };
      }`;
    }

    return loaders[0];
  }

  private wrapWithImports(routeCode: string): string {
    const runtimeImports = [
      ...Array.from(this.runtimeImports),
      ...Array.from(this.loaderImports),
      ...Array.from(this.configImports),
      ...Array.from(this.loadingImports),
      ...Array.from(this.errorImports),
    ];

    return `
${runtimeImports.join("\n")}
${this.componentDeclarations.size ? Array.from(this.componentDeclarations).join("\n") : ""}

${routeCode}`;
  }
}

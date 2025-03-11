import * as fs from "node:fs";
import * as path from "node:path";
import { NESTED_ROUTE, JS_EXTENSIONS } from "./constants";
import type { RouteNode } from "./type";
import {
	getPathWithoutExt,
	hasAction,
	replaceWithAlias,
	normalizeToPosixPath,
} from "./utils";

export interface AliasOptions {
	name: string;
	basename: string;
}

export interface ExtractorOptions {
	routesDir: string;
	entryName?: string;
	isMainEntry?: boolean;
	alias?: AliasOptions;
}

export type NestedRouteType = typeof NESTED_ROUTE;
export type ExtensionNameType = ".js" | ".jsx" | ".ts" | ".tsx";
export type ConventionNameType = NestedRouteType[keyof NestedRouteType];

const conventionNames: ConventionNameType[] = Object.values(NESTED_ROUTE);

/**
 * @class RouteExtractor
 * @description The RouteExtractor class is responsible for scanning the routes directory and generating the route tree.
 * @inspiration Thanks to {@link [Modern.js runtime/router](https://github.com/web-infra-dev/modern.js/blob/main/packages/runtime/plugin-runtime/src/router/cli/code/nestedRoutes.ts)} & Github Copilot
 */
export class RouteExtractor {
	private readonly routesDir: string;
	private readonly extensions = JS_EXTENSIONS;
	private readonly entryName: string;
	private readonly isMainEntry: boolean;
	private readonly alias: AliasOptions;

	constructor(options: ExtractorOptions) {
		this.routesDir = options.routesDir;
		this.entryName = options.entryName || "main";
		this.isMainEntry = options.isMainEntry ?? true;
		this.alias = options.alias || {
			name: "",
			basename: "",
		};
	}

	async extract(): Promise<RouteNode[]> {
		const route = await this.walkDirectory(this.routesDir);
		if (!route) return [];
		return this.optimizeRoute(route);
	}

	private async walkDirectory(dirname: string): Promise<RouteNode | null> {
		if (
			!(await fs.promises
				.access(dirname)
				.then(() => true)
				.catch(() => false))
		) {
			return null;
		}

		const stats = await fs.promises.stat(dirname);

		if (!stats.isDirectory()) {
			return null;
		}

		const alias = this.alias;
		const relativeDir = path.relative(this.routesDir, dirname);
		const pathSegments = relativeDir.split(path.sep);
		const lastSegment = pathSegments[pathSegments.length - 1];
		const isRoot = lastSegment === "";
		const isPathlessLayout = lastSegment.startsWith("__");
		const isWithoutLayoutPath = lastSegment.includes(".");

		let routePath = isRoot || isPathlessLayout ? "/" : `${lastSegment}`;

		if (isWithoutLayoutPath) {
			routePath = lastSegment.split(".").join("/");
		}

		routePath = this.replaceDynamicPath(routePath);

		const route: RouteNode = {
			path: routePath?.replace(/\$$/, "?"),
			children: [],
			isRoot,
			type: "nested",
		};

		let pageLoaderFile = "";
		let pageRoute = null;
		let pageConfigFile = "";
		let pageClientData = "";
		let pageData = "";
		let pageAction = "";

		let splatLoaderFile = "";
		let splatRoute = null;
		let splatConfigFile = "";
		let splatClientData = "";
		let splatData = "";
		let splatAction = "";

		const entries = await fs.promises.readdir(dirname);

		for (const entry of entries) {
			const entryPath = path.join(dirname, entry);
			const entryPathWithAlias = getPathWithoutExt(
				replaceWithAlias(alias.basename, entryPath, alias.name),
			);
			const extname = path.extname(entry) as ExtensionNameType;
			const entryWithoutExt = entry.slice(0, -extname.length);

			const isDirectory = (await fs.promises.stat(entryPath)).isDirectory();

			if (isDirectory) {
				const childRoute = await this.walkDirectory(entryPath);

				if (childRoute && !Array.isArray(childRoute)) {
					route.children?.push(childRoute);
				}
			}

			if (
				extname &&
				(!JS_EXTENSIONS.includes(extname) ||
					!conventionNames.includes(entryWithoutExt as ConventionNameType))
			) {
				continue;
			}

			if (entryWithoutExt === NESTED_ROUTE.LAYOUT_LOADER_FILE) {
				if (!route.loader) {
					route.loader = entryPathWithAlias;
				}
			}

			if (entryWithoutExt === NESTED_ROUTE.LAYOUT_CLIENT_LOADER) {
				route.clientData = entryPathWithAlias;
			}

			if (entryWithoutExt === NESTED_ROUTE.LAYOUT_DATA_FILE) {
				route.data = entryPathWithAlias;
				if (await hasAction(entryPath)) {
					route.action = entryPathWithAlias;
				}
			}

			if (entryWithoutExt === NESTED_ROUTE.LAYOUT_CONFIG_FILE) {
				if (!route.config) {
					route.config = entryPathWithAlias;
				}
			}

			if (entryWithoutExt === NESTED_ROUTE.LAYOUT_FILE) {
				route._component = entryPathWithAlias;
			}

			if (entryWithoutExt === NESTED_ROUTE.PAGE_LOADER_FILE) {
				pageLoaderFile = entryPathWithAlias;
			}

			if (entryWithoutExt === NESTED_ROUTE.PAGE_CLIENT_LOADER) {
				pageClientData = entryPathWithAlias;
			}

			if (entryWithoutExt === NESTED_ROUTE.PAGE_DATA_FILE) {
				pageData = entryPathWithAlias;
				if (await hasAction(entryPath)) {
					pageAction = entryPathWithAlias;
				}
			}

			if (entryWithoutExt === NESTED_ROUTE.PAGE_CONFIG_FILE) {
				pageConfigFile = entryPathWithAlias;
			}

			if (entryWithoutExt === NESTED_ROUTE.PAGE_FILE) {
				pageRoute = this.createIndexRoute(
					{
						_component: entryPathWithAlias,
					},
					entryPath,
				);

				if (pageLoaderFile) {
					pageRoute.loader = pageLoaderFile;
				}
				if (pageConfigFile) {
					pageRoute.config = pageConfigFile;
				}
				if (pageData) {
					pageRoute.data = pageData;
				}
				if (pageClientData) {
					pageRoute.clientData = pageClientData;
				}
				if (pageAction) {
					pageRoute.action = pageAction;
				}

				// Should ensure that the `page.tsx` has a higher priority than `__a/layout.tsx`
				route.children?.unshift(pageRoute);
			}

			if (entryWithoutExt === NESTED_ROUTE.SPLATE_LOADER_FILE) {
				splatLoaderFile = entryPathWithAlias;
			}

			if (entryWithoutExt === NESTED_ROUTE.SPLATE_CLIENT_DATA) {
				splatClientData = entryPathWithAlias;
			}

			if (entryWithoutExt === NESTED_ROUTE.SPLATE_CONFIG_FILE) {
				if (!route.config) {
					splatConfigFile = replaceWithAlias(
						alias.basename,
						entryPath,
						alias.name,
					);
				}
			}

			if (entryWithoutExt === NESTED_ROUTE.SPLATE_DATA_FILE) {
				splatData = entryPathWithAlias;
				if (await hasAction(entryPath)) {
					splatAction = entryPathWithAlias;
				}
			}

			if (entryWithoutExt === NESTED_ROUTE.SPLATE_FILE) {
				splatRoute = this.createRoute(
					{
						_component: entryPathWithAlias,
						path: "*",
					},
					entryPath,
				);

				if (splatLoaderFile) {
					splatRoute.loader = splatLoaderFile;
				}
				if (splatClientData) {
					splatRoute.clientData = splatClientData;
				}
				if (splatData) {
					splatRoute.data = splatData;
				}
				if (splatConfigFile) {
					splatRoute.config = splatConfigFile;
				}
				if (splatAction) {
					splatRoute.action = splatAction;
				}
				route.children?.push(splatRoute);
			}

			if (entryWithoutExt === NESTED_ROUTE.LOADING_FILE) {
				route.loading = entryPathWithAlias;
			}

			if (entryWithoutExt === NESTED_ROUTE.ERROR_FILE) {
				route.error = entryPathWithAlias;
			}
		}

		let finalRoute = this.createRoute(
			route,
			path.join(dirname, `${NESTED_ROUTE.LAYOUT_FILE}.ts`),
		);

		/**
		 * when the url is /, the __auth/layout.tsx component should not be rendered
		 * - routes
		 *  - __auth
		 *    - layout.tsx
		 *  - layout.tsx
		 */
		if (isPathlessLayout) {
			// biome-ignore lint/performance/noDelete: <explanation>
			delete finalRoute.path;
		}

		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		const childRoutes = (finalRoute.children = finalRoute.children?.filter(
			(childRoute) => childRoute,
		));

		if (
			childRoutes &&
			childRoutes.length === 0 &&
			!finalRoute.index &&
			!finalRoute._component
		) {
			return null;
		}

		/**
		 * Make sure access /user, which renders the user/$.tsx component
		 * - routes
		 *  - user
		 *    - $.tsx
		 *  - layout.tsx
		 */
		if (childRoutes && childRoutes.length === 1 && !finalRoute._component) {
			const childRoute = childRoutes[0];

			if (childRoute.path === "*") {
				const path = `${finalRoute.path || ""}/${childRoute.path || ""}`;

				finalRoute = {
					...childRoute,
					path,
				};
			}
		}

		if (isRoot && !finalRoute._component) {
			throw new Error(
				"The root layout component is required, make sure the routes/layout.tsx file exists.",
			);
		}

		return finalRoute;
	}

	private optimizeRoute(routeTree: RouteNode): RouteNode[] {
		if (!routeTree.children?.length) {
			return [routeTree];
		}

		if (
			!routeTree._component &&
			!routeTree.error &&
			!routeTree.loading &&
			!routeTree.config &&
			!routeTree.clientData
		) {
			const newRoutes = routeTree.children.map((child) => {
				const routePath = `${routeTree.path || ""}${child.path ? `/${child.path}` : ""}`;
				const newRoute: RouteNode = {
					...child,
					path: routePath.replace(/\/\//g, "/"),
				};

				// the index is removed when the route path exists
				if (routePath.length > 0) {
					// biome-ignore lint/performance/noDelete: <explanation>
					delete newRoute.index;
				} else {
					// biome-ignore lint/performance/noDelete: <explanation>
					delete newRoute.path;
				}

				return newRoute;
			});

			return Array.from(new Set(newRoutes)).flatMap((route) =>
				this.optimizeRoute(route),
			);
		}

		return [
			{
				...routeTree,
				children: routeTree.children.flatMap((child) =>
					this.optimizeRoute(child),
				),
			},
		];
	}

	private replaceDynamicPath(routePath: string): string {
		return routePath.replace(/\[(.*?)\]/g, ":$1");
	}

	private getRouteId(componentPath: string): string {
		const relativePath = normalizeToPosixPath(
			path.relative(this.routesDir, componentPath),
		);
		const pathWithoutExt = getPathWithoutExt(relativePath);

		let id = "";

		if (this.isMainEntry) {
			id = pathWithoutExt;
		} else {
			id = `${this.entryName}_${pathWithoutExt}`;
		}

		return id.replace(/\[(.*?)\]/g, "($1)");
	}

	private isValidFile(filename: string): boolean {
		const ext = path.extname(filename) as ".js" | ".jsx" | ".ts" | ".tsx";
		return this.extensions.includes(ext);
	}

	private getRelativePath(filepath: string): string {
		if (!this.alias) {
			return path.relative(this.routesDir, filepath);
		}

		return getPathWithoutExt(
			replaceWithAlias(this.alias.basename, filepath, this.alias.name),
		);
	}

	private createRoute(
		routeInfo: Partial<RouteNode>,
		componentPath: string,
	): RouteNode {
		const id = this.getRouteId(componentPath);

		return {
			...routeInfo,
			id,
			type: "nested",
		};
	}

	private createIndexRoute(
		routeInfo: Partial<RouteNode>,
		componentPath: string,
	): Partial<RouteNode> {
		return this.createRoute(
			{
				...routeInfo,
				index: true,
				children: undefined,
			},
			componentPath,
		);
	}

	private createSplatRoute(
		splatFile: string,
		splatLoader: string,
		splatConfig: string,
		splatClientData: string,
		splatData: string,
		splatAction: string,
	): RouteNode {
		return {
			path: "*",
			_component: splatFile,
			loader: splatLoader,
			config: splatConfig,
			clientData: splatClientData,
			data: splatData,
			action: splatAction,
		};
	}
}

import { glob } from "glob";
import path from "node:path";
import fs from "node:fs";
import { pathParser } from "../core/path-parser";

export interface RouteDirectory {
	/** 路由前缀 */
	prefix?: string;
	/** 路由目录路径 */
	path: string;
}

export interface TypeGenerateOptions {
	/** 类型文件输出路径 */
	routesTypeFile: string;
	/** 是否生成路由参数类型 */
	generateRouteParams?: boolean;
	/** 是否生成 Loader 类型 */
	generateLoaderTypes?: boolean;
	/** 路由目录配置 */
	routesDirectories?: Array<RouteDirectory>;
}

// 保持向后兼容
export type GenerateRouteTypeOptions = TypeGenerateOptions;

const GlobPattern = "**/page.{jsx,tsx}";
export async function generateRouteType(options: TypeGenerateOptions) {
	const { routesTypeFile, routesDirectories = [] } = options;

	const allFiles: string[] = [];

	for (const route of routesDirectories) {
		const relatedFiles = await glob(GlobPattern, {
			cwd: route.path,
		});

		allFiles.push(
			...relatedFiles.map((file) =>
				route.prefix ? path.join(route.prefix, file) : file,
			),
		);
	}

	const routeTypes = allFiles.map((path) => {
		const { route, params } = pathParser(path);

		return {
			route: route.startsWith("/") ? route : `/${route}`,
			params,
		};
	});

	const routeTypesContent = [
		`declare module "@feoe/fs-router" {`,
		"			interface RouteTypes {",
		...routeTypes.map((routeType) => {
			return `        "${routeType.route}": {};`;
		}),
		"			}",
		"		};",
		"export {};",
	].join("\n");

	fs.writeFileSync(routesTypeFile, routeTypesContent);
}

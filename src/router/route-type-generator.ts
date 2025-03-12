import { glob } from "glob";
import path from "node:path";
import fs from "node:fs";
import { pathParser } from "../core/path-parser";

export interface RouteDirectory {
	prefix?: string;
	path: string;
}
export type GenerateRouteTypeOptions = {
	routesTypeFile: string;
	routesDirectories: Array<RouteDirectory>;
};

const GlobPattern = "**/page.{jsx,tsx}";
export async function generateRouteType(options: GenerateRouteTypeOptions) {
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

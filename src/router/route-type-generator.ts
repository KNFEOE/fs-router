import { glob } from "glob";
import path from "node:path";
import fs from "node:fs";
import { pathParser } from "../core/path-parser";
export type GenerateRouteTypeOptions = {
	routesDirectory: string;
	routesTypeFile: string;
	relatedRoutesDirectories?: Record<string, string>;
};

const GlobPattern = "**/page.{jsx,tsx}";
export async function generateRouteType(options: GenerateRouteTypeOptions) {
	const {
		routesDirectory,
		routesTypeFile,
		relatedRoutesDirectories = {},
	} = options;

	const allFiles: string[] = [];

	const routeFiles = await glob(GlobPattern, {
		cwd: routesDirectory,
	});

	allFiles.push(...routeFiles);

	for (const prefix of Object.keys(relatedRoutesDirectories)) {
		const relatedFiles = await glob(GlobPattern, {
			cwd: relatedRoutesDirectories[prefix],
		});

		allFiles.push(...relatedFiles.map((file) => path.join(prefix, file)));
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

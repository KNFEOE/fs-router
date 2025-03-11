import { glob } from "glob";
import path from "node:path";
import fs from "node:fs";
import { pathParser } from "../core/path-parser";
export type GenerateRouteTypeOptions = {
	routesDirectory: string;
	relatedRoutesDirectories?: Record<string, string>;
};

const GlobPattern = "**/page.{jsx,tsx}";
export async function generateRouteType(options: GenerateRouteTypeOptions) {
	const { routesDirectory, relatedRoutesDirectories = {} } = options;

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

	const routesType = allFiles.map((path) => {
		const { route, params } = pathParser(path);

		const typeDefine = `{\n${params.map((param) => `    ${param.name}${param.optional ? "?" : ""}: string | number | boolean;`).join("\n")}\n  }`;
		return {
			route: route.startsWith("/") ? route : `/${route}`,
			params,
			typeDefine,
		};
	});

	const routeTypeContent = `export type RoutePaths = ${routesType
		.map((route) => `"${route.route}"`)
		.join(" | ")};`;

	let routeTypeFilePath = path.join(__dirname, "./types/route-type.d.ts");
	if (!fs.existsSync(routeTypeFilePath)) {
		routeTypeFilePath = path.join(__dirname, "../types/route-type.ts");
	}

	fs.writeFileSync(routeTypeFilePath, routeTypeContent);
}

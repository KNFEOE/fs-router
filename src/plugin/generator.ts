import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { PluginConfig } from "./config";
import { RouteExtractor, RouteCodeGenerator } from "../router";
import { generateRouteType } from "../router/route-type-generator";

export async function generator(config: PluginConfig) {
	// Extract routes
	const extractor = new RouteExtractor({
		routesDir: config.routesDirectory,
		alias: config.alias,
	});
	const routes = await extractor.extract();

	// Generate code
	const generator = new RouteCodeGenerator({
		splitting: config.splitting,
	});
	const code = generator.generate(routes);

	if (config.enableGeneration) {
		// Ensure directory exists
		await fs.mkdir(path.dirname(config.generatedRoutesPath), {
			recursive: true,
		});
		// Write generated code
		await fs.writeFile(config.generatedRoutesPath, code, "utf-8");
	}

	if (config.typeGenerateOptions?.enable) {
		const { routesTypeFile, relatedRoutesDirectories } =
			config.typeGenerateOptions;
		await generateRouteType({
			routesTypeFile,
			relatedRoutesDirectories,
			routesDirectory: config.routesDirectory,
		});
	}

	return code;
}

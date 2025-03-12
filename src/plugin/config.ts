import { resolve, isAbsolute, join } from "node:path";
import type { GenerateRouteTypeOptions } from "../router/route-type-generator";

export interface PluginConfig {
	routesDirectory: string;
	generatedRoutesPath: string;
	routeExtensions?: string[];
	enableGeneration?: boolean;
	alias?: {
		name: string;
		basename: string;
	};
	splitting?: boolean;
	defaultErrorBoundary?: boolean;

	typeGenerateOptions?: GenerateRouteTypeOptions;
}

export const defaultConfig: PluginConfig = {
	routesDirectory: "src/routes",
	generatedRoutesPath: "src/routes.tsx",
	routeExtensions: [".js", ".jsx", ".ts", ".tsx"],
	splitting: true,
	alias: {
		name: "@",
		basename: "src",
	},
	enableGeneration: true,
	defaultErrorBoundary: false,
	typeGenerateOptions: {
		routesDirectories: [],
		routesTypeFile: "src/routes-type.ts",
	},
};

export const getConfig = (
	options: Partial<PluginConfig>,
	root: string,
): PluginConfig => {
	const config = { ...defaultConfig, ...options };

	// Resolve absolute paths
	config.routesDirectory = isAbsolute(config.routesDirectory)
		? config.routesDirectory
		: resolve(root, join(root, config.routesDirectory));

	config.generatedRoutesPath = isAbsolute(config.generatedRoutesPath)
		? config.generatedRoutesPath
		: resolve(root, join(root, config.generatedRoutesPath));

	if (config.typeGenerateOptions) {
		const { routesTypeFile } = config.typeGenerateOptions;
		config.typeGenerateOptions.routesTypeFile = isAbsolute(routesTypeFile)
			? routesTypeFile
			: join(root, routesTypeFile);
	}

	return config;
};

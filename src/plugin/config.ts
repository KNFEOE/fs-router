import { resolve, isAbsolute, join } from "node:path";
import type { GenerateRouteTypeOptions } from "../router/route-type-generator";

export interface PluginConfig {
	/** 路由文件目录 */
	routesDirectory: string;
	/** 生成的路由文件路径 */
	generatedRoutesPath: string;
	/** 路由文件扩展名 */
	routeExtensions?: string[];
	/** 是否启用路由生成 */
	enableGeneration?: boolean;
	/** 路径别名配置 */
	alias?: {
		name: string;
		basename: string;
	};
	/** 是否启用代码分割 */
	splitting?: boolean;
	/** 是否启用默认错误边界 */
	defaultErrorBoundary?: boolean;
	/** 类型生成选项 */
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
		routesTypeFile: "src/routes-type.ts",
		routesDirectories: [],
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
		: resolve(root, config.routesDirectory);

	config.generatedRoutesPath = isAbsolute(config.generatedRoutesPath)
		? config.generatedRoutesPath
		: resolve(root, config.generatedRoutesPath);

	if (config.typeGenerateOptions) {
		const { routesTypeFile } = config.typeGenerateOptions;
		config.typeGenerateOptions.routesTypeFile = isAbsolute(routesTypeFile)
			? routesTypeFile
			: resolve(root, routesTypeFile);
	}

	return config;
};

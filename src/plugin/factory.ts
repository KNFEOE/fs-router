import type { UnpluginFactory } from "unplugin";
import path, { isAbsolute, normalize, resolve, join } from "node:path";
import type { ChokidarOptions, FSWatcher } from "chokidar";
import { generator } from "./generator";
import { defaultConfig, getConfig, type PluginConfig } from "./config";

const VIRTUAL_ROUTE_ID = "virtual:generated-routes";
const RESOLVED_VIRTUAL_ROUTE_ID = `\0${VIRTUAL_ROUTE_ID}`;
const PLUGIN_NAME = "unplugin:file-based-router-generator";

export interface RouterGeneratorPluginContext {
	root: string;
	config: PluginConfig;
	watcher: FSWatcher | null;
	lock: boolean;
	generated: boolean;
}

/**
 * Router generator plugin factory
 *
 * @description This factory is inspired by the `router-generator-plugin` from TanStack's `router` package.
 * @inspiration {@see @link [packages/router-plugin/src/core/router-generator-plugin.ts](https://github.com/TanStack/router/blob/main/packages/router-plugin/src/core/router-generator-plugin.ts)}
 * @param userOptions
 * @returns
 */
export const unpluginRouterGeneratorFactory: UnpluginFactory<
	Partial<PluginConfig> | undefined
> = (userOptions = {}) => {
	const ctx: RouterGeneratorPluginContext = {
		root: process.cwd(),
		config: getConfig(userOptions, process.cwd()),
		watcher: null,
		lock: false,
		generated: false,
	};

	const getRoutesDirectoryPath = () => {
		return isAbsolute(ctx.config.routesDirectory)
			? ctx.config.routesDirectory
			: join(ctx.root, ctx.config.routesDirectory);
	};

	const generate = async () => {
		if (ctx.lock) return;
		ctx.lock = true;
		try {
			const content = await generator(ctx.config);
			ctx.generated = true;
			return content;
		} catch (err) {
			console.error(`❌ [${PLUGIN_NAME}] Route generation failed:`, err);
			return "export const routes = [];";
		} finally {
			ctx.lock = false;
		}
	};

	const run = async (cb: () => Promise<unknown>) => {
		if (ctx.config.enableGeneration ?? true) {
			await cb();
		}
	};

	const handleFile = async (
		file: string,
		event: "create" | "update" | "delete",
	) => {
		const filePath = normalize(file);

		if (
			event === "update" &&
			filePath === resolve(ctx.config.generatedRoutesPath)
		) {
			// 跳过生成的路由文件的更新
			return;
		}

		const routesDirectoryPath = getRoutesDirectoryPath();
		const relative = path.relative(routesDirectoryPath, filePath);
		const fileInRoutesDirectory = relative !== "" && !relative.startsWith("..");
		if (fileInRoutesDirectory) {
			await run(generate);
		}
	};

	const setupWatcher = async () => {
		const { watch } = await import("chokidar");
		const routesDirectoryPath = getRoutesDirectoryPath();

		const watchOptions: ChokidarOptions = {
			ignored: [
				/(^|[\/\\])\../,
				"node_modules",
				"**/*.d.ts",
				"**/styles/**",
				"**/*.css",
				"**/*.less",
				"**/*.sass",
				"**/*.scss",
			],
			ignoreInitial: true,
			ignorePermissionErrors: true,
		};

		ctx.watcher = watch(routesDirectoryPath, watchOptions);

		const debounce = <T extends unknown[]>(
			fn: (...args: T) => void,
			delay: number,
		) => {
			let timeout: NodeJS.Timeout;
			return (...args: T) => {
				clearTimeout(timeout);
				timeout = setTimeout(() => fn(...args), delay);
			};
		};

		const debouncedGenerate = debounce(() => run(generate), 300);

		ctx.watcher
			.on("add", debouncedGenerate)
			.on("unlink", debouncedGenerate)
			.on("change", debouncedGenerate)
			.on("error", (error) => {
				console.error(`❌ [${PLUGIN_NAME}] Watcher error:`, error);
			});
	};

	return {
		name: PLUGIN_NAME,

		buildStart() {
			ctx.config = getConfig(userOptions, ctx.root);

			if (!isAbsolute(ctx.config.routesDirectory)) {
				ctx.config.routesDirectory = resolve(
					ctx.root,
					ctx.config.routesDirectory,
				);
			}
		},

		async watchChange(id, { event }) {
			await run(async () => {
				await handleFile(id, event);
			});
		},

		// resolveId(id: string) {
		//   return id === VIRTUAL_ROUTE_ID ? RESOLVED_VIRTUAL_ROUTE_ID : undefined;
		// },

		// load(id: string) {
		// 	if (id === RESOLVED_VIRTUAL_ROUTE_ID) {
		// 		return generate();
		// 	}

		// 	return null;
		// },

		vite: {
			async configResolved(config) {
				ctx.root = config.root;
				ctx.config = getConfig(userOptions, ctx.root);

				await run(generate);
			},

			configureServer() {
				return () => {
					console.info(`✅ [${PLUGIN_NAME}] Routes generated successfully`);
				};
			},

			handleHotUpdate({ file }) {
				if (file.startsWith(ctx.config.routesDirectory)) {
					return [];
				}
			},
		},

		webpack(compiler) {
			if (compiler.options.mode === "production") {
				compiler.hooks.beforeRun.tapPromise(PLUGIN_NAME, async () => {
					await run(generate);
				});

				compiler.hooks.done.tap(PLUGIN_NAME, () => {
					console.info(`✅ ${PLUGIN_NAME}: Routes generated successfully`);

					setTimeout(() => {
						process.exit(0);
					});
				});
			} else {
				setupWatcher();

				let generated = false;

				compiler.hooks.watchRun.tapPromise(PLUGIN_NAME, async () => {
					if (!generated) {
						generated = true;
						return run(generate);
					}
				});
			}
		},

		rspack(compiler) {
			if (compiler.options.mode === "production") {
				compiler.hooks.beforeRun.tapPromise(PLUGIN_NAME, async () => {
					await run(generate);
				});

				compiler.hooks.done.tap(PLUGIN_NAME, () => {
					console.info(`✅ [${PLUGIN_NAME}] Routes generated successfully`);
				});
			} else {
				setupWatcher();

				let generated = false;
				compiler.hooks.watchRun.tapPromise(PLUGIN_NAME, async () => {
					if (!generated) {
						generated = true;
						return run(generate);
					}
				});
			}
		},

		async buildEnd() {
			if (ctx.watcher) {
				await ctx.watcher.close();
				ctx.watcher = null;
			}
		},
	};
};

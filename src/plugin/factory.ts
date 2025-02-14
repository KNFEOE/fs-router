import type { UnpluginFactory } from "unplugin";
import { extname, isAbsolute, normalize, resolve } from "node:path";
import chokidar from "chokidar";
import { generator } from "./generator";
import { getConfig, type PluginConfig } from "./config";

const VIRTUAL_ROUTE_ID = "virtual:generated-routes";
const RESOLVED_VIRTUAL_ROUTE_ID = `\0${VIRTUAL_ROUTE_ID}`;
const PLUGIN_NAME = "unplugin:file-based-router-generator";

export const unpluginRouterGeneratorFactory: UnpluginFactory<
  Partial<PluginConfig> | undefined
> = (options = {}) => {
  let root: string = process.cwd();
  let config: PluginConfig;
  let watcher: ReturnType<typeof chokidar.watch> | null = null;
  let lock = false;

  const generate = async () => {
    if (lock) return;
    lock = true;

    try {
      await generator(config, root);
    } catch (err) {
      console.error(`[${PLUGIN_NAME}] Route generation failed:`, err);
    } finally {
      lock = false;
    }
  };

  const run = async (cb: () => Promise<void>) => {
    if (config.enableGeneration ?? true) {
      await cb();
    }
  };

  const handleFileChange = async (file: string) => {
    const filePath = normalize(file);

    if (filePath === resolve(config.generatedRoutesPath)) {
      return;
    }

    if (filePath.startsWith(config.routesDirectory)) {
      await run(generate);
    }
  };

  return {
    name: PLUGIN_NAME,

    buildStart() {
      config = getConfig(options, root);
      if (!isAbsolute(config.routesDirectory)) {
        config.routesDirectory = resolve(root, config.routesDirectory);
      }
    },

    async configResolved(resolvedConfig: any) {
      root = resolvedConfig.root || process.cwd();
      config = getConfig(options, root);

      await run(generate);

      if (resolvedConfig.command === 'serve') {
        const watchOptions = {
          ignored: [
            /(^|[\/\\])\../,
            "node_modules",
            "**/*.d.ts",
            "**/*.css",
            "**/*.less",
            "**/*.sass",
            "**/*.scss",
          ],
          ignoreInitial: true,
          ignorePermissionErrors: true,
        };

        const debounce = <T extends unknown[]>(
          fn: (...args: T) => void,
          delay: number
        ) => {
          let timeout: NodeJS.Timeout;
          return (...args: T) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
          };
        };

        watcher = chokidar.watch(config.routesDirectory, watchOptions);
        const debouncedGenerate = debounce(() => run(generate), 300);

        watcher
          .on("add", debouncedGenerate)
          .on("unlink", debouncedGenerate)
          .on("change", debouncedGenerate)
          .on("error", (error) => {
            console.error(`[${PLUGIN_NAME}] Watcher error:`, error);
          });
      }
    },

    resolveId(id: string) {
      if (id === VIRTUAL_ROUTE_ID) {
        return RESOLVED_VIRTUAL_ROUTE_ID;
      }
    },

    async load(id: string) {
      if (id === RESOLVED_VIRTUAL_ROUTE_ID) {
        try {
          const content = await generate();
          return content;
        } catch (error) {
          console.error(`[${PLUGIN_NAME}] Failed to load routes:`, error);
          return "export const routes = [];";
        }
      }
    },

    vite: {
      configureServer(server) {
        return () => {
          server.ws.send({
            type: "custom",
            event: "routes-changed",
            data: { timestamp: Date.now() },
          });
        };
      },

      handleHotUpdate({ file, server }) {
        if (file.startsWith(config.routesDirectory)) {
          const fileExt = extname(file);
          if (config.routeExtensions?.includes(fileExt.slice(1))) {
            server.ws.send({
              type: "full-reload",
              path: "*",
            });
            return [];
          }
        }
      },
    },

    webpack(compiler) {
      if (compiler.options.mode === "production") {
        compiler.hooks.beforeRun.tapPromise(PLUGIN_NAME, () => run(generate));
      }
    },

    rspack(compiler) {
      if (compiler.options.mode === "production") {
        compiler.hooks.beforeRun.tapPromise(PLUGIN_NAME, () => run(generate));
      }
    },

    async buildEnd() {
      if (watcher) {
        await watcher.close();
        watcher = null;
      }
    },
  };
};

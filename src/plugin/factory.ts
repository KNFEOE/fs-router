import type { UnpluginFactory } from "unplugin";
import { extname, isAbsolute, normalize, resolve } from "node:path";
import chokidar from "chokidar";
import { generator } from "./generator";
import { getConfig, type PluginConfig } from "./config";

const VIRTUAL_ROUTE_ID = "virtual:generated-routes";
const RESOLVED_VIRTUAL_ROUTE_ID = `\0${VIRTUAL_ROUTE_ID}`;
const PLUGIN_NAME = "unplugin:file-based-router-generator";

let lock = false;
const checkLock = () => lock;
const setLock = (bool: boolean) => {
  lock = bool;
};

/**
 * @name unpluginRouterGeneratorFactory
 * The plugin factory implementations based on [UnPlugin](https://rollupjs.org/plugin-development/#build-hooks)
 *
 * @param options
 * @returns
 */
export const unpluginRouterGeneratorFactory: UnpluginFactory<
  Partial<PluginConfig> | undefined
> = (options = {}) => {
  let root: string = process.cwd();
  const config: PluginConfig = getConfig(options, root);
  const initialGeneration = true;
  let watcher: ReturnType<typeof chokidar.watch> | null = null;

  const generate = async () => {
    if (checkLock()) {
      return;
    }

    setLock(true);

    try {
      await generator(config, process.cwd());
    } catch (err) {
      console.error(`[${PLUGIN_NAME}] Route generation failed:`, err);
      console.info();
    } finally {
      setLock(false);
    }
  };

  const handleFile = async (
    file: string,
    event: "create" | "update" | "delete",
  ) => {
    const filePath = normalize(file);

    if (
      event === "update" &&
      filePath === resolve(config.generatedRoutesPath)
    ) {
      // skip generating routes if the generated route tree is updated
      return;
    }

    const routesDirectoryPath = config.routesDirectory;

    if (filePath.startsWith(routesDirectoryPath)) {
      await generate();
    }
  };

  return {
    name: PLUGIN_NAME,

    buildStart() {
      // 确保路由目录存在
      if (!isAbsolute(config.routesDirectory)) {
        config.routesDirectory = resolve(root, config.routesDirectory);
      }
    },

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    async configResolved(resolvedConfig: any) {
      root = resolvedConfig.root || process.cwd();

      // 初始路由生成
      await generate();

      if (resolvedConfig.command === "serve") {
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

        watcher = chokidar.watch(config.routesDirectory, watchOptions);

        const debounce = <T extends unknown[]>(fn: (...args: T) => void, delay: number) => {
          let timeout: NodeJS.Timeout;

          return (...args: T) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
          };
        };
        const debouncedGenerator = debounce(generate, 300);

        watcher
          .on("add", debouncedGenerator)
          .on("unlink", debouncedGenerator)
          .on("change", debouncedGenerator)
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
          return "export const routes = [];"; // 返回空路由作为降级
        }
      }
    },

    /* async watchChange(id, { event }) {
      await handleFile(id, event);
    }, */

    async closeWatcher() {
      if (watcher) {
        await watcher.close();
        watcher = null;
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

    rspack(compiler: any) {
      // Rspack specific configurations can be added here
      /* compiler.hooks.done.tap(PLUGIN_NAME, async () => {
        if (initialGeneration) {
          await generate();
        }
      }); */
    },

    async buildEnd() {
      if (watcher) {
        await watcher.close();
        watcher = null;
      }
    },
  };
};

import { createVitePlugin } from "unplugin";
import { unpluginRouterGeneratorFactory } from "./factory";
import type { PluginConfig } from "./config";

/**
 * @example
 * ```ts
 * export default defineConfig({
 *   // ...
 *   tools: {
 *     Vite: {
 *       plugins: [FileBasedRouterVite()],
 *     },
 *   },
 * })
 * ```
 */
const FileBasedRouterVite = createVitePlugin(unpluginRouterGeneratorFactory);

export { FileBasedRouterVite, type PluginConfig };
export default FileBasedRouterVite;

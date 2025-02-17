import { createRspackPlugin } from "unplugin";
import { unpluginRouterGeneratorFactory } from "./factory";
import type { PluginConfig } from "./config";

/**
 * @example
 * ```ts
 * export default defineConfig({
 *   // ...
 *   tools: {
 *     rspack: {
 *       plugins: [FileBasedRouterRspack()],
 *     },
 *   },
 * })
 * ```
 */
const FileBasedRouterRspack = createRspackPlugin(
  unpluginRouterGeneratorFactory,
);

export { FileBasedRouterRspack, type PluginConfig };
export default FileBasedRouterRspack;

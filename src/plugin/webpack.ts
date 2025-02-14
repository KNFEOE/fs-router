import { createWebpackPlugin } from 'unplugin'
import { unpluginRouterGeneratorFactory } from './factory'
import { PluginConfig } from './config'

/**
 * @example
 * ```ts
 * export default defineConfig({
 *   // ...
 *   tools: {
 *     Webpack: {
 *       plugins: [FileBasedRouterWebpack()],
 *     },
 *   },
 * })
 * ```
 */
const FileBasedRouterWebpack = /* #__PURE__ */ createWebpackPlugin(
  unpluginRouterGeneratorFactory,
)

export {
  FileBasedRouterWebpack,
  type PluginConfig,
}
export default FileBasedRouterWebpack
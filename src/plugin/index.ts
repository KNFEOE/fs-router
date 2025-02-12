import { createRspackPlugin, type UnpluginFactory } from 'unplugin';
import chokidar from 'chokidar';

export interface ReactRouterPluginFactoryOptions {
  rootDirectory?: string;
}

export const reactRouterPluginFactory: UnpluginFactory<
  ReactRouterPluginFactoryOptions
> = (options) => {
  const { rootDirectory = 'pages' } = options;
  let ROOT: string = process.cwd();

  return {
    name: 'react-router-plugin-factory',
    buildStart() {},
    vite: {
      async configResolved(config) {
        ROOT = config.root;
      },
    },
  };
};

export const reactRouterRspackPlugin = createRspackPlugin(
  reactRouterPluginFactory,
);

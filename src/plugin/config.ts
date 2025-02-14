import { resolve, isAbsolute, join } from 'path';

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
}

const defaultConfig: PluginConfig = {
  routesDirectory: 'src/routes',
  generatedRoutesPath: 'src/generated/routes.tsx',
  routeExtensions: ['.js', '.jsx', '.ts', '.tsx'],
  splitting: true,
  enableGeneration: true,
  defaultErrorBoundary: true
};

export const getConfig = (options: Partial<PluginConfig> = {}, root: string): PluginConfig => {
  const config = { ...defaultConfig, ...options };

  // Resolve absolute paths
  config.routesDirectory = isAbsolute(config.routesDirectory)
    ? config.routesDirectory
    : resolve(root, join(root, config.routesDirectory));

  config.generatedRoutesPath = isAbsolute(config.generatedRoutesPath)
    ? config.generatedRoutesPath
    : resolve(root, join(root, config.generatedRoutesPath));

  return config;
};

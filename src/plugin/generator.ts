import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { RouteExtractor } from '../router/extractor';
import { RouteCodeGenerator } from '../router/generator';
import type { PluginConfig } from './config';

export async function generator(config: PluginConfig) {
  const extractor = new RouteExtractor({
    routesDir: config.routesDirectory,
    alias: config.alias
  });

  const routes = await extractor.extract();

  const generator = new RouteCodeGenerator({
    splitting: config.splitting,
    defaultErrorBoundary: config.defaultErrorBoundary
  });

  const code = generator.generate(routes);

  if (config.enableGeneration) {
    // Ensure directory exists
    await fs.mkdir(path.dirname(config.generatedRoutesPath), { recursive: true });

    // Write generated code
    await fs.writeFile(config.generatedRoutesPath, code, 'utf-8');
  }

  return code;
}

import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      source: {
        entry: {
          index: 'src/index.ts',
          rspack: 'src/plugin/rspack.ts',
          webpack: 'src/plugin/webpack.ts',
          vite: 'src/plugin/vite.ts',
        },
      },
      format: 'esm',
      syntax: 'es2021',
      dts: true,
    },
    {
      source: {
        entry: {
          index: 'src/index.ts',
          rspack: 'src/plugin/rspack.ts',
          webpack: 'src/plugin/webpack.ts',
          vite: 'src/plugin/vite.ts',
        },
      },
      format: 'cjs',
      syntax: 'es2021',
    },
  ],
});

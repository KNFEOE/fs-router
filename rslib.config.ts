import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      source: {
        entry: {
          index: 'src/index.ts',
          plugin: 'src/plugin/index.ts',
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
          plugin: 'src/plugin/index.ts',
        },
      },
      format: 'cjs',
      syntax: 'es2021',
    },
  ],
});

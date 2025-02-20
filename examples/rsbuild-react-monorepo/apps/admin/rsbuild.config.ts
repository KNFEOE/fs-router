import { defineConfig, rspack } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
// import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { FileBasedRouterRspack } from 'file-router/rspack';

const pluginRouter = FileBasedRouterRspack({
  enableGeneration: false,
})

export default defineConfig({
	source: {
		alias: {
			"@": "./src",
		},
	},
	server: {
		port: 3001,
	},
	plugins: [
		pluginReact(),
	],
	moduleFederation: {
		options: {
			name: "app_admin",
			exposes: {
				"./routes": "./src/routes.tsx",
			},
			filename: "remoteEntry.js",
			shareStrategy: "loaded-first",
			shared: {
				react: {
					singleton: true,
					eager: true,
					requiredVersion: "^18.3.1",
				},
				"react-dom": {
					singleton: true,
					eager: true,
					requiredVersion: "^18.3.1",
				},
				"react-router": {
					singleton: true,
					eager: true,
					requiredVersion: "^7.1.5",
				},
				"@loadable/component": {
					singleton: true,
					eager: true,
					requiredVersion: "^5.16.4",
				},
			},
		},
	},
	tools: {
		rspack: {
			plugins: [pluginRouter],
		},
	},
});

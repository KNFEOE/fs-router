import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { FileBasedRouterRspack } from "../../../../src/plugin/rspack";
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";

const pluginRouter = FileBasedRouterRspack({
	enableGeneration: true,
});

const rootPackage = require("../../package.json");
const sharedDependencies = Object.keys(rootPackage.pnpm.overrides).reduce(
	(acc, key) => {
		acc[key] = {
			singleton: true,
			requiredVersion: rootPackage.pnpm.overrides[key],
		};
		return acc;
	},
	{},
);

export default defineConfig({
	source: {
		alias: {
			"@": "./src",
		},
	},
	server: {
		port: 3003,
	},
	plugins: [
		pluginReact(),
		pluginModuleFederation({
			name: "app_user",
			exposes: {
				"./App": "./src/App.tsx",
			},
			filename: "remoteEntry.js",
			shareStrategy: "loaded-first",
			shared: {
				...sharedDependencies,
				"@kn-admin/shared": {
					singleton: true,
				},
			},
		}),
	],
	tools: {
		rspack: {
			plugins: [pluginRouter],
		},
	},
});

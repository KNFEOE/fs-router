import { defineConfig, rspack } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { FileBasedRouterRspack } from "../../../../src/plugin/rspack";

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

const pluginRouter = FileBasedRouterRspack({
	enableGeneration: false,
});

export default defineConfig({
	server: {
		port: 3000,
	},
	html: {
		template: "index.html",
		inject: "body",
	},
	source: {
		alias: {
			"@": "./src",
		},
		entry: {
			index: "./src/index.ts",
		},
	},

	plugins: [
		pluginReact(),
		pluginModuleFederation({
			name: "app_shell",
			filename: "remoteEntry.js",
			remotes: {
				app_dashboard: "app_dashboard@http://localhost:3001/remoteEntry.js",
				app_user: "app_user@http://localhost:3002/remoteEntry.js",
			},
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

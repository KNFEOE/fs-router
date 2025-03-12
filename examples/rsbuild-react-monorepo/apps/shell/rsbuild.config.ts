import { defineConfig, rspack } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { FileBasedRouterRspack } from "../../../../src/plugin/rspack";
import path from "node:path";

const pluginRouter = FileBasedRouterRspack({
	enableGeneration: true,
	typeGenerateOptions: {
		routesTypeFile: "src/routes-type.ts",
		routesDirectories: [
			// {
			// 	path: path.join(__dirname, "src/routes"),
			// },
			// {
			// 	prefix: "admin",
			// 	path: path.join(__dirname, "../admin/src/routes"),
			// },
		],
	},
});

export default defineConfig({
	server: {
		port: 3000,
	},
	source: {
		alias: {
			"@": "./src",
		},
	},
	plugins: [pluginReact()],
	tools: {
		rspack: {
			plugins: [pluginRouter],
		},
	},
	/**
	 * 模块联邦 v1.5
	 * @see {@link [moduleFederation.options](https://rsbuild.dev/zh/config/module-federation/options#modulefederationoptions)}
	 */
	moduleFederation: {
		options: {
			name: "app_shell",
			filename: "remoteEntry.js",
			remotes: {
				app_admin: "app_admin@http://localhost:3001/remoteEntry.js",
			},
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
			runtimePlugins: ["./plugins/logger.plugin.ts"],
		},
	},
});

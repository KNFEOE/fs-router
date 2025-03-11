import { defineConfig } from "@rslib/core";
import { pluginReact } from "@rsbuild/plugin-react";
export default defineConfig({
	plugins: [pluginReact()],
	source: {
		alias: {
			"@": "./src",
		}
	},
	lib: [
		{
			source: {
				entry: {
					index: "src/index.tsx",
				},
			},
			format: "esm",
			syntax: "es2021",
			dts: true,
		},
		{
			source: {
				entry: {
					index: "src/index.tsx",
				},
			},
			format: "cjs",
			syntax: "es2021",
		},
	],
});

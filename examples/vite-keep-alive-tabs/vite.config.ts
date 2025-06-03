import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { FileBasedRouterVite } from "../../src/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), FileBasedRouterVite(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
});

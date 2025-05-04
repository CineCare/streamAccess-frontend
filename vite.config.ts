import { defineConfig } from "vitest/config"; // Correction de l'import
import react from "@vitejs/plugin-react";
import svgr from 'vite-plugin-svgr';

export default defineConfig({
	plugins: [react(), svgr()],
	resolve: {
		alias: {
			"@components": "/src/components",
			"@pages": "/src/pages",
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./tests/setupTests.ts",
	},
});

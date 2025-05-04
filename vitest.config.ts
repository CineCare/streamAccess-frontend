import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTest.ts", // ✅ Assurez-vous que le chemin est correct
		include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
		coverage: {
			reporter: ["text", "json", "html"],
		},
	},
});

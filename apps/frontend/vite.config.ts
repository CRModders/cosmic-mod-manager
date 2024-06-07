import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./"),
			"@root": path.resolve(__dirname, "./../../"),
		},
	},
	define: {
		"process.env": process.env,
	},
	server: {
		// proxy: {
		// 	"/api": {
		// 		target: "http://localhost:5500",
		// 		changeOrigin: true,
		// 	},
		// },
		port: 3000,
	},
	preview: {
		// proxy: {
		// 	"/api": {
		// 		target: "http://localhost:5500",
		// 		changeOrigin: true,
		// 	},
		// },
		port: 3000,
	},
});

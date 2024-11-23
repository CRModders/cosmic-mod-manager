import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
    plugins: [pluginReact()],

    // server: {
    //     proxy: {
    //         "/api": {
    //             target: "https://api.crmm.tech",
    //             changeOrigin: true,
    //             secure: false,
    //         },
    //     },
    // },

    html: {
        template: "src/index.html",
    },
});

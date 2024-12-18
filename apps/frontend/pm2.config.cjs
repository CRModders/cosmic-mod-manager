const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

const rootDir = "/var/www/cosmic-mod-manager";
const frontendDir = `${rootDir}/source/apps/frontend`; // Root of the frontend
const reloadFrontend = "pm2 reload pm2.config.cjs --only crmm-frontend";

const apps = [
    {
        name: "crmm-frontend",
        command: "bun run start",
        cwd: frontendDir,
        autorestart: true,
        watch: false,
    },
];

module.exports = {
    apps: apps,
    deploy: {
        frontend: {
            user: `${process.env.SSH_USER}`,
            host: [`${process.env.SSH_HOST}`],
            key: `${process.env.SSH_KEY}`,
            ref: "origin/main",
            repo: "https://github.com/CRModders/cosmic-mod-manager.git",
            path: rootDir,
            "post-deploy": `cd ${frontendDir} && bun install && bun run build && ${reloadFrontend}`,
        },
    },
};

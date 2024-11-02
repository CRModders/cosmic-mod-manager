const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

const isDev = process.env.NODE_ENV === "development";
const projectPath = !isDev ? "/var/www/cosmic-mod-manager" : "/home/abhinav/Code/Monorepos/cosmic-mod-manager";
const backendDir = `${projectPath}/packages/backend`;
const pm2ConfigPath = `${backendDir}/pm2.config.cjs`;
const reloadApps = `pm2 reload ${pm2ConfigPath} --only crmm-meilisearch && pm2 reload ${pm2ConfigPath} --only crmm-redis && pm2 reload ${pm2ConfigPath} --only crmm-backend`;

const dev_backend = {
    name: "crmm-backend",
    command: "bun run dev",
    cwd: backendDir,
    autorestart: true,
    watch: false,
};

const prod_backend = {
    name: "crmm-backend",
    script: "src/index.ts",
    interpreter: "bun",
    cwd: backendDir,
    autorestart: true,
    watch: false,
};

module.exports = {
    apps: [
        {
            name: "crmm-meilisearch",
            command: "/usr/bin/meilisearch",
            args: ["--master-key", `${process.env.MEILISEARCH_MASTER_KEY}`],
            cwd: `${backendDir}/meilisearch`,
            autorestart: true,
            watch: false,
        },
        {
            name: "crmm-redis",
            command: "/usr/bin/redis-server",
            args: ["--port", "5501"],
            cwd: `${backendDir}/redis`,
            autorestart: true,
            watch: false,
        },
        isDev ? dev_backend : prod_backend,
    ],
    deploy: {
        production: {
            user: `${process.env.SSH_USER}`,
            host: [`${process.env.SSH_HOST}`],
            key: `${process.env.SSH_KEY}`,
            ref: "origin/main",
            repo: "https://github.com/CRModders/cosmic-mod-manager.git",
            path: "/var/www/cosmic-mod-manager",
            "post-deploy": `cd ${backendDir} && bun install && bun run prisma-generate && bun run prisma-push && ${reloadApps}`,
        },
    },
};

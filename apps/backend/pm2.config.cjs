const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

const isDev = process.env.NODE_ENV !== "production";
const rootDir = "/var/www/cosmic-mod-manager"; // The dir in which the repo will be cloned in prod

const sourceDir = !isDev ? `${rootDir}/source` : "/home/abhinav/Code/Monorepos/cosmic-mod-manager"; // The actual root of the project
const backendDir = `${sourceDir}/apps/backend`; // Root of the backend

const apps = [
    {
        name: "crmm-redis",
        command: "/usr/bin/redis-server",
        args: ["--port", "5501"],
        cwd: `${backendDir}/redis`,
        autorestart: true,
        watch: false,
    },
    {
        name: "crmm-meilisearch",
        command: "/usr/bin/meilisearch",
        args: ["--master-key", `${process.env.MEILISEARCH_MASTER_KEY}`],
        cwd: `${backendDir}/meilisearch`,
        autorestart: true,
        watch: false,
    },
    {
        name: "crmm-backend",
        command: `bun run ${isDev ? "dev" : "start"}`,
        cwd: backendDir,
        autorestart: true,
        watch: false,
    }
];

let processes_ToReload = [];
for (const app of apps) {
    processes_ToReload.push(`pm2 reload pm2.config.cjs --only ${app.name}`);
}

const processDownloadsQueue = "bun run src/routes/cdn/process-downloads.ts";

if (!isDev) {
    apps.push({
        name: "crmm-auto-backups",
        command: "bun run file-backup",
        cwd: backendDir,
        autorestart: false,
        watch: false,
        cron_restart: "0 0 * * *", // Every day at midnight
    })
}

module.exports = {
    apps: apps,
    deploy: {
        backend: {
            user: `${process.env.SSH_USER}`,
            host: [`${process.env.SSH_HOST}`],
            key: `${process.env.SSH_KEY}`,
            ref: "origin/main",
            repo: "https://github.com/CRModders/cosmic-mod-manager.git",
            path: rootDir,
            "post-deploy": `cd ${backendDir} && ${processDownloadsQueue} && bun install && bun run prisma-generate && bun run prisma-push && ${processes_ToReload.join(" && ")}`,
        },
    },
};

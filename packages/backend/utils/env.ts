const envKeys = [
    "FRONTEND_URL",
    "CORS_ALLOWED_URLS",
    "OAUTH_REDIRECT_URI",
    "CDN_SERVER_URL",
    "CACHE_CDN_URL",
    "COOKIE_DOMAIN",
    "PG_DATABASE_URL",
    "HASH_SECRET_KEY",
    "GITHUB_ID",
    "GITHUB_SECRET",
    "DISCORD_ID",
    "DISCORD_SECRET",
    "GOOGLE_ID",
    "GOOGLE_SECRET",
    "GITLAB_ID",
    "GITLAB_SECRET",
    "IP2GEO_API_KEY",
    "MEILISEARCH_MASTER_KEY",
    "DEMO_EMAIL",
    "DEMO_EMAIL_PASSWORD",
    "NODE_ENV",
    "CDN_SECRET",
] as const;

type EnvKeys = (typeof envKeys)[number];
const env = {} as Record<EnvKeys, string>;

for (const key of envKeys) {
    const value = process.env[key];
    if (value === undefined) {
        console.error(`Missing environment variable: ${key}`);
        process.exit(1);
    }

    env[key] = value;
}

export default env;

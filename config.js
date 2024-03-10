import mongoCredentials from "./mongoCredentials.js";

export default {
    PORT: 4004,
    PUBLIC_DIR: "public",
    mongodb: mongoCredentials,
    https: {
        key: "/etc/letsencrypt/live/<DOMAIN>/privkey.pem",
        cert: "/etc/letsencrypt/live/<DOMAIN>/fullchain.pem"
    }
};
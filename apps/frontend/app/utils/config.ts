const isDev = import.meta.env?.DEV;

const Config = {
    FRONTEND_URL: "https://crmm.tech",
    BACKEND_URL_LOCAL: "http://localhost:5500", // If the frontend and backend are both on the same server, localhost can be used for lower latency
    BACKEND_URL_PUBLIC: "https://api.crmm.tech", // The public URL of the backend,
    SITE_ICON: "https://crmm.tech/icon.png",
    proxy: false,
};

if (isDev === true) {
    Config.FRONTEND_URL = "http://localhost:3000";
    Config.BACKEND_URL_LOCAL = "http://localhost:5500";
    Config.BACKEND_URL_PUBLIC = "http://localhost:5500";
    Config.proxy = false;
}

export default Config;

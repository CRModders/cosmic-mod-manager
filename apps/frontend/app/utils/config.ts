const isDev = import.meta.env.DEV;

let Config = {
    FRONTEND_URL: "http://localhost:3000",
    BACKEND_URL: "http://localhost:5500",
    // FRONTEND_URL: "https://crmm.tech",
    // BACKEND_URL: "https://api.crmm.tech",
    BACKEND_URL_LOCAL: "http://localhost:5500",
    proxy: false,
};

if (isDev) {
    Config = {
        FRONTEND_URL: "http://localhost:3000",
        BACKEND_URL: "http://localhost:5500",
        BACKEND_URL_LOCAL: "http://localhost:5500",
        proxy: false,
    };
}

export default Config;

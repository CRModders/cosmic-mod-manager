// Every variable here is gonna be exported so no need to separate export from declaration

export const SITE_NAME_SHORT = "CRMM";
export const SITE_NAME_LONG = "Cosmic Reach Mod Manager";
export const STRING_ID_LENGTH = 18;

// PORTS
export const BACKEND_PORT = 5500;
export const BASE_API_ROUTE_PATH = "/api";

// COOKIE NAMES
export const CSRF_STATE_COOKIE_NAME = "csrfState";
export const AUTHTOKEN_COOKIE_NAME = "auth-token";

// AUTH
export const USER_SESSION_VALIDITY = 2592000000; // 30 days
export const PASSWORD_HASH_SALT_ROUNDS = 8;

// Confirmation email expiry durations
export const CONFIRM_NEW_PASSWORD_EMAIL_VALIDITY_ms = 7200_000; // 2 hour
export const CHANGE_ACCOUNT_PASSWORD_EMAIL_VALIDITY_ms = 7200_000; // 2 hour
export const DELETE_USER_ACCOUNT_EMAIL_VALIDITY_ms = 7200_000; // 2 hour

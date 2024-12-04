export function softCache(headers: Headers) {
    headers.set("Cache-Control", "no-store");
    headers.set("Strict-Transport-Security", "max-age=15552000; includeSubDomains; preload");
}

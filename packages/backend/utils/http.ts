import type { RouteHandlerResponse } from "@/types/http";
import type { Context } from "hono";
import { deleteCookie as honoDeleteCookie, setCookie as honoSetCookie } from "hono/cookie";
import type { CookieOptions } from "hono/utils/cookie";
import type { StatusCode } from "hono/utils/http-status";
import env from "./env";

type statusCodeNames = "OK" | "BAD_REQUEST" | "UNAUTHENTICATED" | "UNAUTHORIZED" | "NOT_FOUND" | "TOO_MANY_REQUESTS" | "SERVER_ERROR";

type httpStatusCodes = {
    [key in statusCodeNames]: StatusCode;
};

export const HTTP_STATUS: httpStatusCodes = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHENTICATED: 401,
    UNAUTHORIZED: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    SERVER_ERROR: 500,
};

export function serverErrorResponse(ctx: Context) {
    const res = serverErrorResponseData();
    return ctx.json(res.data, res.status);
}

export function invalidReqestResponse(ctx: Context, message?: string) {
    const res = invalidReqestResponseData(message);
    return ctx.json(res.data, res.status);
}

export function tooManyRequestsResponse(ctx: Context, message?: string) {
    const res = tooManyRequestsResponseData(message);
    return ctx.json(res.data, res.status);
}

export function notFoundResponse(ctx: Context, message?: string) {
    const res = notFoundResponseData(message);
    return ctx.json(res.data, res.status);
}

export function unauthorizedReqResponse(ctx: Context, message?: string) {
    const res = unauthorizedReqResponseData(message);
    return ctx.json(res.data, res.status);
}

export function serverErrorResponseData(msg?: string) {
    return {
        data: {
            success: false,
            message: msg || "Server Error",
        },
        status: HTTP_STATUS.SERVER_ERROR,
    };
}
export function invalidReqestResponseData(message?: string): RouteHandlerResponse {
    return {
        data: {
            success: false,
            message: message || "Invalid request",
        },
        status: HTTP_STATUS.BAD_REQUEST,
    };
}
export function tooManyRequestsResponseData(message?: string): RouteHandlerResponse {
    return {
        data: {
            success: false,
            message: message || "Too many requests, try again after a few minutes!",
        },
        status: HTTP_STATUS.TOO_MANY_REQUESTS,
    };
}
export function notFoundResponseData(message?: string): RouteHandlerResponse {
    return {
        data: {
            success: false,
            message: message || "Resource not found",
        },
        status: HTTP_STATUS.NOT_FOUND,
    };
}
export function unauthorizedReqResponseData(message?: string): RouteHandlerResponse {
    return {
        data: {
            success: false,
            message: message || "Unauthorized",
        },
        status: HTTP_STATUS.UNAUTHORIZED,
    };
}

// Cookie helpers
export function setCookie(ctx: Context, name: string, value: string, options?: CookieOptions) {
    return honoSetCookie(ctx, name, value, {
        sameSite: "Lax",
        domain: env.COOKIE_DOMAIN,
        ...options,
    });
}

export function deleteCookie(ctx: Context, name: string, options?: CookieOptions) {
    return honoDeleteCookie(ctx, name, { sameSite: "Strict", ...options });
}

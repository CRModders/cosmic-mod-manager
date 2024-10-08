import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";

type statusCodeNames = "OK" | "BAD_REQUEST" | "UNAUTHENTICATED" | "UNAUTHORIZED" | "NOT_FOUND" | "TOO_MANY_REQUESTS" | "SERVER_ERROR";

type httpStatusCodes = {
    [key in statusCodeNames]: StatusCode;
};

export const status: httpStatusCodes = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHENTICATED: 401,
    UNAUTHORIZED: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    SERVER_ERROR: 500,
};

export const defaultServerErrorResponse = (ctx: Context, message?: string) => {
    return ctx.json(
        {
            message: message || "Internal server error",
            succcess: false,
        },
        status.SERVER_ERROR,
    );
};

export const defaultInvalidReqResponse = (ctx: Context, message?: string) => {
    return ctx.json(
        {
            message: message || "Invalid request",
            succcess: false,
        },
        status.BAD_REQUEST,
    );
};

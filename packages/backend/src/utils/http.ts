import type { Context } from "hono";

type httpCodeType = "ok" | "bad_request" | "unauthenticated" | "unauthorized" | "not_found" | "too_many_requests" | "server_error";

const httpCode = (codeType: httpCodeType) => {
    switch (codeType) {
        case "ok":
            return 200;
        case "bad_request":
            return 400;
        case "unauthenticated":
            return 401;
        case "unauthorized":
            return 403;
        case "not_found":
            return 404;
        case "too_many_requests":
            return 429;
        case "server_error":
            return 500;
        default:
            return 200;
    }
};

export default httpCode;

export const defaultServerErrorResponse = (ctx: Context, message?: string) => {
    return ctx.json(
        {
            message: message || "Internal server error",
            succcess: false,
        },
        httpCode("server_error"),
    );
};

export const defaultInvalidReqResponse = (ctx: Context, message?: string) => {
    return ctx.json(
        {
            message: message || "Invalid request",
            succcess: false,
        },
        httpCode("bad_request"),
    );
};

import type { StatusCode } from "hono/utils/http-status";

export interface RouteHandlerResponse {
    data: Record<string, unknown> | unknown[];
    status: StatusCode;
}

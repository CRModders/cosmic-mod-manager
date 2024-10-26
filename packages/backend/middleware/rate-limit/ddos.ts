import { getUserIpAddress } from "@/src/auth/helpers";
import { serverErrorResponse, tooManyRequestsResponse } from "@/utils/http";
import type { Context, Next } from "hono";
import { TokenBucket } from "./bucket";
import rateLimits from "./limits";
import { setRateLimitHeaders } from "./utils";

const ddosProtectionLimit = rateLimits.global.DDOS_PROTECTION;
const ddosRateLimiterBucket = new TokenBucket(
    ddosProtectionLimit.namespace,
    ddosProtectionLimit.max,
    ddosProtectionLimit.timeWindow_seconds,
);

export async function ddosProtectionRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await ddosRateLimiterBucket.consume(ipAddr);
    if (res.rateLimited === true) {
        setRateLimitHeaders(ctx, res);
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

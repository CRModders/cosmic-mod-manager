import env from "@/utils/env";
import { Redis } from "ioredis";

let redis: Redis;
const redisPort = 5501;

if (env.NODE_ENV === "production") {
    redis = newRedis();
} else {
    // @ts-ignore
    if (!global.redis) {
        // @ts-ignore
        global.redis = newRedis();
    }
    // @ts-ignore
    redis = global.redis;
}

export default redis;

function newRedis() {
    const client = new Redis(redisPort);

    return client;
}

import { Redis } from "ioredis";

let redis: Redis;
const redisPort = 5501;

if (process.env.NODE_ENV === "production") {
    redis = new Redis(redisPort);
} else {
    // @ts-ignore
    if (!global.redis) {
        // @ts-ignore
        global.redis = new Redis(redisPort);
    }
    // @ts-ignore
    redis = global.redis;
}

export default redis;
import { Redis as Valkey } from "ioredis";
import env from "~/utils/env";

let valkey: Valkey;
const redisPort = 5501;

if (env.NODE_ENV === "production") {
    valkey = newValkeyClient();
} else {
    // @ts-ignore
    if (!global.valkey) {
        // @ts-ignore
        global.valkey = newValkeyClient();
    }
    // @ts-ignore
    valkey = global.valkey;
}

export default valkey;

function newValkeyClient() {
    const client = new Valkey(redisPort);

    return client;
}

// Copy pasted from https://github.com/honojs/hono/blob/main/src/middleware/logger/index.ts just so that i can simply add IP to the logs

// import { getUserIpAddress } from "@/controllers/auth/helpers";
import { getUserIpAddress } from "@/src/auth/helpers";
import type { Context, Next } from "hono";

enum LogPrefix {
    Outgoing = "-->",
    Incoming = "<--",
    Error = "xxx",
}

function humanize(times: string[]) {
    const [delimiter, separator] = [",", "."];

    const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${delimiter}`));

    return orderTimes.join(separator);
}

function time(start: number) {
    const delta = Date.now() - start;
    return humanize([delta < 1000 ? `${delta}ms` : `${Math.round(delta / 1000)}s`]);
}

function colorStatus(status: number) {
    const out: { [key: string]: string } = {
        7: `\x1b[35m${status}\x1b[0m`,
        5: `\x1b[31m${status}\x1b[0m`,
        4: `\x1b[33m${status}\x1b[0m`,
        3: `\x1b[36m${status}\x1b[0m`,
        2: `\x1b[32m${status}\x1b[0m`,
        1: `\x1b[32m${status}\x1b[0m`,
        0: `\x1b[33m${status}\x1b[0m`,
    };

    const calculateStatus = (status / 100) | 0;

    return out[calculateStatus];
}

type PrintFunc = (str: string, ...rest: string[]) => void;

function log(fn: PrintFunc, prefix: string, method: string, path: string, status = 0, elapsed?: string) {
    const out =
        prefix === LogPrefix.Incoming ? `${prefix} ${method} ${path}` : `${prefix} ${method} ${path} ${colorStatus(status)} ${elapsed}`;
    fn(out);
}

export function logger(fn: PrintFunc = console.log) {
    return async function logger(ctx: Context, next: Next) {
        const method = ctx.req?.method;
        const path = getPath(ctx.req.raw);
        const ipAddress = getUserIpAddress(ctx, true);

        log(fn, LogPrefix.Incoming, method, `${path} ${ipAddress}`);

        const start = Date.now();
        await next();

        log(fn, LogPrefix.Outgoing, method, path, ctx.res.status, time(start));
    };
}

// Utils
function tryDecodeURI(str: string): string {
    try {
        return decodeURI(str);
    } catch {
        return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
            try {
                return decodeURI(match);
            } catch {
                return match;
            }
        });
    }
}

export function getPath(request: Request): string {
    const url = request.url;
    const start = url.indexOf("/", 8);
    let i = start;
    for (; i < url.length; i++) {
        const charCode = url.charCodeAt(i);
        if (charCode === 37) {
            const queryIndex = url.indexOf("?", i);
            const path = url.slice(start, queryIndex === -1 ? undefined : queryIndex);
            return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
        }

        if (charCode === 63) {
            break;
        }
    }
    return url.slice(start, i);
}

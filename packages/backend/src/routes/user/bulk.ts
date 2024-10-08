import { getManyUsers } from "@/controllers/user/bulk_actions";
import { defaultInvalidReqResponse, defaultServerErrorResponse } from "@/utils/http";
import { type Context, Hono } from "hono";

const bulkUsersRouter = new Hono();

bulkUsersRouter.get("/", users_get);

async function users_get(ctx: Context) {
    try {
        const userIds = ctx.req.query("ids");
        if (!userIds) return defaultInvalidReqResponse(ctx);

        const idsArray = JSON.parse(userIds);

        if (idsArray.some((id: unknown) => typeof id !== "string")) {
            return defaultInvalidReqResponse(ctx, "Invalid user ids list");
        }
        if (idsArray.length > 100) {
            return defaultInvalidReqResponse(ctx, "Maximum 100 users can be fetched at once");
        }

        return await getManyUsers(ctx, idsArray);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

export default bulkUsersRouter;

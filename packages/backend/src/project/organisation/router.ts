import { strictGetReqRateLimiter } from "@/middleware/rate-limit/get-req";
import { critModifyReqRateLimiter } from "@/middleware/rate-limit/modify-req";
import { getUserFromCtx } from "@/src/auth/helpers/session";
import { REQ_BODY_NAMESPACE } from "@/types/namespaces";
import { HTTP_STATUS, invalidReqestResponse, serverErrorResponse, unauthorizedReqResponse } from "@/utils/http";
import { createOrganisationFormSchema } from "@shared/schemas/organisation";
import { parseValueToSchema } from "@shared/schemas/utils";
import { type Context, Hono } from "hono";
import { getOrganisationById, getUserOrganisations } from "./controllers";

const orgRouter = new Hono();

orgRouter.get("/", strictGetReqRateLimiter, userOrganisations_get);
orgRouter.post("/", critModifyReqRateLimiter, organisation_post);
orgRouter.get("/:orgId", strictGetReqRateLimiter, organisation_get);

async function userOrganisations_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        if (!userSession) {
            return unauthorizedReqResponse(ctx);
        }

        const res = await getUserOrganisations(userSession, userSession.id);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function organisation_post(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const body = ctx.get(REQ_BODY_NAMESPACE);

        const { data, error } = await parseValueToSchema(createOrganisationFormSchema, body);
        if (!data || error) {
            return ctx.json({ success: false, message: error }, HTTP_STATUS.BAD_REQUEST);
        }

        return ctx.json({ message: "Not implemented" }, HTTP_STATUS.SERVER_ERROR);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function organisation_get(ctx: Context) {
    try {
        const orgId = ctx.req.param("orgId");
        const userSession = getUserFromCtx(ctx);

        if (!orgId) {
            return invalidReqestResponse(ctx);
        }

        const res = await getOrganisationById(userSession, orgId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default orgRouter;

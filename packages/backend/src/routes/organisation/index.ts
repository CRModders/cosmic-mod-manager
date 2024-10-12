import { getOrganisationById, getUserOrganisations } from "@/controllers/organisation";
import { LoginProtectedRoute } from "@/middleware/session";
import { getUserSessionFromCtx } from "@/utils";
import { defaultInvalidReqResponse, defaultServerErrorResponse, status } from "@/utils/http";
import { createOrganisationFormSchema } from "@shared/schemas/organisation";
import { parseValueToSchema } from "@shared/schemas/utils";
import { type Context, Hono } from "hono";
import { ctxReqBodyNamespace } from "../../../types";

const orgRouter = new Hono();

orgRouter.get("/", LoginProtectedRoute, userOrganisations_get);
orgRouter.post("/", organisation_post);
orgRouter.get("/:orgId", organisation_get);

async function userOrganisations_get(ctx: Context) {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession) {
            return defaultInvalidReqResponse(ctx);
        }

        return await getUserOrganisations(ctx, userSession);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function organisation_post(ctx: Context) {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const body = ctx.get(ctxReqBodyNamespace);

        const { data, error } = await parseValueToSchema(createOrganisationFormSchema, body);
        if (!data || error) {
            return ctx.json({ success: false, message: error }, status.BAD_REQUEST);
        }
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function organisation_get(ctx: Context) {
    try {
        const orgId = ctx.req.param("orgId");
        const userSession = getUserSessionFromCtx(ctx);

        if (!orgId) {
            return defaultInvalidReqResponse(ctx);
        }

        return await getOrganisationById(ctx, userSession, orgId);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

export default orgRouter;

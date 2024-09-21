import { ctxReqBodyNamespace } from "@/../types";
import { acceptTeamInvite, inviteMember, leaveTeam, removeMember, updateMember } from "@/controllers/team";
import { LoginProtectedRoute } from "@/middleware/session";
import { getUserSessionFromCtx } from "@/utils";
import httpCode, { defaultInvalidReqResponse, defaultServerErrorResponse } from "@/utils/http";
import { updateProjectMemberFormSchema } from "@shared/schemas/project/settings/members";
import { parseValueToSchema } from "@shared/schemas/utils";
import { type Context, Hono } from "hono";

const teamRouter = new Hono();

// ? Planned
// teamRouter.get("/:teamId/owner", teamOwner_get)
// teamRouter.get("/:teamId/members", teamMembers_get)
// teamRouter.get(":teamId/members/:memberSlug", teamMember_get)

teamRouter.post("/:teamId/invite", LoginProtectedRoute, teamInvite_post);
teamRouter.patch("/:teamId/invite", LoginProtectedRoute, teamInvite_patch);
teamRouter.post("/:teamId/leave", LoginProtectedRoute, teamLeave_post);
teamRouter.patch("/:teamId/member/:memberId", LoginProtectedRoute, teamMember_patch);
teamRouter.delete("/:teamId/member/:memberId", LoginProtectedRoute, teamMember_delete);

async function teamInvite_post(ctx: Context) {
    try {
        const teamId = ctx.req.param("teamId");
        const userName = ctx.get(ctxReqBodyNamespace)?.userName;
        const userSession = getUserSessionFromCtx(ctx);
        if (!userName || !userSession || !teamId) return defaultInvalidReqResponse(ctx);

        return await inviteMember(ctx, userSession, userName, teamId);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function teamInvite_patch(ctx: Context) {
    try {
        const teamId = ctx.req.param("teamId");
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession || !teamId) return defaultInvalidReqResponse(ctx);

        return await acceptTeamInvite(ctx, userSession, teamId);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function teamLeave_post(ctx: Context) {
    try {
        const teamId = ctx.req.param("teamId");
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession || !teamId) return defaultInvalidReqResponse(ctx);

        return await leaveTeam(ctx, userSession, teamId);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function teamMember_patch(ctx: Context) {
    try {
        const { teamId, memberId } = ctx.req.param();
        const userSession = getUserSessionFromCtx(ctx);
        if (!memberId || !userSession || !teamId) return defaultInvalidReqResponse(ctx);

        const { data, error } = await parseValueToSchema(updateProjectMemberFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }

        return await updateMember(ctx, userSession, memberId, teamId, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function teamMember_delete(ctx: Context) {
    try {
        const { teamId, memberId } = ctx.req.param();
        const userSession = getUserSessionFromCtx(ctx);
        if (!memberId || !userSession || !teamId) return defaultInvalidReqResponse(ctx);

        return await removeMember(ctx, userSession, memberId, teamId);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

export default teamRouter;

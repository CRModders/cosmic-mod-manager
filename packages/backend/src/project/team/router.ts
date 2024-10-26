import { AuthenticationMiddleware, LoginProtectedRoute } from "@/middleware/auth";
import { critModifyReqRateLimiter } from "@/middleware/rate-limit/modify-req";
import { getUserFromCtx } from "@/src/auth/helpers/session";
import { REQ_BODY_NAMESPACE } from "@/types/namespaces";
import { HTTP_STATUS, invalidReqestResponse, serverErrorResponse } from "@/utils/http";
import { updateProjectMemberFormSchema } from "@shared/schemas/project/settings/members";
import { parseValueToSchema } from "@shared/schemas/utils";
import { type Context, Hono } from "hono";
import { acceptProjectTeamInvite, editProjectMember, inviteToProjectTeam, leaveProjectTeam, removeProjectMember } from "./controllers";

const teamRouter = new Hono();
teamRouter.use(AuthenticationMiddleware);

// ? Planned
// teamRouter.get("/:teamId/owner", teamOwner_get)
// teamRouter.get("/:teamId/members", teamMembers_get)
// teamRouter.get(":teamId/members/:memberSlug", teamMember_get)

teamRouter.post("/:teamId/invite", critModifyReqRateLimiter, LoginProtectedRoute, teamInvite_post);
teamRouter.patch("/:teamId/invite", critModifyReqRateLimiter, LoginProtectedRoute, teamInvite_patch);
teamRouter.post("/:teamId/leave", critModifyReqRateLimiter, LoginProtectedRoute, teamLeave_post);
teamRouter.patch("/:teamId/member/:memberId", critModifyReqRateLimiter, LoginProtectedRoute, teamMember_patch);
teamRouter.delete("/:teamId/member/:memberId", critModifyReqRateLimiter, LoginProtectedRoute, teamMember_delete);

async function teamInvite_post(ctx: Context) {
    try {
        const teamId = ctx.req.param("teamId");
        const userName = ctx.get(REQ_BODY_NAMESPACE)?.userName;
        const userSession = getUserFromCtx(ctx);
        if (!userName || !userSession || !teamId) return invalidReqestResponse(ctx);

        const res = await inviteToProjectTeam(ctx, userSession, userName, teamId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function teamInvite_patch(ctx: Context) {
    try {
        const teamId = ctx.req.param("teamId");
        const userSession = getUserFromCtx(ctx);
        if (!userSession || !teamId) return invalidReqestResponse(ctx);

        const res = await acceptProjectTeamInvite(ctx, userSession, teamId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function teamLeave_post(ctx: Context) {
    try {
        const teamId = ctx.req.param("teamId");
        const userSession = getUserFromCtx(ctx);
        if (!userSession || !teamId) return invalidReqestResponse(ctx);

        const res = await leaveProjectTeam(ctx, userSession, teamId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function teamMember_patch(ctx: Context) {
    try {
        const { teamId, memberId } = ctx.req.param();
        const userSession = getUserFromCtx(ctx);
        if (!memberId || !userSession || !teamId) return invalidReqestResponse(ctx);

        const { data, error } = await parseValueToSchema(updateProjectMemberFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, HTTP_STATUS.BAD_REQUEST);
        }

        const res = await editProjectMember(ctx, userSession, memberId, teamId, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function teamMember_delete(ctx: Context) {
    try {
        const { teamId, memberId } = ctx.req.param();
        const userSession = getUserFromCtx(ctx);
        if (!memberId || !userSession || !teamId) return invalidReqestResponse(ctx);

        const res = await removeProjectMember(ctx, userSession, memberId, teamId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default teamRouter;

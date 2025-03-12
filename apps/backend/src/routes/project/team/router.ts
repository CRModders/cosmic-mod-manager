import { overrideOrgMemberFormSchema, updateTeamMemberFormSchema } from "@app/utils/schemas/project/settings/members";
import { parseValueToSchema } from "@app/utils/schemas/utils";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware, LoginProtectedRoute } from "~/middleware/auth";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { critModifyReqRateLimiter } from "~/middleware/rate-limit/modify-req";
import { getUserFromCtx } from "~/routes/auth/helpers/session";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { invalidReqestResponse, serverErrorResponse } from "~/utils/http";
import {
    acceptProjectTeamInvite,
    editProjectMember,
    inviteMember,
    leaveProjectTeam,
    overrideOrgMember,
    removeProjectMember,
} from "./controllers";
import { changeTeamOwner } from "./controllers/change-owners";

const teamRouter = new Hono();
teamRouter.use(invalidAuthAttemptLimiter);
teamRouter.use(AuthenticationMiddleware);

// ? Planned
// teamRouter.get("/:teamId/owner", teamOwner_get)
// teamRouter.get("/:teamId/members", teamMembers_get)
// teamRouter.get(":teamId/members/:memberSlug", teamMember_get)

teamRouter.post("/:teamId/invite", critModifyReqRateLimiter, LoginProtectedRoute, teamInvite_post);
teamRouter.patch("/:teamId/invite", critModifyReqRateLimiter, LoginProtectedRoute, teamInvite_patch);
teamRouter.post("/:teamId/leave", critModifyReqRateLimiter, LoginProtectedRoute, teamLeave_post);

teamRouter.patch("/:teamId/owner", critModifyReqRateLimiter, LoginProtectedRoute, teamOwner_patch);
teamRouter.post(":teamId/members", critModifyReqRateLimiter, LoginProtectedRoute, teamMembers_post);
teamRouter.patch("/:teamId/member/:memberId", critModifyReqRateLimiter, LoginProtectedRoute, teamMember_patch);
teamRouter.delete("/:teamId/member/:memberId", critModifyReqRateLimiter, LoginProtectedRoute, teamMember_delete);

async function teamInvite_post(ctx: Context) {
    try {
        const teamId = ctx.req.param("teamId");
        const userName = ctx.get(REQ_BODY_NAMESPACE)?.userName;
        const userSession = getUserFromCtx(ctx);
        if (!userName || !userSession || !teamId) return invalidReqestResponse(ctx);

        const res = await inviteMember(ctx, userSession, userName, teamId);
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

async function teamOwner_patch(ctx: Context) {
    try {
        const { teamId } = ctx.req.param();
        const userSession = getUserFromCtx(ctx);
        const newOwner = ctx.get(REQ_BODY_NAMESPACE)?.userId;
        if (!userSession || !teamId || !newOwner) return invalidReqestResponse(ctx);

        const res = await changeTeamOwner(ctx, userSession, teamId, newOwner);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function teamMembers_post(ctx: Context) {
    try {
        const { teamId } = ctx.req.param();
        const userSession = getUserFromCtx(ctx);
        if (!userSession || !teamId) return invalidReqestResponse(ctx);

        const { data, error } = await parseValueToSchema(overrideOrgMemberFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidReqestResponse(ctx, error);

        const res = await overrideOrgMember(ctx, userSession, teamId, data);
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

        const { data, error } = await parseValueToSchema(updateTeamMemberFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidReqestResponse(ctx, error);

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

import { z } from "zod";
import { MAX_USERNAME_LENGTH } from "../../../config/forms";
import { OrganisationPermission, ProjectPermission } from "../../../types";

export const inviteTeamMemberFormSchema = z.object({
    userName: z.string().max(MAX_USERNAME_LENGTH),
});

export const updateTeamMemberFormSchema = z.object({
    role: z.string().max(32),
    permissions: z.nativeEnum(ProjectPermission).array().optional(),
    organisationPermissions: z.nativeEnum(OrganisationPermission).array().optional(),
});

export const overrideOrgMemberFormSchema = z.object({
    userId: z.string().max(32),
    role: z.string().max(32),
    permissions: z.nativeEnum(ProjectPermission).array().optional(),
});

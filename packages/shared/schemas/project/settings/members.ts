import { z } from "zod";
import { MAX_USERNAME_LENGTH } from "../../../config/forms";
import { ProjectPermission } from "../../../types";

export const inviteProjectMemberFormSchema = z.object({
    userName: z.string().max(MAX_USERNAME_LENGTH),
});

export const updateProjectMemberFormSchema = z.object({
    role: z.string().max(32),
    permissions: z.nativeEnum(ProjectPermission).array().optional(),
});

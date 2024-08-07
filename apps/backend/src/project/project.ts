import prisma from "@/lib/prisma";
import {
    maxExternalLinkLength,
    maxFeaturedProjectTags,
    maxNameLength,
    maxProjectDescriptionLength,
    maxProjectSummaryLength,
    minProjectNameLength,
} from "@root/config";
import {
    GetProjectVisibility,
    GetUsersProjectMembership,
    VerifySelectedCategories,
    createURLSafeSlug,
    isValidString,
    isValidUrl,
} from "@root/lib/utils";
import { MemberPermissionsInProject, type ProjectDataType, ProjectVisibility, UserRolesInProject } from "@root/types";
import { Hono } from "hono";
import { getUserSession } from "../helpers/auth";
import { deleteAllProjectFiles } from "../helpers/storage";
import versionRouter from "./version";
import { deleteProjectFromSearchIndex } from "../search/sync";

const projectRouter = new Hono();

projectRouter.post("/create-new-project", async (c) => {
    try {
        const body = await c.req.json();
        const name = isValidString(body?.name, maxNameLength, 1, true).value;
        const url = isValidString(body?.url, maxNameLength, 1, true).value;
        const summary = isValidString(body?.summary, maxProjectSummaryLength, 1, true).value;

        if (!name || !url || !body?.visibility || !summary) {
            return c.json({ message: "Missing required data" }, 400);
        }

        if (url !== createURLSafeSlug(url).value) {
            return c.json(
                {
                    message: `Please provide a URL safe value for the slug.  \"${url}\" contains invalid characters`,
                },
                400,
            );
        }

        const [user] = await getUserSession(c);
        if (!user?.id) {
            return c.json({ message: "Unauthenticated request" }, 401);
        }

        // * Check if the url slug is available
        const alreadyExistingProjectWithTheUrlSlug = await prisma.project.findUnique({
            where: {
                url_slug: url,
            },
        });

        if (alreadyExistingProjectWithTheUrlSlug?.id) {
            return c.json({ message: "That URL slug is already taken." }, 400);
        }
        const project = await prisma.project.create({
            data: {
                name: name,
                url_slug: url,
                visibility: GetProjectVisibility(body.visibility),
                summary: summary,
            },
        });

        await prisma.projectMember.create({
            data: {
                user_id: user.id,
                project_id: project.id,
                role: UserRolesInProject.OWNER,
            },
        });

        return c.json({
            message: "New project created successfully",
            data: {
                url_slug: project.url_slug,
                type: project.type[0],
            },
        });
    } catch (error) {
        console.error(error);
        return c.json({ message: "Internal server error" }, 500);
    }
});

projectRouter.get("/get-all-projects", async (c) => {
    try {
        const [user] = await getUserSession(c);
        if (!user?.id) {
            return c.json({ message: "" }, 401);
        }

        const projects = await prisma.projectMember.findMany({
            where: {
                user_id: user?.id,
            },
            select: {
                project: true,
            },
        });

        if (!projects.length) {
            return c.json({ projects: [] });
        }

        const projectDataList = [];
        for (const project of projects) {
            projectDataList.push(project.project);
        }

        return c.json({ projects: projectDataList });
    } catch (error) {
        console.error(error);
        return c.json({ message: "Internal server error" }, 500);
    }
});

projectRouter.get("/:projectSlug", async (c) => {
    try {
        const projectSlug = c.req.param("projectSlug");
        const [user] = await getUserSession(c);

        const projectData = await prisma.project.findFirst({
            where: {
                OR: [
                    {
                        id: projectSlug,
                    },
                    {
                        url_slug: projectSlug,
                    },
                ],
            },
            select: {
                created_on: true,
                id: true,
                name: true,
                org_id: true,
                status: true,
                summary: true,
                description: true,
                type: true,
                tags: true,
                featured_tags: true,
                license: true,
                license_url: true,
                updated_on: true,
                url_slug: true,
                visibility: true,
                external_links: true,
                members: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                user_name: true,
                                avatar_image: true,
                            },
                        },
                        role: true,
                        role_title: true,
                        permissions: true,
                    },
                },
            },
        });

        if (!projectData?.id) {
            return c.json({ message: "Project not found" }, 404);
        }

        const UsersProjectMembership = GetUsersProjectMembership(
            user?.id,
            projectData.members.map((member) => member.user.id),
        );

        if (
            projectData.visibility === ProjectVisibility.PUBLIC ||
            projectData.visibility === ProjectVisibility.UNLISTED ||
            UsersProjectMembership
        ) {
            return c.json({
                data: {
                    created_on: projectData.created_on,
                    id: projectData.id,
                    name: projectData.name,
                    org_id: projectData.org_id,
                    status: projectData.status,
                    summary: projectData.summary,
                    description: projectData.description,
                    type: projectData.type,
                    tags: projectData.tags,
                    featured_tags: projectData.featured_tags,
                    license: projectData.license,
                    licenseUrl: projectData.license_url,
                    updated_on: projectData.updated_on,
                    url_slug: projectData.url_slug,
                    visibility: projectData.visibility,
                    external_links: projectData?.external_links,
                    members: projectData.members,
                } satisfies ProjectDataType,
            });
        }

        return c.json({ message: "Project not found", data: null }, 400);
    } catch (error) {
        console.error(error);
        return c.json({ message: "Internal server error" }, 500);
    }
});

projectRouter.post("/:projectSlug/update", async (c) => {
    try {
        const body = await c.req.json();
        const visibility = body?.visibility;
        const name = isValidString(body?.name, maxNameLength, minProjectNameLength, true);
        const url_slug = isValidString(body?.url_slug, maxNameLength, 1, true);
        const summary = isValidString(body?.summary, maxProjectSummaryLength, 1, true);

        const currUrlSlug = c.req.param("projectSlug");
        const urlSafeUrlSlug = createURLSafeSlug(url_slug.value).value;

        if (!currUrlSlug || !name || !urlSafeUrlSlug || !body?.visibility || !summary) {
            return c.json({ message: "Missing required data" }, 400);
        }

        if (!name.isValid || !url_slug.isValid || !summary.isValid) {
            return c.json({ message: "Invalid length" }, 400);
        }

        if (url_slug.value !== urlSafeUrlSlug) {
            return c.json({
                message: `Please provide a URL safe value for the slug.  \"${url_slug.value}\" contains invalid characters`,
            });
        }

        const [user] = await getUserSession(c);
        if (!user?.id) {
            return c.json({ message: "Unauthenticated request" }, 403);
        }

        const project = await prisma.project.findUnique({
            where: {
                url_slug: currUrlSlug,
            },
            select: {
                id: true,
                members: {
                    where: {
                        user_id: user.id,
                        OR: [
                            {
                                role: UserRolesInProject.OWNER,
                            },
                            {
                                permissions: {
                                    has: MemberPermissionsInProject.EDIT_DETAILS,
                                },
                            },
                        ],
                    },
                    select: {
                        user_id: true,
                    },
                },
            },
        });

        if (!project?.members?.[0]?.user_id) {
            return c.json(
                { message: "The project doesn't exist or you don't have the permission to update the project details" },
                403,
            );
        }

        const existingProjectWithSameUrlSlug = await prisma.project.findUnique({
            where: {
                url_slug: currUrlSlug,
            },
        });

        if (existingProjectWithSameUrlSlug?.id && existingProjectWithSameUrlSlug.id !== project.id) {
            return c.json({ message: "That url slug is already taken" }, 400);
        }

        await prisma.project.update({
            where: {
                url_slug: currUrlSlug,
            },
            data: {
                name: name.value,
                url_slug: urlSafeUrlSlug,
                summary: summary.value,
                visibility: GetProjectVisibility(visibility),
            },
        });

        if (
            GetProjectVisibility(visibility) !== ProjectVisibility.PUBLIC &&
            GetProjectVisibility(visibility) !== ProjectVisibility.LISTED
        ) {
            deleteProjectFromSearchIndex(project.id);
        }

        return c.json({
            message: "Project updated successfully",
            data: {
                name: name,
                url_slug: urlSafeUrlSlug,
                summary: summary,
                visibility: GetProjectVisibility(visibility),
            },
        });
    } catch (error) {
        console.error(error);
        return c.json({ message: "Internal server error" }, 500);
    }
});

projectRouter.get("/:projectSlug/delete", async (c) => {
    try {
        const [user] = await getUserSession(c);
        const projectSlug = c.req.param("projectSlug");
        if (!user?.id || !projectSlug) return c.json({ message: "Invalid request" }, 400);

        const project = await prisma.project.findUnique({
            where: { url_slug: projectSlug },
            select: {
                id: true,
                members: {
                    where: {
                        user_id: user.id,
                        OR: [
                            { role: UserRolesInProject.OWNER },
                            { permissions: { has: MemberPermissionsInProject.DELETE_PROJECT } },
                        ],
                    },
                    select: { user_id: true },
                },
            },
        });

        if (!project?.members?.[0]?.user_id) {
            return c.json(
                { message: "The project doesn't exist or you don't have the permission to delete the project" },
                400,
            );
        }

        await prisma.project.delete({
            where: {
                id: project.id,
            },
        });

        await deleteAllProjectFiles(user.id, project.id).catch((e) => console.error(e));
        deleteProjectFromSearchIndex(project.id);

        return c.json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error(error);
        return c.json({ message: "Internal server error" }, 500);
    }
});

projectRouter.post("/:projectSlug/update-description", async (c) => {
    try {
        const projectSlug = c.req.param("projectSlug");
        const body = await c.req.json();
        const description = body?.description;

        if (!projectSlug || !description || description.length > maxProjectDescriptionLength) {
            return c.json({ message: "Project description is required" }, 400);
        }

        const [user] = await getUserSession(c);
        if (!user?.id) {
            return c.json({ message: "Unauthenticated request" }, 403);
        }

        const project = await prisma.project.findUnique({
            where: { url_slug: projectSlug },
            select: {
                members: {
                    where: {
                        user_id: user.id,
                        OR: [
                            { role: UserRolesInProject.OWNER },
                            { permissions: { has: MemberPermissionsInProject.EDIT_DESCRIPTION } },
                        ],
                    },
                    select: { user_id: true },
                },
                id: true,
            },
        });

        if (!project?.members) {
            return c.json({ message: "Not found" }, 404);
        }

        await prisma.project.update({
            where: { id: project.id },
            data: { description: description },
        });

        return c.json({ message: "Description updated" });
    } catch (error) {
        console.error(error);
        return c.json({ message: "Internal server error" }, 500);
    }
});

projectRouter.post("/:projectSlug/update-external-links", async (c) => {
    try {
        const projectSlug = c.req.param("projectSlug");
        const body = await c.req.json();
        const issueTrackerLink = isValidString(body?.issueTrackerLink, maxExternalLinkLength, 1, true).value;
        const projectSourceLink = isValidString(body?.projectSourceLink, maxExternalLinkLength, 1, true).value;
        const projectWikiLink = isValidString(body?.projectWikiLink, maxExternalLinkLength, 1, true).value;
        const projectDiscordLink = isValidString(body?.projectDiscordLink, maxExternalLinkLength, 1, true).value;

        if (issueTrackerLink && !isValidUrl(issueTrackerLink)) {
            return c.json({ message: "Invalid issueTrackerLink" }, 400);
        }
        if (projectSourceLink && !isValidUrl(projectSourceLink)) {
            return c.json({ message: "Invalid projectSourceLink" }, 400);
        }
        if (projectWikiLink && !isValidUrl(projectWikiLink)) {
            return c.json({ message: "Invalid projectWikiLink" }, 400);
        }
        if (projectDiscordLink && !isValidUrl(projectDiscordLink)) {
            return c.json({ message: "Invalid projectDiscordLink" }, 400);
        }

        const [user] = await getUserSession(c);
        if (!user?.id) {
            return c.json({ message: "Unauthenticated request" }, 403);
        }

        const project = await prisma.project.findUnique({
            where: {
                url_slug: projectSlug,
            },
            select: {
                members: {
                    where: {
                        user_id: user.id,
                        role: UserRolesInProject.OWNER,
                    },
                    select: {
                        user_id: true,
                    },
                },
                external_links: true,
                id: true,
            },
        });

        if (!project?.members) {
            return c.json({ message: "Not found" }, 404);
        }

        if (!project.external_links?.id) {
            await prisma.projectExternalLinks.create({
                data: {
                    project_id: project.id,
                    issue_tracker_link: issueTrackerLink,
                    project_source_link: projectSourceLink,
                    project_wiki_link: projectWikiLink,
                    discord_invite_link: projectDiscordLink,
                },
            });
        } else {
            await prisma.projectExternalLinks.update({
                where: {
                    id: project.external_links?.id,
                },
                data: {
                    project_id: project.id,
                    issue_tracker_link: issueTrackerLink,
                    project_source_link: projectSourceLink,
                    project_wiki_link: projectWikiLink,
                    discord_invite_link: projectDiscordLink,
                },
            });
        }

        return c.json({ message: "External links updated" });
    } catch (error) {
        console.error(error);
        return c.json(
            {
                message: "Internal server error",
            },
            500,
        );
    }
});

projectRouter.post("/:projectSlug/update-tags", async (c) => {
    try {
        const body = await c.req.json();
        const projectSlug = c.req.param("projectSlug");

        if (!projectSlug || body?.tags?.length === undefined || body?.featuredTags?.length === undefined)
            return c.json({ message: "Invalid request" }, 400);

        const [user] = await getUserSession(c);
        if (!user?.id) return c.json({ message: "Unauthenticated request" }, 400);

        const project = await prisma.project.findUnique({
            where: {
                url_slug: projectSlug,
            },
            select: {
                id: true,
                type: true,
                members: {
                    where: {
                        user_id: user.id,
                        role: UserRolesInProject.OWNER,
                    },
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!project?.members?.[0]?.id)
            return c.json(
                { message: "The project doesn't exist or You don't have the permission to update project details" },
                400,
            );
        const selectedTags = VerifySelectedCategories(body?.tags || [], project.type);
        const featuredTags = (body?.featuredTags || [])
            .slice(0, maxFeaturedProjectTags)
            .filter((featuredTag) => selectedTags.includes(featuredTag));

        await prisma.project.update({
            where: {
                id: project.id,
            },
            data: {
                tags: selectedTags,
                featured_tags: featuredTags,
            },
        });

        return c.json({ message: "succesfully updated project tags" }, 200);
    } catch (error) {
        console.error(error);
        return c.json({ message: "Intrnal server error" }, 500);
    }
});

projectRouter.post("/:projectSlug/update-license", async (c) => {
    try {
        const body = await c.req.json();
        const projectSlug = c.req.param("projectSlug");

        const license = body?.license || "";
        const licenseUrl = license ? body?.licenseUrl : "";

        if (licenseUrl && !isValidUrl(licenseUrl)) return c.json({ message: "Invalid license url" }, 400);

        const [user] = await getUserSession(c);
        if (!user?.id) return c.json({ message: "Unauthenticated request" }, 401);

        const project = await prisma.project.findUnique({
            where: {
                url_slug: projectSlug,
            },
            select: {
                id: true,
                members: {
                    where: {
                        user_id: user.id,
                        role: UserRolesInProject.OWNER,
                    },
                    select: {
                        user_id: true,
                    },
                },
            },
        });

        if (!project?.members?.[0]?.user_id)
            return c.json({
                message: "Project doesn't exist or you don't have to access to edit the project details.",
            });

        await prisma.project.update({
            where: {
                id: project.id,
            },
            data: {
                license: license,
                license_url: licenseUrl,
            },
        });

        return c.json({ message: "Successfully update license details" });
    } catch (error) {
        console.error(error);
        return c.json({ message: "Internal server error" }, 500);
    }
});

// * Version router
projectRouter.route("/:projectSlug/version", versionRouter);

export default projectRouter;

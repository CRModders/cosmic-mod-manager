import prisma from "@/lib/prisma";
import { maxChangelogLength, maxFileSize, maxProjectNameLength } from "@root/config";
import { GetProjectLoadersList, GetProjectVersionReleaseChannel, GetUsersProjectMembership, GetValidProjectCategories, createURLSafeSlug, parseFileSize } from "@root/lib/utils";
import { ProjectVisibility } from "@root/types";
import { Hono } from "hono";
import { getUserSession } from "../helpers/auth";
import { InferProjectTypeFromLoaders } from "../helpers/project";
import { deleteAllVersionFiles, saveProjectVersionFile } from "../helpers/storage";

const versionRouter = new Hono();

versionRouter.get("/", async (c) => {
    try {
        const projectUrlSlug = c.req.param("projectSlug");
        const featuredVersionsOnly = c.req.query("featured") === "true";

        if (!projectUrlSlug) {
            return c.json({}, 404);
        }

        const versionFilter: { is_featured?: boolean } = {};
        const filesFilter: { is_primary?: boolean } = {};
        if (featuredVersionsOnly === true) {
            versionFilter.is_featured = true;
            filesFilter.is_primary = true;
        }

        const project = await prisma.project.findFirst({
            where: {
                OR: [{ url_slug: projectUrlSlug }, { id: projectUrlSlug }],
            },
            select: {
                id: true,
                visibility: true,
                icon: true,
                members: {
                    select: {
                        id: true,
                        user_id: true,
                        role: true,
                    },
                },

                versions: {
                    where: versionFilter,
                    select: {
                        id: true,
                        version_number: true,
                        version_title: true,
                        url_slug: true,
                        is_featured: true,
                        published_on: true,
                        downloads: true,
                        release_channel: true,
                        supported_game_versions: true,
                        supported_loaders: true,
                        files: {
                            select: {
                                id: true,
                                file_name: true,
                                file_size: true,
                                file_type: true,
                                file_url: true,
                                is_primary: true,
                            },
                            where: filesFilter,
                        },
                    },
                    orderBy: {
                        published_on: "desc",
                    },
                },
            },
        });

        if (!project?.id) {
            return c.json({}, 404);
        }

        const { members, ...projectVersionData } = project;
        if (project?.visibility === ProjectVisibility.PUBLIC || project?.visibility === ProjectVisibility.UNLISTED) {
            return c.json({ data: projectVersionData });
        }

        const [user] = await getUserSession(c);
        const UsersProjectMembership = GetUsersProjectMembership(
            user?.id,
            project.members.map((member) => member.user_id),
        );

        if (UsersProjectMembership) {
            return c.json({ data: projectVersionData });
        }

        return c.json({ message: "Not found" }, 404);
    } catch (error) {
        console.error(error);
        return c.json({ message: "Internal server error" }, 500);
    }
});

versionRouter.get("/:versionSlug", async (c) => {
    try {
        const projectSlugUrl = c.req.param("projectSlug");
        const versionSlug = c.req.param("versionSlug");

        const project = await prisma.project.findFirst({
            where: {
                OR: [{ url_slug: projectSlugUrl }, { id: projectSlugUrl }],
            },
            select: {
                id: true,
                visibility: true,
                icon: true,
                members: {
                    select: {
                        id: true,
                        user_id: true,
                        role: true,
                    },
                },

                versions: {
                    where: {
                        OR: [{ url_slug: versionSlug }, { id: versionSlug }],
                    },
                    select: {
                        id: true,
                        version_number: true,
                        version_title: true,
                        changelog: true,
                        url_slug: true,
                        is_featured: true,
                        published_on: true,
                        downloads: true,
                        release_channel: true,
                        supported_game_versions: true,
                        supported_loaders: true,
                        publisher: {
                            select: {
                                id: true,
                                role_title: true,
                                user: {
                                    select: {
                                        id: true,
                                        user_name: true,
                                        avatar_image: true,
                                    },
                                },
                            },
                        },

                        files: {
                            select: {
                                id: true,
                                file_name: true,
                                file_size: true,
                                file_type: true,
                                file_url: true,
                                is_primary: true,
                            },
                        },
                    },
                },
            },
        });

        if (!project || !project?.versions?.[0].id) {
            return c.json({ message: "Not found" }, 404);
        }

        const [user] = await getUserSession(c);
        const UsersProjectMembership = GetUsersProjectMembership(
            user?.id,
            project.members.map((member) => member.user_id),
        );

        if (
            project.visibility === ProjectVisibility.PUBLIC ||
            project.visibility === ProjectVisibility.UNLISTED ||
            UsersProjectMembership
        ) {
            return c.json({ message: "", data: project });
        }
        return c.json({ message: "Not found", data: null }, 404);
    } catch (error) {
        console.error(error);
        return c.json({ message: "Internal server error" }, 500);
    }
});

versionRouter.post("/:versionSlug/update", async (c) => {
    try {
        const body = await c.req.formData();
        const projectSlug = c.req.param("projectSlug");
        const versionSlug = c.req.param("versionSlug");

        const versionName = body.get("versionName").toString();
        const changelog = body.get("changelog").toString();
        const versionNumber = body.get("versionNumber").toString();
        const releaseChannel = body.get("releaseChannel").toString();
        const loaders = JSON.parse(body.get("loaders").toString());
        const supportedGameVersions = JSON.parse(body.get("supportedGameVersions").toString());

        if (!versionName) return c.json({ message: "Version title is required" }, 400);
        if (!versionNumber) return c.json({ message: "Version number is required" }, 400);
        if (!supportedGameVersions?.length) return c.json({ message: "Supported game versions is required" }, 400);
        if (!releaseChannel) return c.json({ message: "Release channel is required" }, 400);

        if (createURLSafeSlug(versionNumber).value !== versionNumber.toLowerCase()) {
            return c.json({ message: "Version number must be a URL safe string" }, 400);
        }

        if (
            !loaders?.length ||
            !supportedGameVersions?.length ||
            versionName.length > maxProjectNameLength ||
            changelog.length > maxChangelogLength ||
            versionNumber.length > maxProjectNameLength
        ) {
            return c.json({ message: "Length check failed" }, 400);
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
                id: true,
                type: true,
                members: {
                    where: { user_id: user.id },
                    select: {
                        id: true,
                    },
                },
                versions: {
                    where: {
                        url_slug: versionSlug,
                    },
                    select: {
                        id: true,
                        supported_loaders: true
                    },
                },
            },
        });

        if (!project.members[0].id) {
            return c.json({ message: "Invalid request" }, 403);
        }

        let updatedProjectVersionUrlSlug: string | null = versionNumber;
        const existingProjectVersionWithSameVersionNumber = await prisma.projectVersion.findFirst({
            where: {
                project_id: project.id,
                url_slug: versionNumber,
                NOT: [{ id: project.versions[0].id }],
            },
        });

        if (existingProjectVersionWithSameVersionNumber?.id) {
            updatedProjectVersionUrlSlug = null;
        }

        const projectVersion = await prisma.projectVersion.update({
            where: {
                id: project.versions[0].id,
            },
            data: {
                version_title: versionName,
                version_number: versionNumber,
                url_slug: updatedProjectVersionUrlSlug || project.versions[0].id,
                changelog: changelog,
                release_channel: GetProjectVersionReleaseChannel(releaseChannel),
                supported_loaders: GetProjectLoadersList(loaders),
                supported_game_versions: supportedGameVersions,
            },
        });

        const previousVersionLoaders = (() => {
            const list = [];
            for (const version of project.versions) {
                if (version.id === projectVersion.id) continue;
                for (const loader of version.supported_loaders) {
                    if (!list.includes(loader)) list.push(loader);
                }
            }
            return list;
        })()

        await prisma.project.update({
            where: {
                id: project.id,
            },
            data: {
                type: InferProjectTypeFromLoaders([...projectVersion.supported_loaders, ...previousVersionLoaders])
            },
        });

        return c.json({
            message: "Project updated",
            data: {
                url_slug: updatedProjectVersionUrlSlug || project.versions[0].id,
            },
        });
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

versionRouter.post("/:versionSlug/set-featured", async (c) => {
    try {
        const projectSlug = c.req.param("projectSlug");
        const versionSlug = c.req.param("versionSlug");
        const body = await c.req.json();
        const is_featured = body?.is_featured === true;

        if (!projectSlug || !versionSlug || is_featured === undefined) {
            return c.json({ message: "Invalid request" }, 400);
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
                    },
                    select: {
                        user_id: true,
                    },
                },
                versions: {
                    where: {
                        url_slug: versionSlug,
                    },
                    select: {
                        id: true,
                        is_featured: true,
                    },
                },
            },
        });

        if (!project?.members) {
            return c.json({ message: "Not found" }, 404);
        }

        await prisma.projectVersion.update({
            where: {
                id: project.versions[0].id,
            },
            data: {
                is_featured: is_featured,
            },
        });

        return c.json({ message: `Version ${is_featured === true ? "added to" : "removed from"} featured list` });
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

versionRouter.post("/create", async (c) => {
    try {
        const body = await c.req.formData();
        const projectSlugUrl = c.req.param("projectSlug");

        const primaryVersionFile = body.get("primary-file") as File;
        const versionName = body.get("versionName").toString();
        const changelog = body.get("changelog").toString();
        const versionNumber = body.get("versionNumber").toString();
        const releaseChannel = body.get("releaseChannel").toString();
        const loaders = JSON.parse(body.get("loaders").toString());
        const supportedGameVersions = JSON.parse(body.get("supportedGameVersions").toString());

        if (!primaryVersionFile || !versionName || !versionNumber || !releaseChannel || !supportedGameVersions) {
            return c.json(
                {
                    message: "Missing required data",
                },
                400,
            );
        }

        if (primaryVersionFile.size > maxFileSize) {
            return c.json(
                {
                    message: `File too large: "${primaryVersionFile.name}" (${parseFileSize(
                        primaryVersionFile.size,
                    )}) | MaxAllowedSize: ${parseFileSize(maxFileSize)}`,
                },
                400,
            );
        }

        if (createURLSafeSlug(versionNumber).value !== versionNumber) {
            return c.json(
                {
                    message: "Version number should be a url safe string",
                },
                400,
            );
        }

        const [user] = await getUserSession(c);
        if (!user?.id) {
            return c.json({ message: "Unauthenticated request" }, 401);
        }

        const project = await prisma.project.findUnique({
            where: {
                url_slug: projectSlugUrl,
            },
            select: {
                id: true,
                type: true,
                members: {
                    where: {
                        user_id: user.id
                    },
                    select: {
                        id: true,
                    }
                },
                versions: {
                    select: {
                        supported_loaders: true
                    }
                }
            },
        });

        if (!project?.id) {
            return c.json({ message: "Not found" }, 404);
        }

        if (!project?.members?.[0]?.id) {
            return c.json(
                {
                    message: "Invalid request",
                },
                403,
            );
        }

        const existingVersionWithSameUrlSlug = await prisma.projectVersion.findFirst({
            where: {
                project_id: project.id,
                url_slug: versionNumber,
            },
        });

        let newVersionUrlSlug = versionNumber;
        if (existingVersionWithSameUrlSlug?.url_slug) {
            newVersionUrlSlug = null;
        }

        const newProjectVersion = await prisma.projectVersion.create({
            data: {
                project_id: project.id,
                publisher_id: project.members[0].id,
                version_number: versionNumber,
                version_title: versionName,
                changelog: changelog || "",
                url_slug: newVersionUrlSlug || "",
                release_channel: GetProjectVersionReleaseChannel(releaseChannel),
                supported_game_versions: supportedGameVersions,
                supported_loaders: GetProjectLoadersList(loaders),
            },
        });

        // If the versionNumber as url slug is not available use the version id
        newVersionUrlSlug = newVersionUrlSlug || newProjectVersion.id;

        const fileUrl = await saveProjectVersionFile({
            fileName: primaryVersionFile.name,
            userId: user.id,
            projectId: project.id,
            versionId: newProjectVersion.id,
            file: primaryVersionFile,
        });

        await prisma.versionFile.create({
            data: {
                file_name: primaryVersionFile.name,
                file_size: primaryVersionFile.size.toString(),
                file_type: primaryVersionFile.type,
                file_url: fileUrl,
                is_primary: true,
                version_id: newProjectVersion.id,
            },
        });

        if (!newProjectVersion?.url_slug) {
            await prisma.projectVersion.update({
                where: {
                    id: newProjectVersion.id,
                },
                data: {
                    url_slug: newProjectVersion.id,
                },
            });
        }

        const previousVersionLoaders = (() => {
            const list = [];
            for (const version of project.versions) {
                for (const loader of version.supported_loaders) {
                    if (!list.includes(loader)) list.push(loader);
                }
            }
            return list;
        })()

        await prisma.project.update({
            where: {
                id: project.id,
            },
            data: {
                updated_on: new Date(),
                type: InferProjectTypeFromLoaders([...newProjectVersion.supported_loaders, ...previousVersionLoaders])
            },
        });

        return c.json({
            message: "Successfully created new version",
            newVersionUrlSlug: newVersionUrlSlug,
        });
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

versionRouter.get("/:versionSlug/delete", async (c) => {
    try {
        const projectSlug = c.req.param("projectSlug");
        const versionSlug = c.req.param("versionSlug");

        if (!projectSlug || !versionSlug) return c.json({ message: "Invalid request" }, 400);
        const [user] = await getUserSession(c);
        if (!user?.id) {
            return c.json(
                {
                    message: "Invlid request",
                },
                400,
            );
        }

        const project = await prisma.project.findUnique({
            where: {
                url_slug: projectSlug,
            },
            select: {
                id: true,
                members: {
                    where: {
                        user_id: user?.id,
                    },
                    select: {
                        id: true,
                        user_id: true,
                    },
                },
                versions: {
                    where: {
                        url_slug: versionSlug,
                    },
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (project.members[0].user_id !== user.id) {
            return c.json({ message: "You don't have the permission to delete this project version" }, 403);
        }

        const deletedVersion = await prisma.projectVersion.delete({
            where: {
                id: project.versions[0].id,
            },
            select: {
                version_number: true
            }
        });

        await deleteAllVersionFiles(user.id, project.id, project.versions[0].id).catch((e) => console.error(e));

        const projectsNewState = await prisma.project.findUnique({
            where: {
                url_slug: projectSlug
            },
            select: {
                versions: {
                    select: {
                        supported_loaders: true
                    }
                },
                tags: true,
                featured_tags: true
            }
        })

        const projectLoaders = new Set<string>();
        for (const version of projectsNewState.versions) {
            for (const loader of version.supported_loaders) {
                projectLoaders.add(loader);
            }
        }

        const updatedProjectType = InferProjectTypeFromLoaders([...Array.from(projectLoaders)]);
        const validProjectTags = GetValidProjectCategories(updatedProjectType).map((tag) => tag.toString());
        const updatedTags = projectsNewState.tags.filter((tag) => validProjectTags.includes(tag));
        const featuredTags = projectsNewState.featured_tags.filter((featured_tag) => updatedTags.includes(featured_tag))

        await prisma.project.update({
            where: {
                id: project.id,
            },
            data: {
                updated_on: new Date(),
                type: updatedProjectType,
                tags: updatedTags,
                featured_tags: featuredTags
            },
        });

        return c.json({ message: `Project version ${deletedVersion.version_number} deleted successfully` });
    } catch (error) {
        console.error(error);
        return c.json({ message: "Internal server error" }, 500);
    }
});

export default versionRouter;

import prisma from "@/lib/prisma";
import { GetProjectTypeType, GetProjectVisibilityType, GetUsersProjectMembership } from "@/lib/utils";
import { ProjectVisibility, UserRolesInProject } from "@prisma/client";
import { maxProjectNameLength, maxProjectSummaryLength, minProjectNameLength } from "@root/config";
import { createURLSafeSlug, getProjectVisibilityType } from "@root/lib/utils";
import { Hono } from "hono";
import { getUserSession } from "../helpers/auth";
import versionRouter from "./version";

const projectRouter = new Hono();

projectRouter.post("/create-new-project", async (c) => {
	try {
		const body = await c.req.json();
		const { name, url, summary }: { name: string; url: string; summary: string } = body;
		if (!name || !url || !body?.visibility || !body?.project_type || !summary) {
			return c.json(
				{
					message: "Missing required data",
				},
				400,
			);
		}

		if (
			name.length < minProjectNameLength ||
			name.length > maxProjectNameLength ||
			url.length > maxProjectNameLength ||
			summary.length > maxProjectSummaryLength
		) {
			return c.json(
				{
					message: "Length check failed",
				},
				400,
			);
		}

		const [user] = await getUserSession(c);
		if (!user?.id) {
			return c.json(
				{
					message: "Unauthenticated request",
				},
				401,
			);
		}

		// * Check if the url slug is available
		const alreadyExistingProjectWithTheUrlSlug = await prisma.project.findUnique({
			where: {
				url_slug: url,
			},
		});

		if (alreadyExistingProjectWithTheUrlSlug?.id) {
			return c.json(
				{
					message: "That URL slug is already taken.",
				},
				400,
			);
		}

		const project = await prisma.project.create({
			data: {
				name: name,
				url_slug: url,
				type: GetProjectTypeType(body.project_type),
				visibility: GetProjectVisibilityType(body.visibility),
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

projectRouter.get("/get-all-projects", async (c) => {
	try {
		const [user] = await getUserSession(c);
		if (!user?.id) {
			return c.json(
				{
					message: "",
				},
				401,
			);
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
				type: true,
				updated_on: true,
				url_slug: true,
				visibility: true,
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
					},
				},
			},
		});

		if (!projectData?.id) {
			return c.json({ message: "Not found" }, 404);
		}

		const UsersProjectMembership = GetUsersProjectMembership(user?.id, projectData.members);

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
					type: projectData.type,
					updated_on: projectData.updated_on,
					url_slug: projectData.url_slug,
					visibility: projectData.visibility,
					members: projectData.members,
				},
			});
		}

		return c.json({ message: "Project not found", data: null }, 400);
	} catch (error) {
		console.error(error);
		return c.json({
			message: "Internal server error",
		});
	}
});

type projectInfoUpdateData = {
	name: string;
	url_slug: string;
	summary: string;
	visibility: ProjectVisibility;
};

projectRouter.post("/:projectSlug/update", async (c) => {
	try {
		const body = await c.req.json();
		const { name, url_slug, summary, visibility }: projectInfoUpdateData = body;
		const currUrlSlug = c.req.param("projectSlug");
		const urlSafeUrlSlug = createURLSafeSlug(url_slug);

		if (!currUrlSlug || !name || !urlSafeUrlSlug.value || !summary || !visibility) {
			return c.json(
				{
					message: "Missing required data",
				},
				400,
			);
		}

		if (
			name.length < minProjectNameLength ||
			name.length > maxProjectNameLength ||
			url_slug.length > maxProjectNameLength ||
			summary.length > maxProjectSummaryLength
		) {
			return c.json(
				{
					message: "Length check failed",
				},
				400,
			);
		}

		const [user] = await getUserSession(c);
		if (!user?.id) {
			return c.json(
				{
					message: "Unauthenticated request",
				},
				403,
			);
		}

		const project = await prisma.project.findUnique({
			where: {
				url_slug: currUrlSlug,
			},
			select: {
				id: true,
				members: {
					where: {
						role: "OWNER",
					},
					select: {
						user_id: true,
					},
				},
			},
		});

		if (!project?.id) {
			return c.json({ message: "Not found" }, 404);
		}

		if (project?.members?.[0]?.user_id && project.members[0].user_id !== user.id) {
			return c.json(
				{
					message: "You don't have the permission to update the project details",
				},
				403,
			);
		}

		const existingProjectWithSameUrlSlug = await prisma.project.findUnique({
			where: {
				url_slug: currUrlSlug,
			},
		});

		if (existingProjectWithSameUrlSlug?.id) {
			return c.json(
				{
					message: "That url slug is already taken",
				},
				400,
			);
		}

		await prisma.project.update({
			where: {
				url_slug: currUrlSlug,
			},
			data: {
				name: name,
				url_slug: urlSafeUrlSlug.value,
				summary: summary,
				visibility: GetProjectVisibilityType(visibility),
			},
		});

		return c.json({
			message: "Project updated successfully",
			data: {
				name: name,
				url_slug: urlSafeUrlSlug.value,
				summary: summary,
				visibility: getProjectVisibilityType(visibility),
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

// * Version router
projectRouter.route("/:projectSlug/version", versionRouter);

export default projectRouter;

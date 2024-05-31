import prisma from "@/lib/prisma";
import { GetProjectVisibilityType } from "@/lib/utils";
import { UserRolesInProject } from "@prisma/client";
import { Hono } from "hono";
import { getUserSession } from "../helpers/auth";

const projectRouter = new Hono();

projectRouter.post("/create-new-project", async (c) => {
	try {
		const body = await c.req.json();
		const { name, url, summary } = body;
		if (!name || !url || !body?.visibility || !summary) {
			return c.json(
				{
					message: "Missing required data",
				},
				400,
			);
		}

		const [user] = await getUserSession(c);
		if (!user?.id) {
			return c.json(
				{
					message: "You're not logged in",
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
				visibility: GetProjectVisibilityType(body.visibility),
				summary: summary,
			},
		});

		const projectMember = await prisma.projectMember.create({
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

export default projectRouter;

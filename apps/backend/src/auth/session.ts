import prisma from "@/lib/prisma";
import { generateRandomCode } from "@/lib/utils";
import type { AuthProviderType, LocalUserSession } from "@root/types";
import type { Context } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";
import type { BlankInput, Env } from "hono/types";

type CreateUserSessionProps = {
	user_id: string;
	email: string;
	user_name: string | null;
	name: string | null;
	avatar_image: string | null;
	role: string;
	provider: string;
	ip_addr?: string;
	browser?: string;
	os?: string;
	region?: string;
	country?: string;
};

export async function CreateUserSession({
	user_id,
	email,
	user_name,
	name,
	avatar_image,
	role,
	provider,
	ip_addr,
	browser,
	os,
	region,
	country,
}: CreateUserSessionProps): Promise<LocalUserSession> {
	const newSession = await prisma.session.create({
		data: {
			user_id: user_id,
			session_token: generateRandomCode(32),
			created_on: new Date(),
			last_used: new Date(),
			provider: provider,
			ip_addr,
			browser,
			os,
			region,
			country,
		},
	});

	return {
		user_id: newSession.user_id,
		email: email,
		user_name: user_name || "",
		name: name || "",
		avatar_image: avatar_image || "",
		role: role,
		session_id: newSession.id,
		session_token: newSession.session_token,
	};
}

type SessionValidationResult = {
	isValid: boolean;
	user: LocalUserSession | null;
};

export async function ValidateUserSession(sessionData: LocalUserSession): Promise<SessionValidationResult> {
	try {
		if (
			!sessionData?.user_id ||
			!sessionData?.email ||
			!sessionData?.user_name ||
			!sessionData?.role ||
			!sessionData?.session_id ||
			!sessionData?.session_token
		) {
			return {
				isValid: false,
				user: null,
			};
		}

		const session = await prisma.session.findUnique({
			where: {
				id: sessionData.session_id,
				user_id: sessionData.user_id,
				session_token: sessionData.session_token,
			},
			select: {
				id: true,
				session_token: true,
				user: true,
			},
		});

		if (session?.id) {
			return {
				isValid: true,
				user: {
					user_id: session.user?.id as string,
					email: session.user?.email as string,
					name: session.user?.name as string,
					user_name: session.user?.user_name as string,
					avatar_image: session.user?.avatar_image as string,
					avatar_provider: session.user?.avatar_image_provider as AuthProviderType,
					role: session.user?.role as string,
					session_id: session.id,
					session_token: session.session_token,
				},
			};
		}
	} catch (error) {}

	return {
		isValid: false,
		user: null,
	};
}

export const LogoutUser = async (c: Context<Env, "/session/logout", BlankInput>) => {
	const providedSession = (await c.req.json())?.session as LocalUserSession;
	const cookieSession = getCookie(c, "auth-session");

	if (!cookieSession || !providedSession) {
		return c.json({
			success: false,
			message: "Missing credentials",
		});
	}
	const cookieSessiondata = JSON.parse(cookieSession);

	if (
		!providedSession?.session_token ||
		!cookieSessiondata?.session_token ||
		providedSession?.session_token !== cookieSessiondata?.session_token ||
		providedSession?.user_id !== cookieSessiondata?.user_id ||
		providedSession?.session_id !== cookieSessiondata?.session_id
	) {
		return c.json({
			success: false,
			message: "Invalid request",
		});
	}

	await prisma.session.delete({
		where: {
			user_id: cookieSessiondata?.user_id,
			id: cookieSessiondata?.session_id,
			session_token: cookieSessiondata?.session_token,
		},
	});

	deleteCookie(c, "auth-session");

	return c.json({
		success: true,
		message: "Logged out",
	});
};

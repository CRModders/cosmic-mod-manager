import prisma from "@/lib/prisma";
import type { User } from "@prisma/client";
import type { LocalUserSession } from "@root/types";
import type { Context, Env } from "hono";
import { getCookie } from "hono/cookie";
import type { BlankInput } from "hono/types";

export const getSessionCookieData = <T>(c: Context<Env, string, BlankInput>): T | null => {
	try {
		const cookie = getCookie(c, "auth-session");
		if (!cookie) {
			return null;
		}
		const cookieData = JSON.parse(cookie) as T;
		return cookieData;
	} catch (error) {}
	return null;
};

export async function getLoggedInUser(session_id: string, session_token: string): Promise<User | null> {
	try {
		if (!session_id || !session_token) {
			throw new Error("Missing required fields!");
		}

		const session = await prisma.session.findUnique({
			where: {
				id: session_id,
				session_token: session_token,
			},
			select: {
				user: true,
			},
		});

		return session?.user || null;
	} catch (error) {
		return null;
	}
}

export const getUserSession = async (
	c: Context<Env, string, BlankInput>,
): Promise<[User | null, LocalUserSession | null]> => {
	try {
		// Get the current cookie data
		const cookie = getSessionCookieData<LocalUserSession>(c);
		if (!cookie || !cookie?.session_id || !cookie?.session_token) {
			return [null, null];
		}

		// Get the current logged in user from the cookie data
		const user = await getLoggedInUser(cookie?.session_id, cookie?.session_token);
		if (!user?.id) {
			return [null, null];
		}

		return [user, cookie];
	} catch (error) {
		console.error(error);
		return [null, null];
	}
};

export const isVerificationTokenValid = (tokenCreationDate: Date, validityDuration: number) => {
	if (
		tokenCreationDate &&
		validityDuration &&
		tokenCreationDate.getTime() + validityDuration * 1000 > new Date().getTime()
	) {
		return true;
	}
	return false;
};

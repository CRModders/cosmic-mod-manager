"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import UAParser from "ua-parser-js";
import { dbSessionTokenCookieKeyName, userSessionValidity_ms } from "@/config";
import { generateRandomCode } from "@/lib/utils";
import { cookies, headers } from "next/headers";
import { findUserById } from "./user";
import { GeoApiData } from "@/types";
import { revalidatePath } from "next/cache";

export const setSessionToken = async (id: string, provider?: string) => {
	const userAgent = headers().get("user-agent");

	const parsedResult = new UAParser(userAgent).getResult();
	const browser = parsedResult.browser.name;
	const os = `${parsedResult.os.name} ${parsedResult.os.version}`;

	const ip = headers().get("x-forwarded-for");
	const geoData: GeoApiData | null = {};
	if (ip) {
		try {
			const res = await fetch(
				`https://ipinfo.io/${ip}?token=${process.env.IP_TO_GEO_API_KEY}`,
			);

			const resJsonData = await res.json();

			if (resJsonData?.city || resJsonData?.region) {
				geoData.region = `${resJsonData?.region} ${resJsonData?.city}`;
			}
			if (resJsonData?.country) {
				geoData.country = resJsonData?.country;
			}
		} catch (error) {
			console.log({ function: "setSessionToken_1", error });
		}
	}

	try {
		const sessionData = await db.session.create({
			data: {
				userId: id,
				createdOn: new Date(),
				sessionToken: `${id}${generateRandomCode({})}`,
				browser: browser,
				os: os,
				ipAddr: ip || null,
				region: geoData?.region || null,
				country: geoData?.country || null,
				provider: provider || null,
			},
		});

		cookies().set(dbSessionTokenCookieKeyName, sessionData.sessionToken, {
			sameSite: "lax",
			httpOnly: true,
			expires: new Date(new Date().getTime() + userSessionValidity_ms),
			secure: true,
		});
	} catch (error) {
		console.log({ function: "setSessionToken_2", error });
	}
};

export const deleteSessionToken = async (token?: string) => {
	let sessionToken = token || null;
	if (!sessionToken) {
		sessionToken = cookies().get(dbSessionTokenCookieKeyName)?.value;
		cookies().delete(dbSessionTokenCookieKeyName);
	}

	try {
		await db.session.delete({
			where: { sessionToken: sessionToken },
		});
	} catch (error) {}
};

export const getValidSessionToken = async (
	sessionToken: string,
): Promise<string | null> => {
	try {
		const sessionData = await db.session.findUnique({
			where: { sessionToken },
		});

		if (!sessionData?.sessionToken) return null;

		if (
			sessionData?.createdOn?.getTime() + userSessionValidity_ms <
			new Date().getTime()
		) {
			await db.session.delete({
				where: { sessionToken },
			});

			return null;
		}
		await db.session.update({
			where: { sessionToken },
			data: { lastUsed: new Date() },
		});

		return sessionData?.userId;
	} catch (error) {
		return null;
	}
};

export const getAuthenticatedUser = async () => {
	const session = await auth();
	const sessionToken = await cookies().get(dbSessionTokenCookieKeyName)?.value;

	if (!sessionToken || !session?.user?.id) return null;
	const sessionUserId = await getValidSessionToken(sessionToken);
	if (!sessionUserId) return null;

	const userData = await findUserById(sessionUserId);

	return userData;
};

export const getLoggedInSessionsList = async () => {
	try {
		const user = await getAuthenticatedUser();
		if (!user?.id) return [];

		const sessionsList = await db.session.findMany({
			where: { userId: user?.id },
		});

		return sessionsList;
	} catch (error) {
		console.log({ error });
		return [];
	}
};

export const revokeSession = async (sessionToken: string) => {
	const user = await getAuthenticatedUser();

	if (!user?.id) return null;

	await deleteSessionToken(sessionToken);
	revalidatePath("/settings/sessions");
};

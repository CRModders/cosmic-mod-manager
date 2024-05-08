"use server";

import { auth } from "@/auth";
import { dbSessionTokenCookieKeyName, userSessionValidity_ms } from "@/config";
import db from "@/lib/db";
import { generateRandomCode } from "@/lib/utils";
import type { GeoApiData } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import UAParser from "ua-parser-js";
import { findUserById } from "./user";

// Sets a cookies that contains the sessionToken
export const setSessionToken = async (id: string, provider?: string) => {
	// Session data like OS name, Browser name, Geo and IP address
	const userAgent = headers().get("user-agent");
	const parsedResult = new UAParser(userAgent).getResult();
	const browser = parsedResult.browser.name;
	const os = `${parsedResult.os.name} ${parsedResult.os.version}`;

	const ip = headers().get("x-forwarded-for");
	const geoData: GeoApiData | null = {};

	// Gettings Geo data from the IP address
	if (ip) {
		try {
			const res = await fetch(`https://ipinfo.io/${ip}?token=${process.env.IP_TO_GEO_API_KEY}`);
			const resJsonData = await res.json();

			if (resJsonData?.city || resJsonData?.region) {
				geoData.region = `${resJsonData?.city} ${resJsonData?.region}`;
			}
			if (resJsonData?.country) {
				geoData.country = resJsonData?.country;
			}
		} catch (error) {
			console.log({ function: "setSessionToken > getGeoDataFromIp", error });
		}
	}

	// Storing the sessionToken in DB and setting a cookie  success
	try {
		const sessionData = await db.session.create({
			data: {
				userId: id,
				createdOn: new Date(),
				sessionToken: `${id}${generateRandomCode()}`,
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
		console.log({ function: "setSessionToken > storeSessionTokenInDb", error });
	}
};

// Deletes the sessionToken from Db
// This function is called when the user signs out, revokes a session, or the session expires
export const deleteSessionToken = async ({
	token = null,
	deleteFromDb = true,
}: { token?: string; deleteFromDb?: boolean }) => {
	let sessionToken = token || null;
	if (!sessionToken) {
		sessionToken = cookies().get(dbSessionTokenCookieKeyName)?.value;
		cookies().delete(dbSessionTokenCookieKeyName);
	}

	try {
		if (sessionToken && deleteFromDb === true) {
			await db.session.delete({
				where: { sessionToken: sessionToken },
			});
		}
	} catch (error) {}
};

export const getValidSessionToken = async (sessionToken: string): Promise<string | null> => {
	try {
		if (!sessionToken) return null;

		const sessionData = await db.session.findUnique({
			where: { sessionToken },
		});

		if (!sessionData?.sessionToken) {
			await deleteSessionToken({ deleteFromDb: false });
			return null;
		}

		if (sessionData?.createdOn?.getTime() + userSessionValidity_ms < new Date().getTime()) {
			await deleteSessionToken({ token: sessionToken });

			return null;
		}
		await db.session.update({
			where: { sessionToken },
			data: { lastUsed: new Date() },
		});

		return sessionData?.userId;
	} catch (error) {
		// console.log({ function: "getValidSessionToken", error });
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

	await deleteSessionToken({ token: sessionToken });
	revalidatePath("/settings/sessions");
};

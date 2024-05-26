import prisma from "@/lib/prisma";
import { Capitalize, generateRandomCode } from "@/lib/utils";
import type { Profile } from "@/types";
import type { User } from "@prisma/client";
import type { Context } from "hono";
import type { BlankInput, Env } from "hono/types";
import { getUserSession } from "../helpers/auth";

export function ValidateProviderProfileData({ email, providerAccountId, accessToken }: Profile) {
	if (!email || !providerAccountId || !accessToken) {
		throw new Error("Invalid profile data received from the auth provider");
	}

	return true;
}

type AuthenticationResult = {
	success: boolean;
	message?: string;
	user?: User;
};

export async function GetUserData({
	email,
	id,
	updated_avatar_image,
}: {
	email?: string;
	id?: string;
	updated_avatar_image?: string | null;
}): Promise<AuthenticationResult> {
	if (!email && !id) {
		throw new Error("Either email or id is required");
	}

	// The updated_avatar_image will only be defined when the avatar_image url the avatar_image_provider has changed
	if (updated_avatar_image) {
		const user = await prisma.user.update({
			where: {
				id: id,
			},
			data: {
				avatar_image: updated_avatar_image,
			},
		});

		return {
			success: true,
			user: { ...user, avatar_image: updated_avatar_image },
		};
	}

	const user = await prisma.user.findUnique({
		where: {
			id: id,
		},
	});

	return {
		success: true,
		user: user,
	};
}

export async function CreateNewProviderAccout(user: User, profile: Profile): Promise<boolean> {
	const result = await prisma.account.create({
		data: {
			user_id: user?.id,
			provider: profile?.providerName,
			provider_account_id: `${profile?.providerAccountId}`,
			provider_account_email: profile?.email,
			avatar_image: profile?.avatarImage,
			access_token: profile.accessToken,
			refresh_token: profile.refreshToken,
			token_type: profile.tokenType,
			auth_type: profile.authType,
			scope: profile.scope,
		},
	});

	if (result?.id) return true;
	return false;
}

export async function CreateNewUser(profile: Profile): Promise<AuthenticationResult> {
	const userName = generateRandomCode(24);

	const newUser = await prisma.user.create({
		data: {
			name: profile?.name || "",
			user_name: userName,
			email: profile.email,
			email_verified: new Date(),
			avatar_image: profile?.avatarImage || null,
			avatar_image_provider: profile?.providerName || null,
		},
	});

	await CreateNewProviderAccout(newUser, profile);

	return {
		success: true,
		message: "Signed up successfully",
		user: newUser,
	};
}

export async function LinkProviderAccount(profile: Profile, userSession: User): Promise<AuthenticationResult> {
	const existingAccountWithSameAuthProvider = await prisma.account.findFirst({
		where: {
			provider_account_id: `${profile.providerAccountId}`,
			provider: profile.providerName,
		},
	});

	if (existingAccountWithSameAuthProvider?.id) {
		throw new Error(
			"This auth provider is already linked with a User. You can't link the same auth provider with multiple user accounts.",
		);
	}

	// If there's no existing account with the same provider in use, that provider can be linked safely
	const newProviderLinked = await CreateNewProviderAccout(userSession, profile);
	if (newProviderLinked === true) {
		return {
			success: true,
			message: `${Capitalize(
				profile.providerName,
			)} has been linked to your account as an auth provider. Now you can use ${profile.providerName} to signin.`,
		};
	}
}

export default async function authenticateUser(
	profile: Profile,
	c: Context<Env, string, BlankInput>,
): Promise<AuthenticationResult> {
	// Check if there's already a logged in session, if yes that means it's a provider link request
	const [userSession] = await getUserSession(c);
	if (userSession?.id) {
		return await LinkProviderAccount(profile, userSession);
	}

	// Check if there's already an Auth Account with that email, if yes that means the user alerady exists so log them in
	const existingAuthAccount = await prisma.account.findFirst({
		where: {
			provider_account_id: `${profile?.providerAccountId}`,
			provider: profile.providerName,
		},
		select: {
			id: true,
			user_id: true,
			user: {
				select: {
					avatar_image_provider: true,
				},
			},
		},
	});

	if (existingAuthAccount?.id) {
		await prisma.account.update({
			where: {
				id: existingAuthAccount.id,
			},
			data: {
				provider_account_id: `${profile?.providerAccountId}`,
				avatar_image: profile?.avatarImage,
				access_token: profile.accessToken,
				refresh_token: profile.refreshToken,
				token_type: profile.tokenType,
				auth_type: profile.authType,
				scope: profile.scope,
			},
		});

		const updated_avatar_image =
			existingAuthAccount?.user?.avatar_image_provider === profile.providerName ? profile?.avatarImage : null;
		return await GetUserData({
			id: existingAuthAccount.user_id,
			updated_avatar_image,
		});
	}

	// Check if there's any account with that email, if yes means this auth provider is not linked with that account, so just return an error
	const existingUser = await prisma.user.findUnique({
		where: {
			email: profile?.email,
		},
		select: {
			email: true,
		},
	});

	if (existingUser?.email) {
		throw new Error(
			"An account already exists with this email address but this auth provider is not linked to that, please signin in using an auth provider that's linked to your account",
		);
	}

	return await CreateNewUser(profile);
}

import type { User } from "@prisma/client";

export interface Profile {
	name?: string | null;
	email: string;
	providerName: string;
	providerAccountId: string;
	authType?: string | null;
	accessToken: string;
	refreshToken?: string | null;
	tokenType?: string | null;
	scope?: string | null;
	avatarImage?: string | null;
}

export interface authHandlerResult {
	status: {
		success: boolean;
		message: string;
	};
	user?: User;
}

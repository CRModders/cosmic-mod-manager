//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { findUserByEmail, findUserById, matchPassword } from "@/app/api/actions/user";
import authConfig from "@/auth.config";
import db from "@/lib/db";
import { parseProfileProvider, parseUsername } from "@/lib/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { DeletedUser, Providers, UserRoles } from "@prisma/client";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { deleteSessionToken, setSessionToken } from "./app/api/actions/auth";
import { dbSessionTokenCookieKeyName, maxUsernameLength } from "./config";

declare module "next-auth" {
	// Additional types in the User field
	interface User {
		role?: UserRoles;
		userName?: string;
		profileImageProvider?: string;
		emailVerified: Date;
	}
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	callbacks: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		async signIn({ user, account }): Promise<any> {
			// Delete any previous session, if exists
			// If not done, stale sessions may stack up when usere links and unlinks auth providers
			await deleteSessionToken({});

			let deletedAccount: DeletedUser | null = null;
			if (!user?.userName) {
				try {
					deletedAccount = await db.deletedUser.delete({
						where: { email: user?.email },
					});
				} catch (error) {}
			}

			const newRandomUsername = parseUsername(user.id);
			user.userName =
				deletedAccount?.userName || newRandomUsername.slice(0, Math.min(maxUsernameLength, newRandomUsername.length));
			user.profileImageProvider = account.provider;

			return true;
		},

		// Returns the session object when using auth() function and useSession() also i guess
		async session({ session, token }) {
			if (token?.sub) {
				session.user.id = token.sub;
			}
			const dbSessionToken = cookies().get(dbSessionTokenCookieKeyName)?.value;
			if (dbSessionToken) {
				session.sessionToken = dbSessionToken;
			}

			return session;
		},

		async jwt({ token }) {
			return token;
		},
	},

	// Events are fired when an action happens, callback functions execute first and then the event functions
	events: {
		...authConfig,
		// Event fired when user links a provider account. To link a provider account a user has to login using a provider that has the same email as his account on site
		async linkAccount({ user, account }) {
			const userData = await findUserById(user.id);

			const data: {
				emailVerified?: Date;
				profileImageProvider?: Providers;
			} = {};

			if (!userData?.emailVerified || !userData?.profileImageProvider) {
				// Set the email verified to the date if it's null i.e. this is a new registration
				if (!userData?.emailVerified) {
					data.emailVerified = new Date();
				}

				if (!userData?.profileImageProvider) {
					data.profileImageProvider = parseProfileProvider(account.provider);
				}

				// Update the data in the database
				await db.user.update({
					where: {
						id: user?.id,
					},
					data,
				});
			}
		},
		// Event fired when the user signs in
		async signIn({ user, account, profile }) {
			// Delete the previous provider account if the user signs in using the same provider with different email
			const accountsData = await db.account.findMany({
				where: {
					userId: user?.id,
					provider: account?.provider,
				},
			});

			for (const providerAccount of accountsData) {
				if (
					providerAccount?.provider === account?.provider &&
					providerAccount?.providerAccountId !== account?.providerAccountId
				) {
					await db.account.delete({
						where: {
							id: providerAccount?.id,
						},
					});
				}
			}

			// profile?.image_url   ==>   Discord
			// profile?.picture     ==>   Google
			// profile?.avatar_url  ==>   Github and Gitlab
			const profileImageLink = profile?.image_url || profile?.picture || profile?.avatar_url;

			await db.account.updateMany({
				where: {
					userId: user?.id,
					provider: account?.provider,
					providerAccountId: account?.providerAccountId,
				},
				data: {
					profileImage: profileImageLink,
					providerAccountEmail: profile?.email,
				},
			});
			await setSessionToken(user?.id, account?.provider);
		},
		async signOut() {
			await deleteSessionToken({});
		},
	},

	adapter: PrismaAdapter(db),

	session: {
		strategy: "jwt",
	},

	secret: process.env.AUTH_SECRET,

	pages: {
		signIn: "/login",
		// newUser: "/onboarding",
	},

	providers: [
		...authConfig.providers,
		// The credential provider is being added here instead of auth.config.ts file because that config file is used inside of middleware and that does not support db (prisma + MongoDB) integration
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",

			// The signIn logic of the credentials provider
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const userData = await db.user.findUnique({
					where: { email: credentials.email as string },
				});

				const isCorrectPassword = await matchPassword(credentials?.password as string, userData.password);

				if (isCorrectPassword) {
					const user = await findUserByEmail(credentials?.email as string);
					return user;
				}

				return null;
			},
		}),
	],
});

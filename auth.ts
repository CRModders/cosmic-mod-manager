//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Providers, UserRoles } from "@prisma/client";
import {
	findUserByEmail,
	findUserById,
	getCurrentAuthUser,
	matchPassword,
} from "@/app/api/actions/user";
import db from "@/lib/db";
import { parseProfileProvider, parseUsername } from "@/lib/user";

declare module "next-auth" {
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
			user.userName = parseUsername(user.id);
			user.profileImageProvider = account.provider;

			return true;
		},

		async session({ session, token }) {
			if (token?.sub) {
				session.user.id = token.sub;
			}

			return session;
		},

		async jwt({ token }) {
			return token;
		},
	},

	events: {
		...authConfig,
		async linkAccount({ user, account }) {
			// Set the email verified for oauth users
			const userData = await findUserById(user.id);

			const data: {
				emailVerified?: Date;
				profileImageProvider?: Providers;
			} = {};

			if (!userData?.emailVerified || !userData?.profileImageProvider) {
				if (!userData?.emailVerified) {
					data.emailVerified = new Date();
				}

				if (!userData?.profileImageProvider) {
					data.profileImageProvider = parseProfileProvider(account.provider);
				}

				await db.user.update({
					where: {
						id: user?.id,
					},
					data,
				});
			}
		},
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
			const profileImageLink =
				profile?.image_url || profile?.picture || profile?.avatar_url;

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
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: "jwt" },
	secret: process.env.AUTH_SECRET,
	providers: [
		...authConfig.providers,
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const userData = await db.user.findUnique({
					where: { email: credentials.email as string },
				});

				const isCorrectPassword = await matchPassword(
					credentials?.password as string,
					userData.password,
				);

				if (isCorrectPassword) {
					const user = await findUserByEmail(credentials?.email as string);
					return user;
				}

				return null;
			},
		}),
	],
});

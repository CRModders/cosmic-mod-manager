//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>. 

import NextAuth from "next-auth";
import authConfig from "./auth.config";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRoles } from "@prisma/client";
import {
	findUserByEmail,
	findUserById,
	matchPassword,
} from "./app/api/actions/user";
import db from "@/lib/db";

declare module "next-auth" {
	interface User {
		role?: UserRoles;
		userName?: string;
		emailVerified: Date;
	}
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	callbacks: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		async signIn({ user, account }): Promise<any> {
			user.userName = user.id;

			// Delete any existing provider with the same id
			// Ideally it shouldn't happen, but it may happen if a user was deleted from the database but his provider accounts were not deleted
			await db.account.deleteMany({
				where: {
					provider: account.provider,
					providerAccountId: account.providerAccountId,
				},
			});

			return user;
		},

		async session({ session, token }) {
			if (token?.sub) {
				session.user.id = token.sub;

				const userData = await findUserById(token.sub);
				if (userData?.role) {
					session.user.role = userData.role;
				}
			}

			return session;
		},
		async jwt({ token }) {
			return token;
		},
	},

	events: {
		...authConfig,
		async linkAccount({ user }) {
			// Set the email verified for oauth users
			const userData = await findUserById(user.id);

			if (!userData.emailVerified) {
				await db.user.update({
					where: { id: user.id },
					data: {
						emailVerified: new Date(),
					},
				});
			}
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

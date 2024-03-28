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

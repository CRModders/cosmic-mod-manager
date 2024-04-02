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
		async signIn({ user, account, profile }): Promise<any> {
			user.userName = parseUsername(user.id);
			user.profileImageProvider = account.provider;

			const alreadyLoggedInUser = await getCurrentAuthUser();

			if (alreadyLoggedInUser?.id) {
				const linkedProviders = await db.account.findMany({
					where: {
						userId: alreadyLoggedInUser?.id,
						provider: account.provider,
					},
				});

				if (linkedProviders?.length > 0) {
					try {
						await db.account.deleteMany({
							where: {
								userId: alreadyLoggedInUser?.id,
								provider: account.provider,
							},
						});
					} catch (error) {}
				} else if (
					linkedProviders?.at(0)?.userId &&
					alreadyLoggedInUser?.id !== linkedProviders?.at(0)?.userId
				) {
					return null;
				}

				return alreadyLoggedInUser;
			}

			try {
				await db.account.deleteMany({
					where: {
						userId: user?.id,
						provider: account?.provider,
					},
				});
			} catch (error) {}

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
			// profile?.image_url   ==>   Discord
			// profile?.picture     ==>   Google
			// profile?.avatar_url  ==>   Github and Gitlab
			const profileImageLink =
				profile?.image_url || profile?.picture || profile?.avatar_url;

			await db.account.updateMany({
				where: { userId: user?.id, provider: account?.provider },
				data: {
					profileImage: profileImageLink,
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

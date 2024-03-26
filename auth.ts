import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRoles } from "@prisma/client";
import db from "@/lib/db";
import { findUserById } from "./app/api/actions/user";

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
		async signIn({ user }): Promise<any> {
			user.userName = user.id;
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
	...authConfig,
});

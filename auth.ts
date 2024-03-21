import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/db/prisma";

export const { handlers, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	...authConfig,
	trustHost: true,
	secret: process.env.AUTH_SECRET,
});

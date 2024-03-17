import NextAuth from "next-auth";
import authConfig from "./auth.config";
import connectToDatabase from "./lib/db/connect";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

const dbClient = connectToDatabase();

export const { handlers, auth } = NextAuth({
	adapter: MongoDBAdapter(dbClient),
	session: { strategy: "jwt" },
	...authConfig,
});

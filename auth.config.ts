import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "@auth/core/providers/google";
import GitlabProvider from "@auth/core/providers/gitlab";
import type { NextAuthConfig } from "next-auth";

export default {
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
			allowDangerousEmailAccountLinking: true,
		}),
		DiscordProvider({
			clientId: process.env.DISCORD_ID,
			clientSecret: process.env.DISCORD_SECRET,
			allowDangerousEmailAccountLinking: true,
		}),

		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			allowDangerousEmailAccountLinking: true,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
		GitlabProvider({
			clientId: process.env.GITLAB_ID,
			clientSecret: process.env.GITLAB_SECRET,
			allowDangerousEmailAccountLinking: true,
		}),
	],
} satisfies NextAuthConfig;

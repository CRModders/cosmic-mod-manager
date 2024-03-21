import { DiscordIcon, GithubIcon, GoogleIcon } from "@/components/icons";

const authProvidersList = [
	{
		name: "Github",
		icon: (
			<GithubIcon
				size="1.6rem"
				className="text-foreground dark:text-foreground_dark"
			/>
		),
	},
	{
		name: "Discord",
		icon: (
			<DiscordIcon
				size="1.6rem"
				className="text-foreground dark:text-foreground_dark"
			/>
		),
	},
	{
		name: "Google",
		icon: (
			<GoogleIcon
				size="1.6rem"
				className="text-foreground dark:text-foreground_dark"
			/>
		),
	},
];

export default authProvidersList;

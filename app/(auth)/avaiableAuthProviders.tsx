import {
	DiscordIcon,
	GithubIcon,
	GitlabIcon,
	GoogleIcon,
} from "@/components/Icons";

const authProvidersList = [
	{
		name: "Google",
		icon: (
			<GoogleIcon
				size="1.4rem"
				className="text-foreground dark:text-foreground_dark"
			/>
		),
	},
	{
		name: "Discord",
		icon: (
			<DiscordIcon
				size="1.4rem"
				className="text-foreground dark:text-foreground_dark"
			/>
		),
	},
	{
		name: "Github",
		icon: (
			<GithubIcon
				size="1.3rem"
				className="text-foreground dark:text-foreground_dark"
			/>
		),
	},
	{
		name: "Gitlab",
		icon: (
			<GitlabIcon
				size="1.5rem"
				className="text-foreground dark:text-foreground_dark"
			/>
		),
	},
];

export default authProvidersList;

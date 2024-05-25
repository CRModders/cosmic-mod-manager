import { DiscordIcon, GithubIcon, GitlabIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AuthProvidersEnum, type AuthProviderType } from "@root/types";
import React, { useState } from "react";
import { getSignInUrl } from "./auth";

export const ConfiguredAuthProviders = [
	AuthProvidersEnum.GITHUB,
	AuthProvidersEnum.DISCORD,
	// AuthProvidersEnum.GOOGLE,
	AuthProvidersEnum.GITLAB,
];

export const authProvidersList = [
	{
		name: "Github",
		icon: <GithubIcon size="1.3rem" className="text-foreground dark:text-foreground_dark" />,
	},
	{
		name: "Discord",
		icon: <DiscordIcon size="1.4rem" className="text-foreground dark:text-foreground_dark" />,
	},
	// {
	// 	name: "Google",
	// 	icon: <GoogleIcon size="1.4rem" className="text-foreground dark:text-foreground_dark" />,
	// },
	{
		name: "Gitlab",
		icon: <GitlabIcon size="1.5rem" className="text-foreground dark:text-foreground_dark" />,
	},
];

const AuthProviders = () => {
	const [loading, setLoading] = useState(false);

	return (
		<>
			{authProvidersList?.map((provider) => {
				return (
					<React.Fragment key={provider.name}>
						<form
							onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
								e.preventDefault();
								setLoading(true);
								const signinUrl = await getSignInUrl(provider.name.toLowerCase() as AuthProviderType);
								window.location.href = signinUrl;
							}}
							className="w-full flex items-center justify-center gap-4"
							name={provider.name}
						>
							<Button
								type="submit"
								// size="md"
								aria-label={`Continue using ${provider.name}`}
								className="w-full py-4 flex items-center justify-center bg-background-shallow/65 dark:bg-background-shallow hover:bg-background-shallow dark:hover:bg-background-shallow/75"
								variant="secondary"
							>
								<i className="w-8 flex items-center justify-start">{provider.icon}</i>
								<p className="text-foreground-muted font-semibold text-md">{provider.name}</p>
							</Button>
						</form>
					</React.Fragment>
				);
			})}
			{loading === true && (
				<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full rounded-xl flex items-center justify-center">
					<div className="w-full h-full flex items-center justify-center relative rounded-xl">
						<div className="w-full h-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-background dark:bg-background_dark opacity-60" />
						<Spinner size="1.5rem" />
					</div>
				</div>
			)}
		</>
	);
};

export default AuthProviders;

import React from "react";
import Link from "next/link";
import { DiscordIcon, GithubIcon, GoogleIcon } from "@/components/icons";
import SubmitButton from "./SubmitBtn";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const RegisterPage = () => {
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

	return (
		<div className="loginFormWrapper w-full flex items-center justify-center ">
			<div className="formModal flex w-full max-w-sm flex-col gap-4 rounded-large">
				<Card className="">
					<CardHeader className="w-full flex items-center justify-start">
						<h1 className="w-full text-left text-xl font-semibold">Sign Up</h1>
					</CardHeader>
					<CardContent className="w-full flex flex-col gap-2">
						<div className="auth_providers_list w-full flex flex-col items-center justify-center gap-3">
							{authProvidersList?.map((provider) => {
								return (
									<React.Fragment key={provider.name}>
										<SubmitButton provider={provider} />
									</React.Fragment>
								);
							})}
						</div>

						<div className="flex items-center gap-4 py-2">
							<hr className="bg-background_hover dark:bg-background_hover_dark border-none w-full h-[0.1rem] flex-1" />
							<p className="shrink-0 text-sm text-default-500">OR</p>
							<hr className="bg-background_hover dark:bg-background_hover_dark border-none w-full h-[0.1rem] flex-1" />
						</div>

						<p className="text-center text-medium font-sans text-[var(--regular-secondary-text)]">
							Already have an account?&nbsp;
							<Link
								href="/login"
								className="text-[var(--primary-accent-text)] hover:underline underline-offset-2 text-medium font-semibold"
							>
								Log In
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default RegisterPage;

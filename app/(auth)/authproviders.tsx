"use client";

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import {
	DiscordIcon,
	GithubIcon,
	GitlabIcon,
	GoogleIcon,
} from "@/components/Icons";

export const authProvidersList = [
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

import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";

const AuthProviders = () => {
	const [loading, setLoading] = useState(false);
	const session = useSession();
	const { toast } = useToast();
	return (
		<>
			{authProvidersList?.map((provider) => {
				return (
					<React.Fragment key={provider.name}>
						<form
							onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
								e.preventDefault();
								if (session?.data?.user?.email) {
									toast({
										title: "You are already logged in.",
									});

									return;
								}
								setLoading(true);
								signIn(provider.name.toLowerCase());
							}}
							className="w-full flex items-center justify-center gap-4"
						>
							<Button
								type="submit"
								size="md"
								aria-label={`Continue using ${provider.name}`}
								className="w-full py-4 flex items-center justify-center"
								variant="secondary"
							>
								<i className="w-8 flex items-center justify-start">
									{provider.icon}
								</i>
								<p className="text-foreground dark:text-foreground_dark">
									{provider.name}
								</p>
							</Button>
						</form>
					</React.Fragment>
				);
			})}
			{loading === true && (
				<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full rounded-xl flex items-center justify-center">
					<div className="w-full h-full flex items-center justify-center relative rounded-xl">
						<div className="w-full h-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-background dark:bg-background_dark opacity-60" />
						<Spinner size="2.4rem" />
					</div>
				</div>
			)}
		</>
	);
};

export default AuthProviders;

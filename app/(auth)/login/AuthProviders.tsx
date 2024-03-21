"use client";

import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/app/loading";
import { useToast } from "@/components/ui/use-toast";
import authProvidersList from "../authproviders";

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
								if (session.data) {
									toast({
										title: "You are already logged in.",
									});

									console.log(session);
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
								className="w-full py-4 bg-background_hover dark:bg-background_hover_dark hover:bg-background_hover dark:hover:bg-background_hover_dark flex items-center justify-center gap-4"
							>
								{provider.icon}
								<p className="text-foreground dark:text-foreground_dark">
									Log In with{" "}
									<span className="font-semibold">{provider.name}</span>
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

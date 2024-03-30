import React from "react";
import type { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import CopyBtn from "@/components/copyBtn";
import { findUserByUsername } from "@/app/api/actions/user";

type Props = {
	params: {
		userName: string;
	};
};

const ProfilePage = async ({ params }: Props) => {
	const user = await findUserByUsername(params.userName);

	return (
		<div className="w-full flex items-center justify-center py-16">
			{/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
			{user && user?.email && (
				<div className="container max-w-3xl rounded-lg px-4 md:p-0">
					<Card className="w-full flex items-center justify-start gap-6 p-8">
						<CardContent className="w-full flex flex-col items-center justify-center p-0">
							<div className="w-full flex items-center justify-start gap-6 flex-col sm:flex-row">
								<Avatar className="flex items-center justify-center w-20 h-20">
									{user?.image && (
										<AvatarImage src={user?.image} alt={`${user?.name} `} />
									)}

									<AvatarFallback className="bg-background_hover dark:bg-background_hover_dark w-3/4 h-3/4">
										{user?.name?.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>

								<div className=" grow flex flex-col items-center sm:items-start justify-center">
									<h1 className="text-2xl font-semibold">{user?.name}</h1>
									<div className="flex items-center justify-center gap-4">
										<p className="flex items-center justify-center text-foreground_muted dark:text-foreground_muted_dark">
											<span className=" text-foreground_muted/70 dark:text-foreground_muted_dark/70 select-none">
												@
											</span>
											{user?.userName}
										</p>
										<CopyBtn
											text={user.userName || "undefined"}
											successMessage="Copied username to clipboard"
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{(!user || !user?.email) && (
				<div className="w-full flex items-center justify-center">
					<h1 className="text-lg md:text-2xl p-4">
						No user exists with username{" "}
						<span className=" text-foreground/70 dark:text-foreground_dark/70 font-semibold">
							"
						</span>
						<span className="font-semibold">{params.userName}</span>
						<span className=" text-foreground/70 dark:text-foreground_dark/70 font-semibold">
							"
						</span>
					</h1>
				</div>
			)}
		</div>
	);
};

export default ProfilePage;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const userName = params.userName;
	const user = await findUserByUsername(userName);

	if (!user?.email) {
		return {
			title: " ",
			description: "",
		};
	}

	return {
		title: user.userName,
		description: `${user.userName}'s profile on CRMM`,
	};
}

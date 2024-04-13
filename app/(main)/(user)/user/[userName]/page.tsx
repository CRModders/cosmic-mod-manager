//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import React from "react";
import type { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import CopyBtn from "@/components/copyBtn";
import { findUserByUsername } from "@/app/api/actions/user";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
									{user?.image && <AvatarImage src={user?.image} alt={`${user?.name} `} />}

									<AvatarFallback className="bg-background_hover dark:bg-background_hover_dark w-3/4 h-3/4">
										{user?.name?.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>

								<div className="grow max-w-full flex flex-col items-center sm:items-start justify-center">
									<h1 className="text-2xl font-semibold">{user?.name}</h1>
									<div className="max-w-full flex items-center justify-center gap-4">
										<ScrollArea className="max-w-full">
											<p className="flex w-full items-center justify-center text-foreground_muted dark:text-foreground_muted_dark">
												<span className=" text-foreground_muted/70 dark:text-foreground_muted_dark/70 select-none">
													@
												</span>
												{user?.userName}
											</p>
											<ScrollBar orientation="horizontal" />
										</ScrollArea>
										<CopyBtn text={user.userName || "undefined"} successMessage="Copied username to clipboard" />
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
						<span className=" text-foreground/70 dark:text-foreground_dark/70 font-semibold">"</span>
						<span className="font-semibold">{params.userName}</span>
						<span className=" text-foreground/70 dark:text-foreground_dark/70 font-semibold">"</span>
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

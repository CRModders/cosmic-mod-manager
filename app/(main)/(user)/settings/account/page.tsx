//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>. 

import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import EditProfileDialog from "./profile/editProfileDialog";
import { findUserById } from "@/app/api/actions/user";
import { Card } from "@/components/ui/card";
import EmailField from "./account_security/email";

const UnauthenticatedUserMsg = () => {
	return (
		<div className="w-full flex items-center justify-center">
			<p className="text-center">You are not signed in !</p>
		</div>
	);
};

const AccountSettingsPage = async () => {
	const session = await auth();

	if (!session?.user?.email) {
		return <UnauthenticatedUserMsg />;
	}
	const user = await findUserById(session.user.id);

	if (!user?.email) {
		return <UnauthenticatedUserMsg />;
	}

	return (
		<div className="w-full flex flex-col items-center justify-start pb-8 gap-4">
			<Card className="w-full flex flex-col items-center justify-center px-5 py-4 gap-4 rounded-lg">
				<div className="w-full flex flex-wrap gap-4 items-center justify-between">
					<h2 className="flex text-left text-2xl font-semibold text-foreground/80 dark:text-foreground_dark/80">
						User profile
					</h2>
					<div>
						<EditProfileDialog name={user.name} username={user.userName} />
					</div>
				</div>
				<div className="w-full flex flex-col items-center justify-center my-2">
					<div className="w-full flex flex-col sm:flex-row items-center justify-start gap-6">
						<Avatar className="flex items-center justify-center w-24 h-24">
							{user?.image && (
								<AvatarImage src={user?.image} alt={`${user?.name} `} />
							)}

							<AvatarFallback className="bg-background_hover dark:bg-background_hover_dark w-3/4 h-3/4">
								{user?.name?.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div>
							<h1 className="text-3xl font-semibold">{user.name}</h1>
							<p>
								<span className="text-foreground/60 dark:text-foreground_dark/60 select-none text-xl">
									@
								</span>
								{user.userName}
							</p>
						</div>
					</div>
				</div>
			</Card>

			<Card className="w-full flex flex-col items-center justify-center px-5 py-4 gap-4 rounded-lg">
				<div className="w-full flex flex-wrap gap-4 items-center justify-between">
					<h2 className="flex text-left text-2xl font-semibold text-foreground/80 dark:text-foreground_dark/80">
						Account security
					</h2>
				</div>
				<div className="w-full flex flex-col items-center justify-center my-2 gap-4">
					<div className="w-full flex flex-col items-start justify-center gap-2">
						<p className="text-xl font-semibold text-foreground_muted dark:text-foreground_muted_dark">
							Email
						</p>
						<EmailField email={user.email} />
					</div>
				</div>
			</Card>
		</div>
	);
};

export default AccountSettingsPage;

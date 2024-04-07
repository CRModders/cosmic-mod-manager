//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { auth } from "@/auth";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";
import SignOutBtn from "./signOutBtn";
import { getAuthenticatedUser } from "@/app/api/actions/auth";
import { dbSessionTokenCookieKeyName } from "@/config";
import { cookies } from "next/headers";

const ValidateSession = async () => {
	const session = await auth();
	const sessionToken = await cookies().get(dbSessionTokenCookieKeyName)?.value;

	if (!session?.user?.id || !sessionToken) {
		return null;
	}

	const authenticatedUser = await getAuthenticatedUser();

	if (authenticatedUser?.id) {
		return null;
	}

	return (
		<section className="w-full fixed top-0 left-0 z-[500] bg-background dark:bg-background_dark text-foreground dark:text-foreground_dark">
			<div className="w-full p-6 min-h-[100dvh] flex flex-col items-center justify-center gap-6">
				<div className="w-full flex items-center justify-center gap-6 text-rose-600 dark:text-rose-500">
					<ExclamationTriangleIcon className="w-10 h-10" />
					<h1 className="text-4xl font-semibold font-mono">
						Invalid local session!
					</h1>
				</div>
				<p className="text-center text-rose-600 dark:text-rose-500 text-2xl font-mono font-semibold">
					Signing out...
				</p>
			</div>
			<SignOutBtn />
		</section>
	);
};

export default ValidateSession;

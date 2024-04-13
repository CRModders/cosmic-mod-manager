//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { auth } from "@/auth";
import React from "react";
import SignOutBtn from "./signOutBtn";
import { getAuthenticatedUser } from "@/app/api/actions/auth";
import { sleep } from "@/lib/utils";
import FormErrorMsg from "../formErrorMsg";
import { Spinner } from "../ui/spinner";

const ValidateSession = async () => {
	await sleep(500);

	const session = await auth();

	if (!session?.user?.id) {
		return null;
	}

	const authenticatedUser = await getAuthenticatedUser();

	if (authenticatedUser?.id) {
		return null;
	}

	return (
		<section className="w-full fixed top-0 left-0 z-[500] bg-background dark:bg-background_dark text-foreground dark:text-foreground_dark">
			<div className="w-full p-6 min-h-[100dvh] flex flex-col items-center justify-center gap-6">
				<div className="max-w-lg w-full flex flex-col items-center justify-center gap-6 text-danger dark:text-danger_dark">
					<FormErrorMsg msg="Invalid local session!" className="text-3xl p-4 font-mono" iconClassName="w-9 mr-2 h-8" />
				</div>
				<div className="flex gap-4 items-center justify-center">
					<Spinner size="1.5rem" className=" text-danger dark:text-danger_dark" />
					<p className="text-center text-danger dark:text-danger_dark text-2xl font-mono">Signing out</p>
				</div>
			</div>
			<SignOutBtn />
		</section>
	);
};

export default ValidateSession;

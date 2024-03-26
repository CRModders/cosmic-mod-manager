import { findUserById } from "@/app/api/actions/user";
import { auth } from "@/auth";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";
import SignOutLocalSession from "./signOut";

const ValidateSession = async () => {
	const session = await auth();

	if (!session?.user?.email) {
		return null;
	}

	const userData = await findUserById(session.user.id);

	if (userData?.id) {
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
				<p className="text-3xl font-mono text-rose-600 dark:text-rose-500">
					Signing out...
				</p>
			</div>
			<SignOutLocalSession />
		</section>
	);
};

export default ValidateSession;

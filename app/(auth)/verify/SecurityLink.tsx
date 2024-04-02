import Link from "next/link";
import React from "react";

const SecurityLink = () => {
	return (
		<p className="flex flex-wrap items-center justify-start text-sm text-foreground/80 dark:text-foreground_dark/80">
			Didn't request this action?&nbsp;
			<Link
				href={"/settings/sessions"}
				className="text-blue-500 dark:text-blue-400t p-1 rounded hover:bg-blue-500/10 dark:hover:bg-blue-400/10"
			>
				Manage logged in sessions
			</Link>
		</p>
	);
};

export default SecurityLink;

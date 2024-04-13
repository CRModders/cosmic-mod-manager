"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";

type Props = {
	children: React.ReactNode;
	showSessionPageWarning?: string;
};

const SessionListPageWrapper = ({
	children,
	showSessionPageWarning = "true",
}: Props) => {
	const [showWarning, setShowWarning] = useState<boolean>(
		showSessionPageWarning !== "false",
	);

	if (showWarning !== false) {
		return (
			<div className="w-full flex flex-col items-center justify-center p-8 bg-yellow-600/10 dark:bg-yellow-400/5 rounded-lg">
				<h1 className="text-xl sm:text-2xl mb-2 text-yellow-600 dark:text-yellow-400">
					Warning: Sensitive info
				</h1>
				<p className="text-yellow-600 dark:text-yellow-400">
					This page contains sensitive info such as your IP address and
					location. Make sure not to send any screenshots, recordings, or info
					from this page to people you dont want to have this info.
				</p>

				<Button
					className="px-10 mt-4"
					variant="outline"
					onClick={() => {
						setShowWarning(false);
					}}
				>
					View page
				</Button>
			</div>
		);
	}

	return children;
};

export default SessionListPageWrapper;

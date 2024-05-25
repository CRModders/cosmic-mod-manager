import { Button } from "@/components/ui/button";
import type React from "react";

type Props = {
	showWarning: boolean;
	setShowWarning: React.Dispatch<React.SetStateAction<boolean>>;
	children: React.ReactNode;
};

const SessionListPageWrapper = ({ children, showWarning, setShowWarning }: Props) => {
	if (showWarning !== false) {
		return (
			<div className="w-full flex flex-col items-center justify-center p-8 bg-yellow-600/10 dark:bg-yellow-400/5 rounded-lg">
				<h1 className="text-xl sm:text-2xl mb-2 text-yellow-600 dark:text-yellow-400">Warning: Sensitive info</h1>
				<p className="text-yellow-600 dark:text-yellow-400">
					This page contains sensitive info such as your IP address and location. Only share this page to people you can
					trust
				</p>

				<Button
					className="px-10 mt-4"
					aria-label="Show sessions"
					variant="outline"
					onClick={() => {
						setShowWarning(false);
					}}
				>
					Show sessions
				</Button>
			</div>
		);
	}

	return children;
};

export default SessionListPageWrapper;

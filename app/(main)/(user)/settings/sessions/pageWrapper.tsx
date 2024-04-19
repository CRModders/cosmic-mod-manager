"use client";

import type { locale_content_type } from "@/public/locales/interface";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
	children: React.ReactNode;
	showSessionPageWarning?: string;
	locale: locale_content_type;
};

const SessionListPageWrapper = ({ children, showSessionPageWarning = "true", locale }: Props) => {
	const [showWarning, setShowWarning] = useState<boolean>(showSessionPageWarning !== "false");

	const sessionSectionLocale = locale.settings_page.sessions_section;

	if (showWarning !== false) {
		return (
			<div className="w-full flex flex-col items-center justify-center p-8 bg-yellow-600/10 dark:bg-yellow-400/5 rounded-lg">
				<h1 className="text-xl sm:text-2xl mb-2 text-yellow-600 dark:text-yellow-400">
					{sessionSectionLocale.sensitive_info_warning}
				</h1>
				<p className="text-yellow-600 dark:text-yellow-400">{sessionSectionLocale.session_page_warning_message}</p>

				<Button
					className="px-10 mt-4"
					aria-label={sessionSectionLocale.view_page}
					variant="outline"
					onClick={() => {
						setShowWarning(false);
					}}
				>
					{sessionSectionLocale.view_page}
				</Button>
			</div>
		);
	}

	return children;
};

export default SessionListPageWrapper;

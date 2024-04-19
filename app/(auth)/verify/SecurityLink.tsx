//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { locale_content_type } from "@/public/locales/interface";
import Link from "next/link";
import React from "react";

const SecurityLink = ({ locale }: { locale: locale_content_type }) => {
	return (
		<p className="flex flex-wrap items-center justify-start text-sm text-foreground/80 dark:text-foreground_dark/80">
			{locale.auth.action_verification_page.didnt_request_email}&nbsp;
			<Link
				href={"/settings/sessions"}
				aria-label={locale.auth.action_verification_page.check_sessions}
				className="text-blue-500 dark:text-blue-400t p-1 rounded hover:bg-blue-500/10 dark:hover:bg-blue-400/10"
			>
				{locale.auth.action_verification_page.check_sessions}
			</Link>
		</p>
	);
};

export default SecurityLink;

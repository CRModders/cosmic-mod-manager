//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

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

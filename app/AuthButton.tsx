//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { auth_locale } from "@/public/locales/interface";
import Link from "next/link";
import React from "react";

type Props = {
	authLocale: auth_locale;
};

const AuthButton = async ({ authLocale }: Props) => {
	const session = await auth().catch((error) => {
		console.log({ function: "AuthButton", error });
	});

	// biome-ignore lint/complexity/useOptionalChain: <explanation>
	if (session && session?.user?.email) {
		return (
			<Link href="/dashboard" aria-label={authLocale.dashboard}>
				<Button
					className="h-10 sm:h-12 px-6 sm:px-8"
					size="lg"
					variant="outline"
					aria-label={authLocale.dashboard}
					tabIndex={-1}
				>
					<p className="text-foreground dark:text-foreground_dark sm:text-lg">
						{authLocale.dashboard}
					</p>
				</Button>
			</Link>
		);
	}

	return (
		<Link href="/register" aria-label={authLocale.sign_up}>
			<Button
				className="h-10 sm:h-12 px-6 sm:px-8"
				size="lg"
				variant="outline"
				aria-label={authLocale.sign_up}
				tabIndex={-1}
			>
				<p className="text-foreground dark:text-foreground_dark sm:text-lg ">
					{authLocale.sign_up}
				</p>
			</Button>
		</Link>
	);
};

export default AuthButton;

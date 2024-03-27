//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>. 

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const AuthButton = async () => {
	const session = await auth().catch((e) => {
		console.log(e);
	});

	// biome-ignore lint/complexity/useOptionalChain: <explanation>
	if (session && session?.user?.email) {
		return (
			<Link href="/dashboard">
				<Button
					className=""
					size="lg"
					variant="outline"
					aria-label="Go to Dashboard"
				>
					<p className="text-foreground dark:text-foreground_dark text-lg">
						Dashboard
					</p>
				</Button>
			</Link>
		);
	}

	return (
		<Link href="/register">
			<Button className="" size="lg" variant="outline" aria-label="Sign up">
				<p className="text-foreground dark:text-foreground_dark text-lg">
					Sign Up
				</p>
			</Button>
		</Link>
	);
};

export default AuthButton;

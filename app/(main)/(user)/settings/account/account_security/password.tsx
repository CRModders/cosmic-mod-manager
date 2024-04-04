//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import React from "react";
import AddPasswordForm from "./addPasswordForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { KeyIcon, TrashIcon } from "@/components/Icons";
import RemovePasswordForm from "./removePasswordForm";

type Props = {
	id: string | null;
	email: string | null;
	hasAPassword?: boolean;
};

const PasswordSection = ({ id, email, hasAPassword = false }: Props) => {
	if (!id) return;

	if (!hasAPassword) {
		return (
			<div className="w-full flex flex-wrap items-end justify-between gap-2">
				<div className="flex flex-col items-start justify-center">
					<p className="text-xl font-semibold text-foreground/90 dark:text-foreground_dark/90">
						Password
					</p>
					<p className="text-foreground_muted/80 dark:text-foreground_muted_dark/80">
						Add a password to use email login
					</p>
				</div>
				<AddPasswordForm id={id} email={email} hasAPassword={hasAPassword} />
			</div>
		);
	}

	return (
		<div className="w-full flex flex-wrap items-end justify-between gap-2">
			<div className="flex flex-col items-start justify-center">
				<p className="text-xl font-semibold text-foreground/90 dark:text-foreground_dark/90">
					Password
				</p>
				<p className="text-foreground_muted/80 dark:text-foreground_muted_dark/80">
					Change your account password
				</p>
			</div>

			<div className="flex flex-wrap gap-2">
				<Link
					href={"/change-password"}
					className="flex items-center justify-center"
				>
					<Button
						className="flex items-center justify-center gap-2"
						variant="outline"
					>
						<KeyIcon
							size="1rem"
							className="text-foreground/90 dark:text-foreground_dark/90"
						/>
						Change password
					</Button>
				</Link>
				<RemovePasswordForm id={id} email={email}>
					<Button
						className="flex items-center justify-center gap-2 text-primary_accent_text dark:text-primary_accent_text_dark hover:text-primary_accent_text hover:dark:text-primary_accent_text_dark"
						variant="outline"
					>
						<TrashIcon size="1rem" />
						Remove password
					</Button>
				</RemovePasswordForm>
			</div>
		</div>
	);
};

export default PasswordSection;

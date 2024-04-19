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
import type { locale_content_type } from "@/public/locales/interface";

type Props = {
	id: string | null;
	email: string | null;
	hasAPassword?: boolean;
	locale: locale_content_type;
};

const PasswordSection = ({ id, email, hasAPassword = false, locale }: Props) => {
	if (!id) return;

	const account_section_locale = locale.settings_page.account_section;

	if (!hasAPassword) {
		return (
			<div className="w-full flex flex-wrap items-end justify-between gap-2">
				<div className="flex flex-col items-start justify-center">
					<p className="text-xl text-foreground dark:text-foreground_dark">{locale.auth.password}</p>
					<p className="text-foreground_muted/80 dark:text-foreground_muted_dark/80">
						{account_section_locale.add_a_password_msg}
					</p>
				</div>
				<AddPasswordForm id={id} email={email} hasAPassword={hasAPassword} locale={locale} />
			</div>
		);
	}

	return (
		<div className="w-full flex flex-wrap items-end justify-between gap-2">
			<div className="flex flex-col items-start justify-center">
				<p className="text-xl text-foreground dark:text-foreground_dark">{locale.auth.password}</p>
				<p className="text-foreground_muted/80 dark:text-foreground_muted_dark/80">
					{account_section_locale.change_account_password}
				</p>
			</div>

			<div className="flex flex-wrap gap-2">
				<Link
					aria-label={locale.auth.change_password_page.change_password}
					href={"/change-password"}
					className="flex items-center justify-center rounded-lg"
				>
					<Button
						className="flex items-center justify-center gap-2"
						variant="outline"
						aria-label={locale.auth.change_password_page.change_password}
						tabIndex={-1}
					>
						<KeyIcon size="1rem" className="text-foreground/90 dark:text-foreground_dark/90" />
						{locale.auth.change_password_page.change_password}
					</Button>
				</Link>
				<RemovePasswordForm id={id} email={email} locale={locale}>
					<Button
						className="flex items-center justify-center gap-2 text-danger dark:text-danger_dark hover:text-danger hover:dark:text-danger_dark"
						variant="outline"
						aria-label={account_section_locale.remove_password}
					>
						<TrashIcon size="1rem" />
						{account_section_locale.remove_password}
					</Button>
				</RemovePasswordForm>
			</div>
		</div>
	);
};

export default PasswordSection;

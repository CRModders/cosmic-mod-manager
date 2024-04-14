//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { Button } from "@/components/ui/button";
import React from "react";
import ProvidersList from "./ProvidersList";
import { getLinkedProvidersList } from "@/app/api/actions/user";
import { GearIcon } from "@/components/Icons";
import { locale_content_type } from "@/public/locales/interface";

type Props = {
	id: string;
	locale: locale_content_type;
};

const ManageProviders = async ({ id, locale }: Props) => {
	const linkedProviders = await getLinkedProvidersList();

	return (
		<div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-x-32 gap-y-2">
			<div className="flex shrink flex-col items-start justify-center">
				<p className="text-xl text-foreground dark:text-foreground_dark">{locale.settings_page.account_section.manage_auth_providers}</p>
				<p className="text-foreground_muted/80 dark:text-foreground_muted_dark/80 shrink">{locale.settings_page.account_section.manage_auth_providers_desc}</p>
			</div>

			<ProvidersList id={id} linkedProviders={linkedProviders} locale={locale}>
				<Button className="flex items-center justify-center gap-2" variant="outline">
					<GearIcon size="1rem" className=" text-foreground/90 dark:text-foreground_dark/90" />
					{locale.settings_page.account_section.manage_providers_label}
				</Button>
			</ProvidersList>
		</div>
	);
};

export default ManageProviders;

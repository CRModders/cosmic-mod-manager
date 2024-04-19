//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import PanelLayout, { PanelContent, SidePanel } from "@/components/PanelLayout/Panel";
import { PersonIcon, ShieldIcon } from "@/components/Icons";
import React from "react";
import SidepanelLink from "./SidepanelLink";
import { siteTitle } from "@/config";
import { get_locale } from "@/lib/lang";
import getLangPref from "@/lib/server/getLangPref";
import "@/app/globals.css";

export default async function SettingsPageLayout({ children }: { children: React.ReactNode }) {
	const langPref = getLangPref();
	const locale = get_locale(langPref).content;

	const baseUrlPrefix = "/settings";

	const SidePanelLinks = [
		{
			name: locale.settings_page.account_section.account,
			href: `${baseUrlPrefix}/account`,
			icon: <PersonIcon className="w-5 h-5" />,
		},
		{
			name: locale.settings_page.sessions_section.sessions,
			href: `${baseUrlPrefix}/sessions`,
			icon: <ShieldIcon className="w-5 h-5" />,
		},
	];

	return (
		<div className="w-full pb-32">
			<PanelLayout>
				<SidePanel>
					<div className="w-full">
						<h1 className="w-full px-1 text-3xl font-semibold tracking-wider mb-4 text-foreground/90 dark:text-foreground_dark/90">
							{locale.auth.settings}
						</h1>
						<ul className="w-full flex flex-col items-start justify-center gap-1">
							{SidePanelLinks?.map((link) => {
								return (
									<React.Fragment key={link.href}>
										<SidepanelLink href={link.href} label={link.name} icon={link.icon} />
									</React.Fragment>
								);
							})}
						</ul>
					</div>
				</SidePanel>
				<PanelContent>{children}</PanelContent>
			</PanelLayout>
		</div>
	);
}

export const generateMetadata = async () => {
	const langPref = getLangPref();
	const locale = get_locale(langPref).content;
	return {
		title: {
			default: locale.auth.settings,
			template: `%s - ${siteTitle}`,
		},
		description: locale.settings_page.meta_desc,
	};
};

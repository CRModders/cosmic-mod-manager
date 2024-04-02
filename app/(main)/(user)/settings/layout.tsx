//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import PanelLayout, {
	PanelContent,
	SidePanel,
} from "@/components/PanelLayout/Panel";
import { ShieldIcon } from "@/components/Icons";
import { PersonIcon } from "@radix-ui/react-icons";
import React from "react";
import SidepanelLink from "./SidepanelLink";
import { siteTitle } from "@/config";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		default: "Settings",
		template: `%s - ${siteTitle}`,
	},
	description: "CRMM settings page",
};

const SettingsPageLayout = ({ children }: { children: React.ReactNode }) => {
	const baseUrlPrefix = "/settings";

	const SidePanelLinks = [
		{
			name: "Account",
			href: `${baseUrlPrefix}/account`,
			icon: <PersonIcon className="w-5 h-5" />,
		},
		{
			name: "Sessions",
			href: `${baseUrlPrefix}/sessions`,
			icon: <ShieldIcon className="w-5 h-5" />,
		},
	];

	return (
		<div className="w-full pb-32">
			<PanelLayout>
				<SidePanel>
					<div className="w-full">
						<h1 className="w-full px-1 text-3xl font-bold tracking-wider mb-4 text-foreground/80 dark:text-foreground_dark/80">
							Settings
						</h1>
						<ul className="w-full flex flex-col items-start justify-center gap-1">
							{SidePanelLinks?.map((link) => {
								return (
									<li key={link.href} className="w-full">
										<SidepanelLink
											href={link.href}
											label={link.name}
											icon={link.icon}
										/>
									</li>
								);
							})}
						</ul>
					</div>
				</SidePanel>
				<PanelContent>{children}</PanelContent>
			</PanelLayout>
		</div>
	);
};

export default SettingsPageLayout;

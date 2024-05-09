//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import "@/app/globals.css";
import { DashboardIcon, GearIcon, PersonIcon } from "@/components/Icons";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { locale_content_type } from "@/public/locales/interface";
import type { User } from "@prisma/client";
import Link from "next/link";
import ProfileDropdownLink from "./ProfileDropdownLink";
import SignOutBtn from "./SignOutBtn";

type Props = {
	locale: locale_content_type;
	userData: Partial<User>;
};

const ProfileDropdown = async ({ locale, userData }: Props) => {
	const dropdownLinks = [
		{
			name: locale.auth.your_profile,
			href: // biome-ignore lint/complexity/useOptionalChain: <explanation>
				userData && userData?.userName ? `/user/${userData.userName}` : "/login",
			icon: <PersonIcon size="1.25rem" />,
		},
		{
			name: locale.auth.dashboard,
			href: "/dashboard",
			icon: <DashboardIcon size="1.25rem" />,
		},
		{
			name: locale.auth.settings,
			href: "/settings/account",
			icon: <GearIcon size="1.25rem" />,
		},
	];

	return (
		<>
			{userData.email && (
				<div className="w-full flex flex-col items-center justify-center gap-4">
					<div className="w-full flex flex-col items-start justify-start">
						<ScrollArea className="w-full whitespace-nowrap">
							<p className="w-full px-4 text-lg text-left font-semibold text-foreground_muted dark:text-foreground_muted_dark">
								{userData.name}
							</p>
							<p className="w-full px-4 text-left text-foreground_muted dark:text-foreground_muted_dark">
								<span className=" text-foreground/60 dark:text-foreground_dark/60 select-none tracking-wider">@</span>
								{userData.userName}
							</p>
							<ScrollBar orientation="horizontal" />
						</ScrollArea>
					</div>
					<div className="w-full h-[0.1rem] bg-background_hover dark:bg-background_hover_dark" />

					<div className="w-full flex flex-col items-center justify-center">
						{dropdownLinks?.map((link) => {
							return (
								<Link
									key={link.name}
									href={link.href}
									aria-label={link.name}
									className="w-full flex items-center justify-center rounded-lg link_bg_transition"
									tabIndex={0}
								>
									<ProfileDropdownLink
										label={link.name}
										icon={link.icon}
										tabIndex={-1}
										labelClassName="text-foreground/90 dark:text-foreground_dark/90"
									/>
								</Link>
							);
						})}
					</div>
					<div className="w-full h-[0.1rem] bg-background_hover dark:bg-background_hover_dark" />
					<div className="w-full">
						<SignOutBtn authLocale={locale.auth} labelClassName="text-foreground/90 dark:text-foreground_dark/90" />
					</div>
				</div>
			)}
		</>
	);
};

export default ProfileDropdown;

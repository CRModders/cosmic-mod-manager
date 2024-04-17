//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import React from "react";
import LoginBtn from "./LoginBtn";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import SignOutBtn from "./SignOutBtn";
import ProfileDropdown from "./ProfileDropdown";
import { GearIcon, DashboardIcon, PersonIcon } from "@/components/Icons";
import { findUserById } from "@/app/api/actions/user";
import { NavMenuLink } from "../Navlink";
import { locale_content_type, auth_locale } from "@/public/locales/interface";

const LoginButton = ({ authLocale }: { authLocale: auth_locale }) => {
	return (
		<div className="flex items-center justify-center">
			<LoginBtn closeNavMenuOnLinkClick={false} authLocale={authLocale} />
		</div>
	);
};

type Props = {
	locale?: locale_content_type;
};

const AuthButton = async ({ locale }: Props) => {
	const session = await auth();

	if (!session?.user?.id) {
		return <LoginButton authLocale={locale.auth} />;
	}
	const userData = await findUserById(session?.user?.id);

	if (!userData?.id) {
		return <LoginButton authLocale={locale.auth} />;
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
					aria-label="Profile icon"
					className="hover:bg-background_hover dark:hover:bg-background_hover_dark rounded-full"
				>
					<div className="flex items-center justify-center p-1">
						<Avatar className=" bg-background_hover dark:bg-background_hover_dark">
							{userData?.image && (
								<AvatarImage src={userData?.image} alt={`${userData?.name} `} />
							)}
							<AvatarFallback className="bg-background_hover dark:bg-background_hover_dark h-12 w-12">
								{userData?.name?.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<ProfileDropdown locale={locale} />
			</PopoverContent>
		</Popover>
	);
};

// Mobile NavMenu Profile button
export const MenuAuthButton = async ({
	locale,
}: { locale: locale_content_type }) => {
	const session = await auth().catch((e) => console.log(e));

	if (!session || !session?.user?.email) {
		return (
			<div className="w-full flex items-center justify-center">
				<LoginBtn size="lg" authLocale={locale.auth} />
			</div>
		);
	}

	const userData = await findUserById(session.user.id);

	const dropdownLinks = [
		{
			name: locale.auth.your_profile,
			href: `/user/${
				// biome-ignore lint/complexity/useOptionalChain: <explanation>
				userData && userData?.userName ? userData.userName : "notSignedIn"
			}`,
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
		<div className="w-full flex flex-col items-center justify-center gap-4">
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="item-1" className="border-none outline-none">
					<AccordionTrigger className="w-full border-none outline-none">
						<div className="w-full flex items-center justify-center gap-4 pr-8">
							<Avatar>
								{userData?.image && (
									<AvatarImage
										src={userData?.image}
										alt={`${userData?.name} `}
									/>
								)}

								<AvatarFallback className="bg-background_hover dark:bg-background_hover_dark h-12 w-12">
									{userData?.name?.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>

							<p className="text-lg text-foreground dark:text-foreground_dark font-normal">
								{userData?.name}
							</p>
						</div>
					</AccordionTrigger>
					<AccordionContent className="w-full flex flex-col gap-2">
						{dropdownLinks?.map((link) => {
							return (
								<NavMenuLink
									key={link.name}
									href={link.href}
									className="w-full flex items-center justify-center rounded-lg"
									tabIndex={0}
								>
									<Button
										variant="ghost"
										className={
											"group w-full text-lg flex items-center justify-center gap-2"
										}
										size="lg"
										tabIndex={-1}
									>
										<span className="w-6 flex items-center justify-center link_icon">
											{link.icon}
										</span>
										<p>{link.name}</p>
									</Button>
								</NavMenuLink>
							);
						})}
						<SignOutBtn
							authLocale={locale.auth}
							className="items-center justify-center h-12 navlink_text link_bg_transition hover:duration-0 dark:hover:duration-0"
						/>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};

export default AuthButton;

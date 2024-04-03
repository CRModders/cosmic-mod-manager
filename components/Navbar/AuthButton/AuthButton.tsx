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
import { DashboardIcon, GearIcon, PersonIcon } from "@radix-ui/react-icons";
import { findUserById } from "@/app/api/actions/user";
import { NavMenuLink } from "../Navlink";

const LoginButton = () => {
	return (
		<div className="flex items-center justify-center">
			<LoginBtn closeNavMenuOnLinkClick={false} />
		</div>
	);
};

const AuthButton = async () => {
	const session = await auth();

	if (!session?.user?.id) {
		return <LoginButton />;
	}
	const userData = await findUserById(session?.user?.id);

	if (!userData?.id) {
		return <LoginButton />;
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
					aria-label="Profile icon"
					className="hover:bg-background_hover dark:hover:bg-background_hover_dark rounded-[50%]"
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
				<ProfileDropdown />
			</PopoverContent>
		</Popover>
	);
};

// Mobile NavMenu Profile button
export const MenuAuthButton = async () => {
	const session = await auth().catch((e) => console.log(e));

	if (!session || !session?.user?.email) {
		return (
			<div className="w-full flex items-center justify-center">
				<LoginBtn />
			</div>
		);
	}

	const userData = await findUserById(session.user.id);

	const dropdownLinks = [
		{
			name: "Your profile",
			href: `/user/${
				// biome-ignore lint/complexity/useOptionalChain: <explanation>
				userData && userData?.userName ? userData.userName : "notSignedIn"
			}`,
			icon: <PersonIcon className="h-5 w-5" />,
		},
		{
			name: "Dashboard",
			href: "/dashboard",
			icon: <DashboardIcon className="h-5 w-5" />,
		},
		{
			name: "Settings",
			href: "/settings/account",
			icon: <GearIcon className="h-5 w-5" />,
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
											"w-full text-lg flex items-center justify-center gap-2 text-foreground_muted dark:text-foreground_muted_dark"
										}
										size="lg"
										tabIndex={-1}
									>
										<span className="w-6 flex items-center justify-center">
											{link.icon}
										</span>
										<p>{link.name}</p>
									</Button>
								</NavMenuLink>
							);
						})}
						<SignOutBtn className="items-center justify-center" />
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};

export default AuthButton;

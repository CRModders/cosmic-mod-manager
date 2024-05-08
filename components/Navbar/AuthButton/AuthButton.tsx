//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { findUserById } from "@/app/api/actions/user";
import { auth } from "@/auth";
import { DashboardIcon, GearIcon, PersonIcon } from "@/components/Icons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { auth_locale, locale_content_type } from "@/public/locales/interface";
import Image from "next/image";
import { NavMenuLink } from "../Navlink";
import LoginBtn from "./LoginBtn";
import ProfileDropdown from "./ProfileDropdown";
import SignOutBtn from "./SignOutBtn";

const LoginButton = ({ authLocale }: { authLocale: auth_locale }) => {
	return <LoginBtn closeNavMenuOnLinkClick={false} btnClassName="h-10" authLocale={authLocale} />;
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
						{userData?.image ? (
							<Image
								src={userData?.image}
								alt={`${userData?.name} `}
								width={48}
								height={48}
								className="rounded-full bg-background_hover dark:bg-background_hover_dark"
								quality={100}
							/>
						) : (
							<span>{userData?.name[0]}</span>
						)}
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="max-w-md min-w-72 mx-[auto] mr-4" align="center">
				<ProfileDropdown userData={userData} locale={locale} />
			</PopoverContent>
		</Popover>
	);
};

// Mobile NavMenu Profile button
export const MenuAuthButton = async ({ locale }: { locale: locale_content_type }) => {
	const session = await auth().catch((e) => console.log(e));

	if (!session || !session?.user?.email) {
		return (
			<li className="group w-full flex items-center justify-center rounded-lg link_bg_transition">
				<LoginBtn size="lg" authLocale={locale.auth} />
			</li>
		);
	}

	const userData = await findUserById(session?.user?.id);

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
							{userData?.image ? (
								<Image
									src={userData?.image}
									alt={`${userData?.name} `}
									width={48}
									height={48}
									className="rounded-full"
									quality={100}
								/>
							) : (
								<span>{userData?.name[0]}</span>
							)}

							<p className="text-lg text-foreground dark:text-foreground_dark font-normal">{userData?.name}</p>
						</div>
					</AccordionTrigger>
					<AccordionContent className="w-full flex flex-col gap-2">
						{dropdownLinks?.map((link) => {
							return (
								<li
									className="group w-full flex items-center justify-center rounded-lg link_bg_transition"
									key={link.name}
								>
									<NavMenuLink
										href={link.href}
										label={link.name}
										tabIndex={0}
										className="w-full flex items-center justify-center rounded-lg"
									>
										<Button
											variant="ghost"
											className={
												"group w-full text-lg flex items-center justify-center gap-2 duration-0 dark:duration-0"
											}
											size="lg"
											tabIndex={-1}
											aria-label={link.name}
										>
											<span className="w-6 flex items-center justify-center link_icon">{link.icon}</span>
											<p>{link.name}</p>
										</Button>
									</NavMenuLink>
								</li>
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

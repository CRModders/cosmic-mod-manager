import React from "react";
import { auth } from "@/auth";
import Link from "next/link";
import { DashboardIcon, PersonIcon, GearIcon } from "@radix-ui/react-icons";
import SignOutBtn from "./SignOutBtn";
import ProfileDropdownLink from "./ProfileDropdownLink";
import { findUserById } from "@/app/api/actions/user";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const ProfileDropdown = async () => {
	const session = await auth().catch((e) => console.log(e));

	if (!session || !session?.user?.id) {
		return null;
	}

	const userData = await findUserById(session.user.id);

	if (!userData?.email) {
		return null;
	}

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
		<>
			{userData.email && (
				<div className="w-full flex flex-col items-center justify-center gap-4">
					<div className="w-full flex flex-col items-start justify-start">
						<ScrollArea className="w-full whitespace-nowrap">
							<p className="w-full px-4 text-lg text-left font-semibold text-foreground_muted dark:text-foreground_muted_dark">
								{userData.name}
							</p>
							<p className="w-full px-4 text-left text-foreground_muted dark:text-foreground_muted_dark">
								<span className=" text-foreground/60 dark:text-foreground_dark/60 select-none tracking-wider">
									@
								</span>
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
									className="w-full flex items-center justify-center rounded-lg"
									tabIndex={0}
								>
									<ProfileDropdownLink
										label={link.name}
										icon={link.icon}
										tabIndex={-1}
									/>
								</Link>
							);
						})}
					</div>
					<div className="w-full h-[0.1rem] bg-background_hover dark:bg-background_hover_dark" />
					<div className="w-full">
						<SignOutBtn />
					</div>
				</div>
			)}
		</>
	);
};

export default ProfileDropdown;

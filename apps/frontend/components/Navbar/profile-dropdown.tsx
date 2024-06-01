import { DashboardIconOutlined, GearIcon, PersonIcon } from "@/components/icons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import "@/src/globals.css";
import { AuthContext } from "@/src/providers/auth-provider";
import type { LocalUserSession } from "@root/types";
import type React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { LoginButton, SignOutBtn } from "./nav-button";
import { NavMenuLink } from "./navbar";

type ProfileDropdownLinkProps = {
	icon: React.JSX.Element;
	label: string;
	className?: string;
	labelClassName?: string;
	onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
	tabIndex?: number;
	disabled?: boolean;
};

export const ProfileDropdownLink = ({ icon, label, className, labelClassName, ...props }: ProfileDropdownLinkProps) => {
	return (
		<Button
			aria-label={label}
			type="button"
			variant="ghost"
			size="lg"
			className={cn(
				"px-4 w-full text-md flex items-center justify-start gap-2 navlink_text hover:bg-transparent dark:hover:bg-transparent",
				className,
			)}
			{...props}
		>
			<i className="text_stagger_animation text-foreground/65 group-hover:text-foreground/75 hover:text-foreground/75 w-6 flex items-center justify-start">
				{icon}
			</i>
			<span
				className={cn(
					"text_stagger_animation font-semibold text-foreground-muted group-hover:text-foreground",
					labelClassName,
				)}
			>
				{label}
			</span>
		</Button>
	);
};

type Props = {
	session: LocalUserSession;
};

const ProfileDropdown = ({ session }: Props) => {
	const dropdownLinks = [
		{
			name: "Your profile",
			href: session?.user_name ? `/user/${session.user_name}` : "/login",
			icon: <PersonIcon size="1.25rem" />,
		},
		{
			name: "Dashboard",
			href: "/dashboard",
			icon: <DashboardIconOutlined size="1.25rem" />,
		},
		{
			name: "Settings",
			href: "/settings/account",
			icon: <GearIcon size="1.25rem" />,
		},
	];

	if (!session?.user_id) {
		return <p>Unauthenticated</p>;
	}

	return (
		<div className="w-full flex flex-col items-center justify-center gap-4">
			<div className="w-full flex flex-col items-start justify-start">
				<ScrollArea className="w-full whitespace-nowrap">
					<p className="w-full px-4 text-lg text-left font-semibold text-foreground-muted">{session?.name}</p>
					<p className="w-full px-4 text-left text-foreground-muted">
						<span className="text-foreground/50 select-none tracking-wider">@</span>
						{session?.user_name}
					</p>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>
			<div className="w-full h-[0.1rem] bg-background-shallow" />

			<div className="w-full flex flex-col items-center justify-center gap-1">
				{dropdownLinks?.map((link) => {
					return (
						<Link
							key={link.name}
							to={link.href}
							aria-label={link.name}
							className="group w-full flex items-center justify-center rounded-lg bg_stagger_animation"
							tabIndex={0}
						>
							<ProfileDropdownLink label={link.name} icon={link.icon} tabIndex={-1} />
						</Link>
					);
				})}
			</div>
			<div className="w-full h-[0.1rem] bg-background-shallow" />
			<div className="w-full">
				<SignOutBtn />
			</div>
		</div>
	);
};

export default ProfileDropdown;

// Mobile NavMenu Profile button
export const MenuProfileLinks = ({
	isNavMenuOpen,
	toggleNavMenu,
}: {
	isNavMenuOpen: boolean | undefined;
	toggleNavMenu: ((newState?: boolean | undefined) => void) | undefined;
}) => {
	const { session } = useContext(AuthContext);

	if (!session || !session?.user_id) {
		return (
			<li className="w-full group flex items-center justify-center rounded-lg">
				<NavMenuLink href="/login" label="login" isDisabled={!isNavMenuOpen} toggleNavMenu={toggleNavMenu}>
					<LoginButton btnClassName="w-full navItemHeight bg_stagger_animation" />
				</NavMenuLink>
			</li>
		);
	}

	const dropdownLinks = [
		{
			label: "Your profile",
			href: session?.user_name ? `/user/${session.user_name}` : "/login",
			icon: <PersonIcon size="1.25rem" />,
		},
		{
			label: "Dashboard",
			href: "/dashboard",
			icon: <DashboardIconOutlined size="1.25rem" />,
		},
		{
			label: "Settings",
			href: "/settings/account",
			icon: <GearIcon size="1.25rem" />,
		},
	];

	return (
		<div className="w-full flex flex-col items-center justify-center gap-4">
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="item-1" className="border-none outline-none">
					<AccordionTrigger className="w-full border-none outline-none">
						<div className="w-full flex items-center justify-center gap-4">
							{session?.avatar_image ? (
								<img
									src={session?.avatar_image}
									alt={`${session?.user_name} `}
									className="navItemHeight aspect-square rounded-full bg-bg-hover"
								/>
							) : (
								<span>{session?.name[0]}</span>
							)}
							<span className="text-lg font-semibold text-foreground/90">{session?.name}</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="w-full flex flex-col gap-2">
						{dropdownLinks?.map((link) => {
							return (
								<li
									key={`${link.href}`}
									className="w-full group flex items-center justify-center rounded-lg bg_stagger_animation hover:bg-bg-hover"
								>
									<NavMenuLink
										href={link.href}
										label={link.label}
										isDisabled={!isNavMenuOpen}
										toggleNavMenu={toggleNavMenu}
									>
										<ProfileDropdownLink
											label={link.label}
											icon={link.icon}
											tabIndex={-1}
											className="w-full flex items-center justify-center navItemHeight text-lg"
										/>
									</NavMenuLink>
								</li>
							);
						})}
						<SignOutBtn className="items-center justify-center h-12 navLinkText bg_stagger_animation text-lg" />
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};

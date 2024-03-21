import React, { Suspense } from "react";
import ThemeSwitch from "./ThemeSwitch";
import { NavLinks } from "@/config";
import Navlink from "./Navlink";
import Link from "next/link";
import HamMenu, { MobileNav } from "./Menu";
import "@/app/globals.css";
import AuthButton, { MenuAuthButton } from "./AuthButton/AuthButton";
import { Spinner } from "@/app/loading";
import { BrandIcon } from "../icons";

const Navbar = async () => {
	return (
		<div className="w-full flex items-center justify-center ">
			<nav className="w-full flex flex-wrap items-start justify-start relative bg-background dark:bg-background_dark text-foreground dark:text-foreground_dark">
				{/* Desktop navbar */}
				<div className="w-full flex items-center justify-center border-b border-shadow dark:border-shadow_dark bg-background dark:bg-background_dark z-10">
					<div className="w-full mx-6 flex flex-wrap items-center justify-between py-2 z-10">
						<div className="flex items-center justify-center gap-6">
							<Link href="/" className="flex items-center justify-between">
								<BrandIcon
									size="2.6rem"
									className=" text-primary_accent dark:text-primary_accent"
								/>
								<p className="text-xl lg:text-lg h-12 px-1 flex items-center justify-center rounded-lg">
									CRMM
								</p>
							</Link>

							<ul className="hidden lg:flex items-center justify-center gap-2">
								{NavLinks.map((link) => {
									return (
										<React.Fragment key={link.href}>
											<Navlink
												href={link.href}
												className=" hover:text-foreground_muted dark:hover:text-foreground_muted_dark"
											>
												<p className="px-2 h-12 flex items-center justify-center text-center">
													{link.name}
												</p>
											</Navlink>
										</React.Fragment>
									);
								})}
							</ul>
						</div>

						<div className="flex items-center justify-center gap-2">
							<div className="">
								<ThemeSwitch />
							</div>
							<div className="flex lg:hidden items-center justify-center">
								<HamMenu />
							</div>
							<div className="hidden lg:flex items-center justify-center mx-2">
								<Suspense fallback={<Spinner />}>
									<AuthButton />
								</Suspense>
							</div>
						</div>
					</div>
				</div>

				{/* Mobile navbar */}
				<MobileNav>
					<MenuAuthButton />
				</MobileNav>
			</nav>
		</div>
	);
};

const NavbarLoadingUI = () => {
	return (
		<div className="w-full shadow-shadow dark:shadow-shadow_dark bg-background dark:bg-background_dark">
			<p className="w-full text-center h-16 pb-[2px] flex items-center justify-center shadow">
				Loading Navbar...
			</p>
		</div>
	);
};

const NavbarWrapper = async () => {
	return (
		<Suspense fallback={<NavbarLoadingUI />}>
			<Navbar />
		</Suspense>
	);
};

export default NavbarWrapper;

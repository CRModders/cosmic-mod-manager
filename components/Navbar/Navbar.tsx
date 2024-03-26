//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>. 

import React, { Suspense } from "react";
import ThemeSwitch from "./ThemeSwitch";
import { NavLinks } from "@/config";
import Navlink from "./Navlink";
import Link from "next/link";
import HamMenu, { MobileNav } from "./Menu";
import "@/app/globals.css";
import AuthButton, { MenuAuthButton } from "./AuthButton/AuthButton";
import { BrandIcon } from "@/components/Icons";
import { Spinner } from "@/components/ui/spinner";

const Navbar = async () => {
	return (
		<div className="w-full flex items-center justify-center ">
			<nav className="w-full flex flex-wrap items-start justify-start relative bg-background dark:bg-background_dark text-foreground dark:text-foreground_dark">
				{/* Desktop navbar */}
				<div className="w-full z-50 flex items-center justify-center border-b border-shadow dark:border-shadow_dark bg-background dark:bg-background_dark">
					<div className="container flex flex-wrap items-center justify-between py-2 px-4 sm:px-8">
						<div className="flex items-center justify-center gap-6">
							<Link
								href="/"
								className="flex items-center justify-between rounded-lg"
							>
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
										<li
											key={link.href}
											className=" list-none m-0 p-0 flex items-center justify-center"
											aria-label={link.name}
										>
											<Navlink
												href={link.href}
												className=" hover:text-foreground dark:hover:text-foreground_dark"
											>
												<p className="px-2 h-12 flex items-center justify-center text-center">
													{link.name}
												</p>
											</Navlink>
										</li>
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

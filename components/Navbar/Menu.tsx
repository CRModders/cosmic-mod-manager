"use client";

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { Spinner } from "@/components/ui/spinner";
import { StoreContext } from "@/contexts/StoreContext";
import React, { Suspense, useContext, useEffect } from "react";
import { NavMenuLink } from "./Navlink";
import styles from "./styles.module.css";

const HamMenu = () => {
	const { isNavMenuOpen, toggleNavMenu, isDesktop } = useContext(StoreContext);

	const handleHamMenuClick = () => {
		toggleNavMenu();
	};

	useEffect(() => {
		if (isNavMenuOpen) {
			document.body.classList.add("navmenu-open");
			isDesktop && document.body.classList.add("subtract-scrollbar-width");
		} else {
			document.body.classList.remove("navmenu-open");
			document.body.classList.remove("subtract-scrollbar-width");
		}
	}, [isNavMenuOpen, isDesktop]);

	useEffect(() => {}, []);

	return (
		<button
			type="button"
			className="h-10 w-10 flex items-center justify-center hover:bg-background_hover dark:hover:bg-background_hover_dark cursor-pointer rounded-lg"
			onClick={handleHamMenuClick}
			aria-label="Menu"
		>
			<div className={`${styles.ham_menu_icon} ${isNavMenuOpen && styles.ham_menu_open} aspect-square w-full relative`}>
				<i
					className={`${styles.ham_menu_line_1} block absolute top-[33%] left-1/2 h-[0.12rem] w-[50%] bg-current rounded-full translate-y-[-50%] translate-x-[-50%]`}
				/>
				<i
					className={`${styles.ham_menu_line_2} block absolute top-[50%] left-1/2 h-[0.12rem] w-[50%] bg-current rounded-full translate-y-[-50%] translate-x-[-50%]`}
				/>
				<i
					className={`${styles.ham_menu_line_3} block absolute top-[67%] left-1/2 h-[0.12rem] w-[50%] bg-current rounded-full translate-y-[-50%] translate-x-[-50%]`}
				/>
			</div>
		</button>
	);
};

export default HamMenu;

type Props = {
	children: React.ReactNode;
	NavMenuLinks: {
		name: string;
		href: string;
	}[];
};

const MobileNav = ({ children, NavMenuLinks }: Props) => {
	const { isNavMenuOpen } = useContext(StoreContext);

	return (
		<>
			{
				<div
					className={` ${styles.mobile_navmenu} w-full absolute top-0 left-0 duration-default ${
						isNavMenuOpen && styles.menu_open
					}`}
				>
					<div className="w-full flex flex-col items-center justify-center row-span-2 relative">
						<div className="absolute top-0 left-0 w-full h-full opacity-80 bg-background dark:bg-background_dark z-[3]" />

						<ul className="container pt-32 sm:pt-24 pb-28 px-6 flex flex-col items-start justify-start h-[100vh] z-20 gap-2 overflow-y-scroll backdrop-blur-md">
							{NavMenuLinks.map((link) => {
								return (
									<React.Fragment key={link.href}>
										<li
											key={`${link.href}`}
											className="group w-full flex items-center justify-center rounded-lg link_bg_transition"
										>
											<NavMenuLink href={link.href} label={link.name} isDisabled={!isNavMenuOpen}>
												<span className="text-lg w-full h-12 flex flex-col items-center justify-center text-center">
													{link.name}
												</span>
											</NavMenuLink>
										</li>
									</React.Fragment>
								);
							})}
							{isNavMenuOpen === true && (
								// The children is either the login button or the dropdown menu depends on whether logged in or not
								<Suspense fallback={<Spinner size="1.25rem" />}>{children}</Suspense>
							)}
						</ul>
					</div>
				</div>
			}
		</>
	);
};

export { MobileNav };

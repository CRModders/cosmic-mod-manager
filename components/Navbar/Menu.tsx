"use client";

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import React, { Suspense, useContext, useEffect } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { StoreContext } from "@/contexts/StoreContext";
import styles from "./styles.module.css";
import { NavMenuLink } from "./Navlink";
import { Spinner } from "@/components/ui/spinner";

const HamMenu = () => {
	const { isNavMenuOpen, toggleNavMenu } = useContext(StoreContext);

	const handleHamMenuClick = () => {
		toggleNavMenu();
	};

	useEffect(() => {
		if (isNavMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [isNavMenuOpen]);

	return (
		<button
			className="h-12 w-10 flex items-center justify-center hover:bg-background_hover dark:hover:bg-background_hover_dark cursor-pointer rounded-lg"
			type="button"
			onClick={handleHamMenuClick}
			aria-label="Toggle mobile nav menu"
		>
			<HamburgerMenuIcon width={"60%"} height={"60%"} />
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
				<div className={` ${styles.mobile_navmenu} w-full absolute top-0 left-0 ${isNavMenuOpen && styles.menu_open}`}>
					<div className="w-full flex flex-col items-center justify-center row-span-2 relative">
						<div className="absolute top-0 left-0 w-full h-full opacity-80 bg-background dark:bg-background_dark z-[3]" />

						<ul className="container pt-32 sm:pt-24 pb-28 px-6 flex flex-col items-start justify-start h-[100vh] z-20 gap-2 overflow-y-scroll backdrop-blur-md">
							{NavMenuLinks.map((link) => {
								return (
									<React.Fragment key={link.href}>
										<NavMenuLink href={link.href} isDisabled={!isNavMenuOpen}>
											<p className="text-lg w-full h-12 flex flex-col items-center justify-center text-center">
												{link.name}
											</p>
										</NavMenuLink>
									</React.Fragment>
								);
							})}
							{isNavMenuOpen === true && <Suspense fallback={<Spinner size="1.25rem" />}>{children}</Suspense>}
						</ul>
					</div>
				</div>
			}
		</>
	);
};

export { MobileNav };

"use client";

import React, { Suspense, useContext, useEffect, useState } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { StoreContext } from "@/contexts/StoreContext";
import { NavMenuLinks } from "@/config";
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

const MobileNav = ({ children }: { children: React.ReactNode }) => {
	const { isNavMenuOpen } = useContext(StoreContext);

	return (
		<>
			{
				<div
					className={` ${styles.mobile_navmenu} w-full absolute top-0 left-0 ${
						isNavMenuOpen && styles.menu_open
					}`}
				>
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
							{isNavMenuOpen === true && (
								<Suspense fallback={<Spinner />}>{children}</Suspense>
							)}
						</ul>
					</div>
				</div>
			}
		</>
	);
};

export { MobileNav };

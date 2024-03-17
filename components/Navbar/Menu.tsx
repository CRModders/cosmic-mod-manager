"use client";

import React, { Suspense, useContext, useEffect } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { StoreContext } from "@/contexts/StoreContext";
import { NavMenuLinks } from "@/config";
import styles from "./styles.module.css";
import { NavMenuLink } from "./Navlink";
import { Spinner } from "@/app/loading";

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
		>
			<HamburgerMenuIcon width={"60%"} height={"60%"} />
		</button>
	);
};

export default HamMenu;

const MobileNav = ({ children }: { children: React.ReactNode }) => {
	const { isNavMenuOpen } = useContext(StoreContext);

	return (
		<div
			className={` ${styles.mobile_navmenu} w-full absolute top-0 left-0 ${
				isNavMenuOpen && styles.menu_open
			}`}
		>
			<div className="w-full flex flex-col items-center justify-center row-span-2 relative">
				<div className="absolute w-full h-full bg-background dark:bg-background_dark z-0 opacity-80" />
				<ul className="w-full pt-28 px-6 py-8 flex flex-col items-center justify-start h-[100vh] z-[5] backdrop-blur-md gap-2">
					{NavMenuLinks.map((link) => {
						return (
							<React.Fragment key={link.href}>
								<NavMenuLink href={link.href}>
									<p className="text-lg w-full h-12 flex flex-col items-center justify-center text-center">
										{link.name}
									</p>
								</NavMenuLink>
							</React.Fragment>
						);
					})}
					<NavMenuLink href={"/profile"}>
						{/* <li className="w-full flex items-center justify-center"> */}
						<Suspense fallback={<Spinner />}>{children}</Suspense>
					</NavMenuLink>
				</ul>
			</div>
		</div>
	);
};

export { MobileNav };

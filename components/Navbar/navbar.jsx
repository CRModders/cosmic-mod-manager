import React, { Suspense } from "react";
import NavSkeleton from "./NavSkeleton";
import { ThemeChangerButton } from "./ThemeChanger";
import Themes from "@/constants/themes";
import "@/app/globals.css";

const NavbarContent = async () => {
	// This type delay will trigger Suspense loading fallback only in dev mode because
	// during build Nextjs executes this promise and makes the whole component static
	// because of no use of dynamic values (values that is unknown till the reques time like user's auth state, url etc)

	const p = new Promise((resolve) => {
		setTimeout(() => {
			resolve("Navbar data fetched");
		}, 3_000);
	});

	await p.then((res) => console.log(res));

	return (
		<nav>
			<p>Cosmic reach</p>
			{/* Adding more than two themes will require to change the way themes are changed */}
			<div className="theme_toggle">
				{Themes.map((theme) => {
					return (
						<React.Fragment key={theme}>
							<ThemeChangerButton themeName={theme} />
						</React.Fragment>
					);
				})}
			</div>
		</nav>
	);
};

// Wrapper for main navbar to show a loading skeleton when the actual navbar is still loading
const Navbar = async () => {
	return (
		<>
			<Suspense fallback={<NavSkeleton />}>
				<NavbarContent />
			</Suspense>
		</>
	);
};

export default Navbar;

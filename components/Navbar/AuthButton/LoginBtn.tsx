import React from "react";
import { Button } from "@/components/ui/button";
import { NavMenuLink } from "../Navlink";

const LoginBtn = ({
	closeNavMenuOnLinkClick = true,
}: {
	closeNavMenuOnLinkClick?: boolean;
}) => {
	return (
		<NavMenuLink
			className="w-full flex items-center justify-center rounded-lg text-foreground dark:text-foreground_dark"
			href="/login"
			closeNavMenuOnLinkClick={closeNavMenuOnLinkClick}
		>
			<Button
				variant="outline"
				size="md"
				className="w-full"
				aria-label="Log In"
			>
				<p className="text-lg text-foreground dark:text-foreground_dark">
					Log In
				</p>
			</Button>
		</NavMenuLink>
	);
};

export default LoginBtn;

"use client";

import { LogoutIcon } from "@/components/icons";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import ProfileDropdownLink from "./ProfileDropdownLink";

type Props = {
	className?: string;
};

const SignOutBtn = ({ className }: Props) => {
	const router = useRouter();

	const handleClick = () => {
		signOut();
		router.refresh();
	};

	return (
		<ProfileDropdownLink
			label={"Sign out"}
			icon={
				<LogoutIcon className="w-5 h-5 text-foreground_muted dark:text-foreground_muted_dark" />
			}
			onClick={handleClick}
			className={className}
		/>
	);
};

export default SignOutBtn;

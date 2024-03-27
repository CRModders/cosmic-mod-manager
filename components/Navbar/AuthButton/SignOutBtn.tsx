//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>. 

"use client";

import { LogoutIcon } from "@/components/Icons";
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

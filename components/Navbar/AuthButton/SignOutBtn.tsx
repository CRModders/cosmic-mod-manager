"use client";

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { LogoutIcon } from "@/components/Icons";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ProfileDropdownLink from "./ProfileDropdownLink";
import { Spinner } from "@/components/ui/spinner";
import { auth_locale } from "@/public/locales/interface";

type Props = {
	authLocale: auth_locale;
	className?: string;
};

const SignOutBtn = ({ className, authLocale }: Props) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleClick = async () => {
		if (loading) return;
		setLoading(true);
		await signOut();
		setLoading(false);
		router.push("/login");
	};

	return (
		<ProfileDropdownLink
			label={authLocale.sign_out}
			icon={!loading ? <LogoutIcon className="w-5 h-5" /> : <Spinner size="1.25rem" />}
			disabled={loading}
			onClick={handleClick}
			className={className}
		/>
	);
};

export default SignOutBtn;

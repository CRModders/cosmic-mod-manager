"use client";

import { LogoutIcon } from "@/components/Icons";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ProfileDropdownLink from "./ProfileDropdownLink";
import { Spinner } from "@/components/ui/spinner";

type Props = {
	className?: string;
};

const SignOutBtn = ({ className }: Props) => {
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
			label={"Sign out"}
			icon={
				!loading ? (
					<LogoutIcon className="w-5 h-5 text-foreground_muted dark:text-foreground_muted_dark" />
				) : (
					<Spinner />
				)
			}
			disabled={loading}
			onClick={handleClick}
			className={className}
		/>
	);
};

export default SignOutBtn;

"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const SignOutBtn = () => {
	const router = useRouter();

	const handleClick = () => {
		signOut();
		router.refresh();
	};

	return (
		<Button size="md" className="w-full" onClick={handleClick}>
			<p className="text-[1rem] text-foreground_dark dark:text-foreground">
				Sign Out
			</p>
		</Button>
	);
};

export default SignOutBtn;

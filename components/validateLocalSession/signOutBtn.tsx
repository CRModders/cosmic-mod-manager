"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { sleep } from "@/lib/utils";

const SignOutBtn = () => {
	const performSignOut = async () => {
		await sleep(1_000);
		await signOut();
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		performSignOut();
	}, []);

	return null;
};

export default SignOutBtn;

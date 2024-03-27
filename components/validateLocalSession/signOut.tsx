"use client";

import { sleep } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignOutLocalSession = () => {
	const router = useRouter();

	const performSignOut = async () => {
		await signOut();
		await sleep(2_000);
		router.refresh();
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		performSignOut();
	}, []);

	return null;
};

export default SignOutLocalSession;

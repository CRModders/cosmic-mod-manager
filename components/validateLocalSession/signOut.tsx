"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

const SignOutLocalSession = () => {
	const performSignOut = async () => {
		await signOut();
		window.location.reload();
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		performSignOut();
	}, []);

	return null;
};

export default SignOutLocalSession;

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { sleep } from "@/lib/utils";

const Redirect = ({ timeoutMs = 0 }) => {
	const router = useRouter();

	const redirectUser = async () => {
		if (timeoutMs > 0) {
			await sleep(timeoutMs);
		}
		router.replace("/dashboard");
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		redirectUser();
	}, []);

	return (
		<div className="container flex items-center justify-center">
			<p className="w-full flex items-center justify-center text-2xl">
				Redirecting...
			</p>
		</div>
	);
};

export default Redirect;

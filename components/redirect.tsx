"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { sleep } from "@/lib/utils";

type Props = {
	children?: React.ReactNode;
	text?: string;
	url: string;
	timeoutMs?: number;
	pushToStack?: boolean;
};

const Redirect = ({
	children,
	text,
	url,
	timeoutMs = 0,
	pushToStack = false,
}: Props) => {
	const router = useRouter();

	const redirectUser = async () => {
		if (timeoutMs > 0) {
			await sleep(timeoutMs);
		}
		if (!pushToStack) {
			router.replace(url);
		} else {
			router.push(url);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		redirectUser();
	}, []);

	return (
		<div className="container flex items-center justify-center">
			{children ? (
				children
			) : (
				<p className="w-full flex items-center justify-center text-2xl">
					{text ? text : "Redirecting..."}
				</p>
			)}
		</div>
	);
};

export default Redirect;

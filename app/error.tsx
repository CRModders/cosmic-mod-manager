"use client";

import { title } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="w-full min-h-[100dvh] flex flex-col items-center justify-center gap-6">
			<h1
				className={`${title()} w-full flex items-center justify-center text-center`}
			>
				Uh oh! Something went wrong.
			</h1>
			<p className="text-xl text-[var(--regular-secondary-text)] max-w-xl flex items-center justify-center text-center">
				Sorry about that. We'll work to get it fixed. In the meantime,
				<br /> you can try refreshing the page.
			</p>
			<Button size="lg" className="mt-4" onClick={reset} aria-label="Retry">
				<p className="px-8 text-xl">Retry</p>
			</Button>
		</div>
	);
}

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const AuthButton = async () => {
	const session = await auth().catch((error) => {
		console.log({ error });
	});

	// biome-ignore lint/complexity/useOptionalChain: <explanation>
	if (session && session?.user?.email) {
		return (
			<Link href="/dashboard">
				<Button
					className=""
					size="lg"
					variant="outline"
					aria-label="Go to Dashboard"
				>
					<p className="text-foreground dark:text-foreground_dark text-lg">
						Dashboard
					</p>
				</Button>
			</Link>
		);
	}

	return (
		<Link href="/register">
			<Button
				className="h-10 lg:h-12 px-6 lg:px-8"
				size="lg"
				variant="outline"
				aria-label="Sign up"
			>
				<p className="text-foreground dark:text-foreground_dark lg:text-lg ">
					Sign Up
				</p>
			</Button>
		</Link>
	);
};

export default AuthButton;

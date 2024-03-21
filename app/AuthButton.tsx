import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const AuthButton = async () => {
	const session = await auth().catch((e) => {
		console.log(e);
	});

	// biome-ignore lint/complexity/useOptionalChain: <explanation>
	if (session && session?.user?.email) {
		return (
			<Link href="/dashboard">
				<Button className="" size="lg" variant="outline">
					<p className="text-foreground dark:text-foreground_dark text-lg">
						Dashboard
					</p>
				</Button>
			</Link>
		);
	}

	return (
		<Link href="/register">
			<Button className="" size="lg" variant="outline">
				<p className="text-foreground dark:text-foreground_dark text-lg">
					Sign Up
				</p>
			</Button>
		</Link>
	);
};

export default AuthButton;

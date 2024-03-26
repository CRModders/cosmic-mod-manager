import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const LoginBtn = () => {
	return (
		<Link
			href="/login"
			className="w-full flex items-center justify-center rounded-lg text-foreground dark:text-foreground_dark"
		>
			<Button
				variant="outline"
				size="md"
				className="w-full"
				aria-label="Log In"
			>
				<p className="text-lg">Log In</p>
			</Button>
		</Link>
	);
};

export default LoginBtn;

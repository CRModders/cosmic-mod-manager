"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

type Props = {
	provider: {
		name: string;
		icon: React.JSX.Element;
	};
};

const SubmitButton = ({ provider }: Props) => {
	return (
		<form
			onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault();
				signIn(provider.name.toLowerCase());
			}}
			className="w-full flex items-center justify-center gap-4"
		>
			<Button
				type="submit"
				size="md"
				className="w-full py-4 bg-background_hover dark:bg-background_hover_dark hover:bg-background_hover dark:hover:bg-background_hover_dark flex items-center justify-center gap-4"
			>
				{provider.icon}
				<p className="text-foreground dark:text-foreground_dark">
					Sign Up using <span className="font-semibold">{provider.name}</span>
				</p>
			</Button>
		</form>
	);
};

export default SubmitButton;

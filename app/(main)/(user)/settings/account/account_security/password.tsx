import React from "react";
import AddPasswordForm from "./addPasswordForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { KeyIcon } from "@/components/Icons";
import { TrashIcon } from "@radix-ui/react-icons";
import RemovePasswordForm from "./removePasswordForm";

type Props = {
	id: string | null;
	email: string | null;
	hasAPassword?: boolean;
};

const PasswordSection = ({ id, email, hasAPassword = false }: Props) => {
	if (!id) return;

	if (!hasAPassword) {
		return (
			<div className="w-full flex flex-wrap items-end justify-between">
				<div className="flex flex-col items-start justify-center">
					<p className="text-xl font-semibold text-foreground_muted dark:text-foreground_muted_dark">
						Password
					</p>
					<p className="text-foreground_muted/80 dark:text-foreground_muted_dark/80">
						Add a password to be able to use email login
					</p>
				</div>
				<AddPasswordForm id={id} email={email} hasAPassword={hasAPassword} />
			</div>
		);
	}

	return (
		<div className="w-full flex flex-wrap items-end justify-between gap-2">
			<div className="flex flex-col items-start justify-center">
				<p className="text-xl font-semibold text-foreground_muted dark:text-foreground_muted_dark">
					Password
				</p>
				<p className="text-foreground_muted/80 dark:text-foreground_muted_dark/80">
					Change your account password
				</p>
			</div>

			<div className="flex flex-wrap gap-2 items-center justify-center">
				<Link
					href={"/reset-password"}
					className="w-full sm:w-fit flex items-center justify-center"
				>
					<Button
						className="w-full flex items-center justify-center gap-2"
						variant="outline"
					>
						<KeyIcon size="1.1rem" />
						Change password
					</Button>
				</Link>
				<RemovePasswordForm id={id} email={email}>
					<Button
						className="w-full sm:w-fit flex items-center justify-center gap-2 text-primary_accent_text dark:text-primary_accent_text_dark hover:text-primary_accent_text hover:dark:text-primary_accent_text_dark"
						variant="outline"
					>
						<TrashIcon className="h-4 w-4" />
						Remove password
					</Button>
				</RemovePasswordForm>
			</div>
		</div>
	);
};

export default PasswordSection;

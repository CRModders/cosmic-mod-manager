import React from "react";
import AddPasswordForm from "./addPasswordForm";

type Props = {
	id: string | null;
	email: string | null;
	hasAPassword?: boolean;
};

const PasswordField = ({ id, email, hasAPassword = false }: Props) => {
	if (!id) return;

	if (!hasAPassword) {
		return (
			<div className="w-full flex flex-wrap items-center justify-between">
				<p className="text-foreground_muted dark:text-foreground_muted_dark">
					Add a password to be able to use email login.
				</p>
				<AddPasswordForm id={id} email={email} hasAPassword={hasAPassword} />
			</div>
		);
	}

	return (
		<div>
			<p>Reset your password</p>
			<span> // Yet to implement</span>
		</div>
	);
};

export default PasswordField;

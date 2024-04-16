"use client";

import React, { useEffect, useState } from "react";
import FormErrorMsg from "../formErrorMsg";
import { getAuthenticatedUser } from "@/app/api/actions/auth";
import { locale_content_type } from "@/public/locales/interface";
import { Spinner } from "../ui/spinner";
import { signOut } from "next-auth/react";
import { sleep } from "@/lib/utils";

type Props = {
	locale: locale_content_type;
};

const SignOutBtn = () => {
	const performSignOut = async () => {
		await sleep(1_000);
		await signOut();
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		performSignOut();
	}, []);

	return null;
};

const SignOutWidget = ({ locale }: Props) => {
	const authLocale = locale.auth;
	const [authenticatedUser, setAuthenticatedUser] = useState(undefined);

	const fetchUser = async () => {
		const userData = await getAuthenticatedUser();
		setAuthenticatedUser(userData);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchUser();
	}, []);

	if (authenticatedUser?.id || authenticatedUser === undefined) {
		return null;
	}

	return (
		<section className="w-full fixed top-0 left-0 z-[500] bg-background dark:bg-background_dark text-foreground dark:text-foreground_dark">
			<div className="w-full p-6 min-h-[100dvh] flex flex-col items-center justify-center gap-6">
				<div className="max-w-lg w-full flex flex-col items-center justify-center gap-6 text-danger dark:text-danger_dark">
					<FormErrorMsg
						msg={authLocale.invalid_session_msg}
						className="text-3xl p-4 font-mono"
						iconClassName="w-9 mr-2 h-8"
					/>
				</div>
				<div className="flex gap-4 items-center justify-center">
					<Spinner size="1.5rem" className=" text-danger dark:text-danger_dark" />
					<p className="text-center text-danger dark:text-danger_dark text-2xl font-mono">{authLocale.signing_out}</p>
				</div>
			</div>
			<SignOutBtn />
		</section>
	);
};

export default SignOutWidget;

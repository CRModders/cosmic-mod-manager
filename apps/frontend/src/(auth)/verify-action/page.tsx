import { FormErrorMessage } from "@/components/ui/form-message";
import { Spinner } from "@/components/ui/spinner";
import useFetch from "@/src/hooks/fetch";
import type React from "react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import ChangeAccountPassword from "./change-account-password";
import AddPasswordConfirmAction from "./confirm-add-password";
import DeleteUserAccount from "./delete-user-account";

type UserVerificationActionTypes = "ADD_PASSWORD" | "CHANGE_PASSWORD" | "DELETE_USER_ACCOUNT";

const VerifyActionPage = () => {
	const [userEmail, setUserEmail] = useState<string | null | undefined>(undefined);
	const [verificationCode, setVerificationCode] = useState<string | null | undefined>(undefined);
	const [verificationActionType, setVerificationActionType] = useState<UserVerificationActionTypes | undefined>(
		undefined,
	);

	const fetchVerificationActionType = async () => {
		const res = await useFetch("/api/user/verification-code-action-type", {
			method: "POST",
			body: JSON.stringify({ token: verificationCode }),
		});

		const data = await res.json();
		setVerificationActionType(data?.type || null);
		setUserEmail(data?.email || null);
	};

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		setVerificationCode(searchParams.get("token") || null);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (verificationCode) {
			fetchVerificationActionType();
		}
	}, [verificationCode]);

	if (verificationCode === undefined || verificationActionType === undefined) {
		return (
			<>
				<Helmet>
					<title>Loading... | CRMM</title>
					<meta name="description" content="..." />
				</Helmet>
				<div className="w-full min-h-[100vh] flex items-center justify-center">
					<Spinner size="2rem" />
				</div>
			</>
		);
	}

	if (verificationCode === null || verificationActionType === null) {
		return (
			<>
				<Helmet>
					<title>Invalid token | CRMM</title>
					<meta name="description" content="Your verification token is either invalid or expired." />
				</Helmet>
				<div className="w-full max-w-lg min-h-[100vh] flex items-center justify-center">
					<FormErrorMessage text="Invalid or expired verification code" className="text-lg" />
				</div>
			</>
		);
	}

	switch (verificationActionType) {
		case "ADD_PASSWORD":
			return (
				<ConfirmationCardWrapper>
					<Helmet>
						<title>Add new password | CRMM</title>
						<meta name="description" content="Confirm if it was you to add the new password." />
					</Helmet>
					<AddPasswordConfirmAction code={verificationCode} />
				</ConfirmationCardWrapper>
			);
		case "CHANGE_PASSWORD":
			return (
				<ConfirmationCardWrapper>
					<Helmet>
						<title>Change password | CRMM</title>
						<meta name="description" content="Change your account password." />
					</Helmet>
					<ChangeAccountPassword code={verificationCode} email={userEmail || ""} />
				</ConfirmationCardWrapper>
			);
		case "DELETE_USER_ACCOUNT":
			return (
				<ConfirmationCardWrapper>
					<Helmet>
						<title>Delete account | CRMM</title>
						<meta name="description" content="Delete your account from crmm." />
					</Helmet>
					<DeleteUserAccount code={verificationCode} />
				</ConfirmationCardWrapper>
			);
		default:
			return null;
	}
};

export default VerifyActionPage;

const ConfirmationCardWrapper = ({ children }: { children: React.ReactNode }) => {
	return <div className="w-full flex items-center justify-center min-h-[100vh] py-12">{children}</div>;
};

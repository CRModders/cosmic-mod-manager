import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormSuccessMessage } from "@/components/ui/form-message";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import useFetch from "@/src/hooks/fetch";
import type React from "react";
import { useState } from "react";
import SecurityLink from "./session-page-link";

const AddPasswordConfirmAction = ({ code }: { code: string }) => {
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [actionResult, setActionResult] = useState<{
		success: boolean;
		message: string;
	} | null>(null);

	const addTheNewPassword = async () => {
		if (loading) return;
		setLoading(true);

		const response = await useFetch("/api/user/confirm-new-password", {
			method: "POST",
			body: JSON.stringify({ token: code }),
		});

		const result = await response.json();

		setLoading(false);
		if (result?.success === true) {
			setActionResult(result);
		} else {
			toast({
				title: result?.message,
			});
		}
	};

	const discardTheNewPassword = async () => {
		if (loading) return;
		setLoading(true);

		const response = await useFetch("/api/user/discard-new-password", {
			method: "POST",
			body: JSON.stringify({ token: code }),
		});

		const result = await response.json();

		setLoading(false);
		if (result?.success === true) {
			setActionResult(result);
		} else {
			toast({
				title: result?.message,
			});
		}
	};

	if (actionResult?.success === true) {
		return (
			<div className="w-full max-w-md flex flex-col items-center justify-center gap-4">
				<FormSuccessMessage text={actionResult?.message} className="text-lg" />
			</div>
		);
	}

	return (
		<Card className="max-w-md gap-0 relative">
			<CardHeader className="text-xl ms:text-3xl text-left">Verify your new password</CardHeader>
			<CardContent>
				<p className="w-full text-left text-foreground-muted">
					A new password was recently added to your account and is awaiting confirmation. Confirm below if this was you.
				</p>
			</CardContent>
			<CardFooter className="w-full flex flex-col items-center justify-end gap-4">
				<div className="w-full flex items-center justify-end gap-4">
					<form
						onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
							e.preventDefault();
							discardTheNewPassword();
						}}
						name="Cancel"
					>
						<Button type="submit" variant="outline" aria-label="Cancel">
							Cancel
						</Button>
					</form>
					<form
						onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
							e.preventDefault();
							addTheNewPassword();
						}}
						name="Confirm"
					>
						<Button type="submit" aria-label="Confirm">
							Confirm
						</Button>
					</form>
				</div>
				<div className="w-full flex items-center justify-start">
					<SecurityLink />
				</div>
			</CardFooter>
			{loading === true && (
				<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full rounded-xl flex items-center justify-center">
					<div className="w-full h-full flex items-center justify-center relative rounded-xl">
						<div className="w-full h-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-background dark:bg-background_dark opacity-60" />
						<Spinner size="1.5rem" />
					</div>
				</div>
			)}
		</Card>
	);
};

export default AddPasswordConfirmAction;

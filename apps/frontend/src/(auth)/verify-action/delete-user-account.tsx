import { TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormSuccessMessage } from "@/components/ui/form-message";
import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import useFetch from "@/src/hooks/fetch";
import type React from "react";
import { useState } from "react";
import SecurityLink from "./session-page-link";

const DeleteUserAccount = ({ code }: { code: string }) => {
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [actionResult, setActionResult] = useState<{
		success: boolean;
		message: string;
	} | null>(null);

	const dontDeleteAccount = async () => {
		if (loading) return;
		setLoading(true);

		const response = await useFetch("/api/user/discard-user-account-deletion", {
			method: "POST",
			body: JSON.stringify({ token: code }),
		});
		setLoading(false);
		const result = await response.json();

		if (result?.success === true) {
			setActionResult(result);
		}

		if (result?.success === true) {
			setActionResult(result);
		} else {
			toast({
				title: result?.message,
			});
		}
	};

	const deleteAccount = async () => {
		if (loading) return;
		setLoading(true);

		const response = await useFetch("/api/user/confirm-user-account-deletion", {
			method: "POST",
			body: JSON.stringify({ token: code }),
		});
		setLoading(false);
		const result = await response.json();

		if (result?.success === true) {
			setActionResult(result);
		}

		if (result?.success === true) {
			setActionResult(result);
		} else {
			toast({
				title: result?.message,
			});
		}

		setTimeout(() => {
			window.location.href = "/";
		}, 7_000);
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
			<CardHeader className="text-xl ms:text-3xl text-left font-semibold text-foreground-muted">
				Delete your account
			</CardHeader>
			<CardContent>
				<p className="w-full text-left text-foreground-muted">
					Deleting your account will remove all of your data except your projects from our database. There is no going
					back after you delete your account.
				</p>
			</CardContent>
			<CardFooter className="w-full flex flex-col items-center justify-end gap-4">
				<div className="w-full flex items-center justify-end gap-4">
					<form
						name="Cancel"
						onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
							e.preventDefault();
							dontDeleteAccount();
						}}
					>
						<Button type="submit" variant="secondary" aria-label="Cancel">
							Cancel
						</Button>
					</form>
					<form
						onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
							e.preventDefault();
							deleteAccount();
						}}
						name="Delete"
					>
						<Button type="submit" aria-label="Delete" variant={"destructive"} className="gap-2">
							<TrashIcon size="1rem" />
							Delete
						</Button>
					</form>
				</div>
				<div className="w-full flex items-center justify-start">
					<SecurityLink />
				</div>
			</CardFooter>
			{loading === true && <AbsolutePositionedSpinner />}
		</Card>
	);
};

export default DeleteUserAccount;

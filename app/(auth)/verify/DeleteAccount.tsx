//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { cancelAccountDeletion, confirmAccountDeletion } from "@/app/api/actions/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import React, { useState } from "react";
import SecurityLink from "./SecurityLink";
import { Spinner } from "@/components/ui/spinner";
import FormSuccessMsg from "@/components/formSuccessMsg";
import { useToast } from "@/components/ui/use-toast";
import { TrashIcon } from "@/components/Icons";
import { get_locale } from "@/lib/lang";
import getLangPref from "@/lib/client/getLangPref";

const DeleteAccountConfirmAction = ({ token }: { token: string }) => {
	const langPref = getLangPref();
	const locale = get_locale(langPref).content;

	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [actionResult, setActionResult] = useState<{
		success: boolean;
		message: string;
	} | null>(null);

	const dontDeleteAccount = async () => {
		if (loading) return;
		setLoading(true);

		const res = await cancelAccountDeletion(token);

		setLoading(false);
		if (res?.success === true) {
			setActionResult(res);
		}

		if (res?.success === true) {
			setActionResult(res);
		} else {
			toast({
				title: res?.message || locale.globals.messages.something_went_wrong,
			});
		}
	};

	const deleteAccount = async () => {
		if (loading) return;
		setLoading(true);

		const res = await confirmAccountDeletion(token);

		setLoading(false);
		if (res?.success === true) {
			setActionResult(res);
		}

		if (res?.success === true) {
			setActionResult(res);
		} else {
			toast({
				title: res?.message || locale.globals.messages.something_went_wrong,
			});
		}

		setTimeout(() => {
			window.location.href = "/";
		}, 3_000);
	};

	if (actionResult?.success === true) {
		return (
			<div className="w-full max-w-md flex flex-col items-center justify-center gap-4">
				<FormSuccessMsg msg={actionResult?.message} className="text-lg" iconClassName="pl-2 w-8 h-6" />
			</div>
		);
	}

	return (
		<Card className="max-w-md gap-0 relative">
			<CardHeader className="text-xl ms:text-3xl text-left">
				{locale.auth.action_verification_page.delete_account}
			</CardHeader>
			<CardContent>
				<p className="w-full text-left text-foreground/80 dark:text-foreground_dark/80">
					{locale.auth.action_verification_page.delete_account_desc}
				</p>
			</CardContent>
			<CardFooter className="w-full flex flex-col items-center justify-end gap-4">
				<div className="w-full flex items-center justify-end gap-4">
					<form
						onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
							e.preventDefault();
							dontDeleteAccount();
						}}
					>
						<Button type="submit" variant="outline" aria-label={locale.globals.cancel}>
							{locale.globals.cancel}
						</Button>
					</form>
					<form
						onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
							e.preventDefault();
							deleteAccount();
						}}
					>
						<Button
							type="submit"
							aria-label={locale.globals.delete}
							className="flex items-center justify-center gap-2 bg-danger dark:bg-danger_dark hover:bg-danger/90 hover:dark:bg-danger_dark/90 text-foreground_dark hover:text-foreground_dark dark:text-foreground_dark"
						>
							<TrashIcon size="1rem" />
							{locale.globals.delete}
						</Button>
					</form>
				</div>
				<div className="w-full flex items-center justify-start">
					<SecurityLink locale={locale} />
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

export default DeleteAccountConfirmAction;

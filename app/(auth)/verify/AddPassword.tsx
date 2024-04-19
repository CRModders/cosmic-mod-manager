//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { discardNewPasswordAddition, confirmNewPasswordAddition } from "@/app/api/actions/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type React from "react";
import { useState } from "react";
import SecurityLink from "./SecurityLink";
import { Spinner } from "@/components/ui/spinner";
import FormSuccessMsg from "@/components/formSuccessMsg";
import { useToast } from "@/components/ui/use-toast";
import { get_locale } from "@/lib/lang";
import getLangPref from "@/lib/client/getLangPref";

const AddPasswordConfirmAction = ({ token }: { token: string }) => {
	const langPref = getLangPref();
	const locale = get_locale(langPref).content;

	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [actionResult, setActionResult] = useState<{
		success: boolean;
		message: string;
	} | null>(null);

	const addTheNewPassword = async () => {
		if (loading) return;
		setLoading(true);

		const res = await confirmNewPasswordAddition(token);

		setLoading(false);
		if (res?.success === true) {
			setActionResult(res);
		} else {
			toast({
				title: res?.message || locale.globals.messages.something_went_wrong,
			});
		}
	};

	const removeTheNewPassword = async () => {
		if (loading) return;
		setLoading(true);

		const res = await discardNewPasswordAddition(token);

		setLoading(false);
		if (res?.success === true) {
			setActionResult(res);
		} else {
			toast({
				title: res?.message || locale.globals.messages.something_went_wrong,
			});
		}
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
				{locale.auth.action_verification_page.verify_new_password}
			</CardHeader>
			<CardContent>
				<p className="w-full text-left text-foreground/80 dark:text-foreground_dark/80">
					{locale.auth.action_verification_page.add_new_password_desc}
				</p>
			</CardContent>
			<CardFooter className="w-full flex flex-col items-center justify-end gap-4">
				<div className="w-full flex items-center justify-end gap-4">
					<form
						onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
							e.preventDefault();
							removeTheNewPassword();
						}}
						name={locale.globals.cancel}
					>
						<Button type="submit" variant="outline" aria-label={locale.globals.cancel}>
							{locale.globals.cancel}
						</Button>
					</form>
					<form
						onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
							e.preventDefault();
							addTheNewPassword();
						}}
						name={locale.globals.confirm}
					>
						<Button type="submit" aria-label={locale.globals.confirm}>
							{locale.globals.confirm}
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

export default AddPasswordConfirmAction;

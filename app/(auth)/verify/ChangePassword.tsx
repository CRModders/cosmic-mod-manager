"use client";

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { Button } from "@/components/ui/button";
import { maxPasswordLength, minPasswordLength } from "@/config";
import {
	cancelPasswordChangeAction,
	confirmPasswordChange,
} from "@/app/api/actions/user";
import { isValidPassword } from "@/lib/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sleep } from "@/lib/utils";
import { useRouter } from "next/navigation";
import FormErrorMsg from "@/components/formErrorMsg";
import FormSuccessMsg from "@/components/formSuccessMsg";
import SecurityLink from "./SecurityLink";
import { get_locale } from "@/lib/lang";
import getLangPref from "@/lib/client/getLangPref";
import { locale_content_type } from "@/public/locales/interface";

export const getChangePasswordFormSchema = (locale: locale_content_type) => {
	return z.object({
		email: z.string(),
		newPassword: z
			.string()
			.min(minPasswordLength, {
				message: locale.auth.action_verification_page.enter_password,
			})
			.max(maxPasswordLength, {
				message:
					locale.auth.action_verification_page.max_password_length_msg.replace(
						"${0}",
						`${maxPasswordLength}`,
					),
			}),
		confirmNewPassword: z
			.string()
			.min(1, {
				message: locale.auth.action_verification_page.re_enter_password,
			})
			.max(maxPasswordLength, {
				message:
					locale.auth.action_verification_page.max_password_length_msg.replace(
						"${0}",
						`${maxPasswordLength}`,
					),
			}),
	});
};

type Props = {
	token: string;
	email: string;
};

enum SuccessPage {
	CANCELLATION_SUCCESS = "CANCELLATION_SUCCESS",
	CHANGE_SUCCESS = "CHANGE_SUCCESS",
}

const AddPasswordForm = ({ token, email }: Props) => {
	const langPref = getLangPref();
	const locale = get_locale(langPref).content;

	const formSchema = getChangePasswordFormSchema(locale);

	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [showSuccessPage, setShowSuccessPage] = useState<SuccessPage | null>(
		null,
	);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: email || "",
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	const checkFormError = () => {
		const newPassword = form.getValues("newPassword");

		if (isValidPassword(newPassword) !== true) {
			const error = isValidPassword(newPassword);
			return setFormError(typeof error === "string" ? error : null);
		}

		return setFormError("");
	};

	const cancelAction = async () => {
		if (loading) return;

		setLoading(true);

		const res = await cancelPasswordChangeAction(token);
		setLoading(false);

		if (res?.success !== true) {
			return setFormError(
				res?.message || locale.globals.messages.something_went_wrong,
			);
		}

		setShowSuccessPage(SuccessPage.CANCELLATION_SUCCESS);

		await sleep(3_000);
		router.replace("/login");
	};

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		if (loading) return;

		checkFormError();
		if (formError) {
			return;
		}

		if (values.newPassword !== values.confirmNewPassword) {
			return setFormError(
				locale.auth.action_verification_page.password_dont_match,
			);
		}

		setLoading(true);
		const res = await confirmPasswordChange({
			token: token,
			newPassword: values.newPassword,
		});
		setLoading(false);

		if (res.success === true) {
			form.reset();
			setShowSuccessPage(SuccessPage.CHANGE_SUCCESS);

			await sleep(3_000);
			router.replace("/login");
		} else {
			setFormError(res?.message);
		}
	};

	if (showSuccessPage === SuccessPage.CANCELLATION_SUCCESS) {
		return (
			<div className=" w-full max-w-md">
				<FormSuccessMsg
					msg={locale.auth.action_verification_page.cancelled_successfully}
					className="text-lg"
					iconClassName="pl-2 w-8 h-6"
				/>
			</div>
		);
	}

	if (showSuccessPage === SuccessPage.CHANGE_SUCCESS) {
		return (
			<div className=" w-full max-w-md">
				<FormSuccessMsg
					msg={locale.auth.action_verification_page.password_changed}
					className="text-lg"
					iconClassName="pl-2 w-8 h-6"
				/>
			</div>
		);
	}

	return (
		<Card className="max-w-md w-full relative">
			<CardContent>
				<CardHeader className="px-0">
					<CardTitle className="w-full text-left font-normal text-xl">
						{locale.auth.change_password_page.change_password}
					</CardTitle>
				</CardHeader>
				<div className="w-full flex flex-col items-center justify-center">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							name={locale.auth.change_password_page.change_password}
							className="w-full flex flex-col items-center justify-center gap-6"
						>
							<div className="w-full flex flex-col items-center justify-center gap-4">
								<div className="hidden">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<>
												<FormItem className="hidden">
													<FormControl>
														<Input
															{...field}
															placeholder="********"
															type="email"
															name="username"
															autoComplete="username"
															className="hidden"
															readOnly={true}
															onChange={(
																e: React.ChangeEvent<HTMLInputElement>,
															) => {
																field.onChange(e);
																checkFormError();
															}}
														/>
													</FormControl>
												</FormItem>
											</>
										)}
									/>
								</div>

								<div className="w-full flex flex-col items-center justify-center">
									<FormField
										control={form.control}
										name="newPassword"
										render={({ field }) => (
											<>
												<FormItem className="w-full flex flex-col items-center justify-center space-y-1">
													<FormLabel className="w-full flex items-end justify-between text-left gap-12 min-h-4">
														<span className="text-foreground_muted dark:text-foreground_muted_dark py-1">
															{
																locale.auth.action_verification_page
																	.new_password
															}
														</span>
														<FormMessage className="text-danger dark:text-danger_dark leading-tight" />
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder="********"
															type="password"
															name="password"
															autoComplete="password"
															className="w-full flex items-center justify-center"
															onChange={(
																e: React.ChangeEvent<HTMLInputElement>,
															) => {
																field.onChange(e);
																checkFormError();
															}}
														/>
													</FormControl>
												</FormItem>
											</>
										)}
									/>
								</div>

								<div className="w-full flex flex-col items-center justify-center">
									<FormField
										control={form.control}
										name="confirmNewPassword"
										render={({ field }) => (
											<>
												<FormItem className="w-full flex flex-col items-center justify-center space-y-1">
													<FormLabel className="w-full flex items-end justify-between text-left min-h-4 gap-12">
														<span className="text-foreground_muted dark:text-foreground_muted_dark py-1">
															{
																locale.auth.action_verification_page
																	.confirm_new_password
															}
														</span>
														<FormMessage className="text-danger dark:text-danger_dark leading-tight" />
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder="********"
															type="password"
															name="confirm_password"
															autoComplete="confirm_password"
															className="w-full flex items-center justify-center"
															onChange={(
																e: React.ChangeEvent<HTMLInputElement>,
															) => {
																field.onChange(e);
																checkFormError();
															}}
														/>
													</FormControl>
												</FormItem>
											</>
										)}
									/>
								</div>
							</div>

							{formError && <FormErrorMsg msg={formError} />}

							<div className="w-full flex items-center justify-end gap-2">
								<Button variant="outline" type="button" onClick={cancelAction}>
									<p className="px-4 h-9 flex items-center justify-center">
										{locale.globals.cancel}
									</p>
								</Button>

								<Button
									type="submit"
									aria-label={locale.auth.change_password_page.change_password}
									disabled={
										!form.getValues().newPassword &&
										!form.getValues().confirmNewPassword
									}
								>
									<p className="px-4">
										{locale.auth.change_password_page.change_password}
									</p>
								</Button>
							</div>
						</form>
						{loading === true && (
							<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full rounded-xl flex items-center justify-center">
								<div className="w-full h-full flex items-center justify-center relative rounded-xl">
									<div className="w-full h-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-background dark:bg-background_dark opacity-60" />
									<Spinner size="1.5rem" />
								</div>
							</div>
						)}
					</Form>
				</div>
				<div className="w-full flex items-center justify-center mt-6">
					<SecurityLink locale={locale} />
				</div>
			</CardContent>
		</Card>
	);
};

export default AddPasswordForm;

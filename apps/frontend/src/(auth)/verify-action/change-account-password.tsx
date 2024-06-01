import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormErrorMessage, FormSuccessMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { sleep } from "@/lib/utils";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { maxPasswordLength, minPasswordLength } from "@root/config";
import { isValidPassword } from "@root/lib/user";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import SecurityLink from "./session-page-link";

const formSchema = z.object({
	email: z.string(),
	newPassword: z
		.string()
		.min(minPasswordLength, {
			message: "Enter your new password",
		})
		.max(maxPasswordLength, {
			message: `Your password can only have a maximum of ${maxPasswordLength} characters`,
		}),
	confirmNewPassword: z
		.string()
		.min(1, {
			message: "Re-enter your password",
		})
		.max(maxPasswordLength, {
			message: `Your password can only have a maximum of ${maxPasswordLength} characters`,
		}),
});

type Props = {
	code: string;
	email: string;
};

enum SuccessPage {
	CANCELLATION_SUCCESS = "CANCELLATION_SUCCESS",
	CHANGE_SUCCESS = "CHANGE_SUCCESS",
}

const ChangeAccountPassword = ({ code, email }: Props) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [showSuccessPage, setShowSuccessPage] = useState<SuccessPage | null>(null);

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

		const response = await useFetch("/api/user/discard-change-password-request", {
			method: "POST",
			body: JSON.stringify({ token: code }),
		});
		const result = await response.json();

		setLoading(false);
		if (result?.success !== true) {
			return setFormError(result?.message);
		}
		setShowSuccessPage(SuccessPage.CANCELLATION_SUCCESS);
		await sleep(3_000);
		navigate("/", { replace: true });
	};

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		if (loading) return;

		checkFormError();
		if (formError) {
			return;
		}

		if (values.newPassword !== values.confirmNewPassword) {
			return setFormError("Passwords do not match");
		}

		setLoading(true);
		const response = await useFetch("/api/user/change-account-password", {
			method: "POST",
			body: JSON.stringify({
				token: code,
				newPassword: values.newPassword,
			}),
		});
		const result = await response.json();
		setLoading(false);

		if (result.success === true) {
			form.reset();
			setShowSuccessPage(SuccessPage.CHANGE_SUCCESS);

			await sleep(3_000);
			navigate("/", { replace: true });
		} else {
			setFormError(result?.message);
		}
	};

	if (showSuccessPage === SuccessPage.CANCELLATION_SUCCESS) {
		return (
			<div className=" w-full max-w-md">
				<FormSuccessMessage text="Discarded password change" className="text-lg" />
			</div>
		);
	}

	if (showSuccessPage === SuccessPage.CHANGE_SUCCESS) {
		return (
			<div className=" w-full max-w-md">
				<FormSuccessMessage text="Password changed successfully" className="text-lg" />
			</div>
		);
	}

	return (
		<Card className="max-w-md w-full relative">
			<CardContent>
				<CardHeader className="px-0">
					<CardTitle className="w-full text-left text-foreground-muted font-semibold text-xl">
						Change password
					</CardTitle>
				</CardHeader>
				<div className="w-full flex flex-col items-center justify-center">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							name="Change password"
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
															onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
													<FormLabel className="w-full my-1 flex items-end justify-between text-left gap-12 min-h-4">
														<span className="text-foreground font-semibold">New password</span>
														<FormMessage className="text-danger-text leading-tight" />
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder="********"
															type="password"
															name="password"
															autoComplete="password"
															className="w-full flex items-center justify-center"
															onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
													<FormLabel className="w-full my-1 flex items-end justify-between text-left min-h-4 gap-12">
														<span className="text-foreground font-semibold">Confirm new password</span>
														<FormMessage className="text-danger-text leading-tight" />
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder="********"
															type="password"
															name="confirm_password"
															autoComplete="confirm_password"
															className="w-full flex items-center justify-center"
															onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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

							{formError && <FormErrorMessage text={formError} />}

							<div className="w-full flex items-center justify-end gap-2">
								<Button variant="outline" type="button" onClick={cancelAction}>
									<p className="px-4 h-9 flex items-center justify-center">Cancel</p>
								</Button>

								<Button
									type="submit"
									aria-label="Change password"
									disabled={!form.getValues().newPassword && !form.getValues().confirmNewPassword}
								>
									<p className="px-4">Change password</p>
								</Button>
							</div>
						</form>
						{loading === true && (
							<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full rounded-xl flex items-center justify-center">
								<div className="w-full h-full flex items-center justify-center relative rounded-xl">
									<div className="w-full h-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-background opacity-60" />
									<Spinner size="1.5rem" />
								</div>
							</div>
						)}
					</Form>
				</div>
				<div className="w-full flex items-center justify-start mt-6">
					<SecurityLink />
				</div>
			</CardContent>
		</Card>
	);
};

export default ChangeAccountPassword;

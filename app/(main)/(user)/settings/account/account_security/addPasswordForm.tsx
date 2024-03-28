"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { DialogClose } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { KeyIcon } from "@/components/Icons";
import { maxPasswordLength, minPasswordLength } from "@/config";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { setNewPassword } from "@/app/api/actions/user";
import { sleep } from "@/lib/utils";
import { isValidPassword } from "@/lib/user";

export const formSchema = z.object({
	email: z.string(),
	newPassword: z
		.string()
		.min(minPasswordLength, {
			message: "Enter your new password",
		})
		.max(maxPasswordLength, {
			message: `Your password can only have a maximum of ${maxPasswordLength} character`,
		}),
	confirmNewPassword: z
		.string()
		.min(minPasswordLength, {
			message: "Re-enter your password",
		})
		.max(maxPasswordLength, {
			message: `Your password can only have a maximum of ${maxPasswordLength} character`,
		}),
});

type Props = {
	id: string;
	email: string;
	hasAPassword: boolean;
};

const AddPasswordForm = ({ id, email, hasAPassword }: Props) => {
	const { toast } = useToast();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: email,
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	const checkFormError = () => {
		const newPassword = form.getValues("newPassword");
		const confirmNewPassword = form.getValues("confirmNewPassword");

		if (isValidPassword(newPassword) !== true) {
			const error = isValidPassword(newPassword);
			return setFormError(error);
		}

		return setFormError("");
	};

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log("SUBMITTING");
		if (loading) return;

		checkFormError();
		if (formError) {
			return;
		}

		if (values.newPassword !== values.confirmNewPassword) {
			return setFormError("Passwords do not match");
		}

		setLoading(true);
		await sleep(2_000);
		const result = await setNewPassword({
			id: id,
			email: email,
			newPassword: values.newPassword,
		});
		setLoading(false);

		if (result.success === true) {
			toast({
				title: result.message,
			});
			setDialogOpen(false);
		} else {
			setFormError(result.message);
		}
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button
					className="flex items-center justify-center gap-2"
					variant="outline"
				>
					<KeyIcon size="1.1rem" />
					<p>Add a password</p>
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a password</DialogTitle>
				</DialogHeader>

				<div className="w-full flex flex-col items-center justify-center py-4">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="w-full flex flex-col items-center justify-center gap-3"
						>
							<div className="w-full flex flex-col items-center justify-center gap-4">
								<div className="w-full flex flex-col items-center justify-center">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<>
												<FormItem aria-hidden={true} className="hidden">
													<FormControl>
														<Input
															placeholder="********"
															type="email"
															name="username"
															autoComplete="username"
															className="hidden"
															aria-hidden={true}
															{...field}
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
														<span className="text-foreground_muted dark:text-foreground_muted_dark">
															New password
														</span>
														<FormMessage className="text-rose-600 dark:text-rose-400 leading-tight" />
													</FormLabel>
													<FormControl>
														<Input
															placeholder="********"
															type="password"
															name="password"
															autoComplete="password"
															className="w-full flex items-center justify-center"
															onKeyUp={(
																e: React.KeyboardEvent<HTMLInputElement>,
															) => {
																checkFormError();
															}}
															{...field}
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
														<span className="text-foreground_muted dark:text-foreground_muted_dark">
															Confirm new password
														</span>
														<FormMessage className=" text-rose-600 dark:text-rose-400 leading-tight" />
													</FormLabel>
													<FormControl>
														<Input
															placeholder="********"
															type="password"
															name="confirm_password"
															autoComplete="confirm_password"
															className="w-full flex items-center justify-center"
															onKeyUp={(
																e: React.KeyboardEvent<HTMLInputElement>,
															) => {
																checkFormError();
															}}
															{...field}
														/>
													</FormControl>
												</FormItem>
											</>
										)}
									/>
								</div>
							</div>

							<div className="w-full flex items-center min-h-6 justify-start gap-4 text-rose-600 dark:text-rose-">
								{formError && (
									<>
										<ExclamationTriangleIcon className="w-6 h-500" />
										<p>{formError}</p>
									</>
								)}
							</div>

							<div className="w-full flex items-center justify-end gap-2">
								<DialogClose className="w-fit hover:bg-background_hover dark:hover:bg-background_hover_dark rounded-lg">
									<p className="px-4 h-9 flex items-center justify-center">
										Cancel
									</p>
								</DialogClose>

								<Button
									type="submit"
									aria-label="Log in"
									className=""
									disabled={
										!form.getValues().newPassword &&
										!form.getValues().confirmNewPassword
									}
								>
									<p className="px-4 font-semibold">Set password</p>
								</Button>
							</div>
						</form>
						{loading === true && (
							<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full rounded-xl flex items-center justify-center">
								<div className="w-full h-full flex items-center justify-center relative rounded-xl">
									<div className="w-full h-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-background dark:bg-background_dark opacity-60" />
									<Spinner size="2.4rem" />
								</div>
							</div>
						)}
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddPasswordForm;

import { KeyIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormErrorMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { maxPasswordLength, minPasswordLength } from "@root/config";
import { isValidPassword } from "@root/lib/user";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
	email: string;
};

const AddPasswordForm = ({ email }: Props) => {
	const { toast } = useToast();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

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

		if (isValidPassword(newPassword) !== true) {
			const error = isValidPassword(newPassword);
			return setFormError(typeof error === "string" ? error : null);
		}

		return setFormError("");
	};

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		if (loading) return;

		checkFormError();
		// Just a hack to get the updated value from the state
		let err: string | null = null;
		setFormError((error) => {
			err = error;
			return error;
		});

		if (err) {
			return;
		}

		if (values.newPassword !== values.confirmNewPassword) {
			return setFormError("The passwords do not match");
		}

		setLoading(true);
		const response = await useFetch("/api/user/add-new-password", {
			method: "POST",
			body: JSON.stringify({
				new_password: values.newPassword,
			}),
		});
		setLoading(false);
		const result = await response.json();

		if (result.success === true) {
			toast({
				title: result.message,
			});
			form.reset();
			setDialogOpen(false);
		} else {
			setFormError(result.message);
		}
	};

	return (
		<Dialog
			open={dialogOpen}
			onOpenChange={(open: boolean) => {
				if (open === false) {
					form.reset();
					setFormError("");
				}
				setDialogOpen(open);
			}}
		>
			<DialogTrigger asChild>
				<Button className="gap-2" variant="outline">
					<KeyIcon size="1.1rem" />
					Add password
				</Button>
			</DialogTrigger>

			<DialogContent className="m-0 gap-0">
				<DialogHeader className="p-0">
					<DialogTitle className="font-semibold text-foreground-muted">Add password</DialogTitle>
				</DialogHeader>

				<div className="w-full flex flex-col items-center justify-center">
					<Form {...form}>
						<form
							name="add password"
							onSubmit={form.handleSubmit(handleSubmit)}
							className="w-full flex flex-col items-center justify-center gap-6"
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
													<FormLabel className="w-full my-1 flex items-end justify-between text-left gap-12 min-h-4">
														<span className="text-foreground font-semibold">New password</span>
														<FormMessage className="text-danger-text dark:text-danger-text leading-tight" />
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
														<FormMessage className="text-danger-text dark:text-danger-text leading-tight" />
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
								<DialogClose aria-label="Cancel" asChild>
									<Button variant={"secondary"}>Cancel</Button>
								</DialogClose>

								<Button
									type="submit"
									aria-label="Add password"
									disabled={!form.getValues().newPassword && !form.getValues().confirmNewPassword}
								>
									Add password
								</Button>
							</div>
						</form>
						{loading === true && <AbsolutePositionedSpinner />}
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddPasswordForm;

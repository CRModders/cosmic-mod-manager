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
import { maxPasswordLength, minPasswordLength } from "@/config";
import { ExclamationTriangleIcon, TrashIcon } from "@radix-ui/react-icons";
import { removePassword } from "@/app/api/actions/user";
import FormErrorMsg from "@/components/formErrorMsg";

export const formSchema = z.object({
	email: z.string(),
	password: z
		.string()
		.min(minPasswordLength, {
			message: "Enter your password",
		})
		.max(maxPasswordLength, {
			message: `Invalid password. Password can only have a maximum of ${maxPasswordLength} character`,
		}),
});

type Props = {
	id: string;
	email: string;
	children: React.ReactNode;
};

const RemovePasswordForm = ({ id, email, children }: Props) => {
	const { toast } = useToast();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: email,
			password: "",
		},
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		if (loading) return;
		if (
			!values?.password ||
			(values?.password?.length || 0) < minPasswordLength ||
			(values?.password?.length || 0) > maxPasswordLength
		) {
			return setFormError("Enter a valid password.");
		}
		setLoading(true);

		const result = await removePassword({
			password: values.password,
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
			<DialogTrigger asChild>{children}</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Remove your account password</DialogTitle>
				</DialogHeader>

				<div className="w-full flex flex-col items-center justify-center">
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
										name="password"
										render={({ field }) => (
											<>
												<FormItem className="w-full flex flex-col items-center justify-center space-y-1">
													<FormLabel className="w-full flex items-end justify-between text-left gap-12 min-h-4">
														<span className="text-foreground_muted dark:text-foreground_muted_dark my-1">
															Confirm your password
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
																setFormError(null);
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

							<div className="w-full min-h-6">
								{formError && <FormErrorMsg msg={formError} />}
							</div>

							<div className="w-full flex items-center justify-end gap-2">
								<DialogClose className="w-fit hover:bg-background_hover dark:hover:bg-background_hover_dark rounded-lg">
									<p className="px-4 h-9 flex items-center justify-center text-foreground_muted dark:text-foreground_muted_dark">
										Cancel
									</p>
								</DialogClose>

								<Button
									type="submit"
									aria-label="Log in"
									className="bg-primary_accent dark:bg-primary_accent hover:bg-primary_accent/80 dark:hover:bg-primary_accent_dark/80"
									disabled={!form.getValues().password}
								>
									<TrashIcon className="h-4 w-4 text-foreground_dark" />
									<p className="px-2 text-foreground_dark">Remove password</p>
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

export default RemovePasswordForm;

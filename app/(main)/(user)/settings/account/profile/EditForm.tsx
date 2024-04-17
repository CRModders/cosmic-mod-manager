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
import { Button } from "@/components/ui/button";
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
import {
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { updateUserProfile } from "@/app/api/actions/user";
import { maxNameLength, maxUsernameLength } from "@/config";
import { isValidName, isValidUsername, parseProfileProvider } from "@/lib/user";
import { sleep } from "@/lib/utils";
import { Providers } from "@prisma/client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import FormErrorMsg from "@/components/formErrorMsg";
import FormSuccessMsg from "@/components/formSuccessMsg";
import { locale_content_type } from "@/public/locales/interface";

type Props = {
	name: string;
	username: string;
	linkedProviders: Providers[];
	currProfileProvider: Providers;
	setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
	locale: locale_content_type;
};

const EditProfileInfoForm = ({
	name,
	username,
	linkedProviders,
	currProfileProvider,
	setDialogOpen,
	locale,
}: Props) => {
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const formSchema = z.object({
		currProfileProvider: z.string(),
		username: z
			.string()
			.min(1, {
				message: locale.settings_page.account_section.enter_username,
			})
			.max(maxUsernameLength, {
				message:
					locale.settings_page.account_section.username_max_chars_limit.replace(
						"${0}",
						`${maxUsernameLength}`,
					),
			}),
		name: z
			.string()
			.min(2, {
				message: locale.settings_page.account_section.enter_name,
			})
			.max(maxNameLength, {
				message:
					locale.settings_page.account_section.name_max_chars_limit.replace(
						"${0}",
						`${maxNameLength}`,
					),
			}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			currProfileProvider: currProfileProvider,
			username: username || "",
			name: name || "",
		},
	});

	const checkFormError = () => {
		const name = form.getValues("name");
		let username = form.getValues("username");

		// Make the username lower case
		form.setValue("username", username.toLowerCase());
		username = form.getValues("username");

		if (!username && !name) return setFormError(null);

		if (isValidUsername(username) !== true) {
			const error = isValidUsername(username);
			if (username) {
				return setFormError(error.toString());
			}
		}

		if (isValidName(name) !== true) {
			const error = isValidName(name);
			if (name) {
				return setFormError(error.toString());
			}
		}

		setFormError(null);
	};

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		if (loading) return;

		checkFormError();
		if (formError) {
			return;
		}

		const providerName = parseProfileProvider(values.currProfileProvider);
		if (!providerName) return;

		setLoading(true);

		const result = await updateUserProfile({
			data: {
				userName: values.username,
				name: values.name,
				profileImageProvider: providerName,
			},
		});

		setLoading(false);

		if (result?.success === true) {
			setSuccessMessage(result?.message);
			await sleep(1500);
			setDialogOpen(false);
		} else if (result?.success === false) {
			setFormError(result?.message);
		}
	};

	return (
		<DialogContent className="gap-4">
			<DialogHeader>
				<DialogTitle className="font-normal">
					{locale.settings_page.account_section.edit_profile}
				</DialogTitle>
			</DialogHeader>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="w-full flex flex-col items-center justify-center gap-3"
				>
					<div className="w-full flex flex-col items-center justify-center gap-4">
						<div className="w-full flex flex-col items-center justify-center">
							<FormField
								control={form.control}
								name="currProfileProvider"
								render={({ field }) => (
									<>
										<FormItem className="w-full flex flex-col items-center justify-center space-y-1">
											<FormLabel className="w-full flex items-end justify-between text-left gap-12 min-h-4">
												<span className="text-foreground_muted dark:text-foreground_muted_dark">
													{locale.settings_page.account_section.pfp_provider}
												</span>
												<FormMessage className="text-danger dark:text-danger_dark leading-tight" />
											</FormLabel>
											<Select
												onValueChange={(value: string) => {
													field.onChange(value);
												}}
												defaultValue={field.value}
											>
												<FormControl className="capitalize">
													<SelectTrigger>
														<SelectValue placeholder="" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{linkedProviders?.map((provider) => {
														return (
															<SelectItem
																key={provider}
																value={provider}
																className="capitalize"
															>
																{provider}
															</SelectItem>
														);
													})}
												</SelectContent>
											</Select>
										</FormItem>
									</>
								)}
							/>
						</div>

						<div className="w-full flex flex-col items-center justify-center">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<>
										<FormItem className="w-full flex flex-col items-center justify-center space-y-1">
											<FormLabel className="w-full flex items-end justify-between text-left gap-12 min-h-4">
												<span className="text-foreground_muted dark:text-foreground_muted_dark">
													{locale.settings_page.account_section.username}
												</span>
												<FormMessage className="text-danger dark:text-danger_dark leading-tight" />
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="john_doe"
													className="w-full flex items-center justify-centerp"
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
								name="name"
								render={({ field }) => (
									<>
										<FormItem className="w-full flex flex-col items-center justify-center space-y-1">
											<FormLabel className="w-full flex items-end justify-between text-left min-h-4 gap-12">
												<span className="text-foreground_muted dark:text-foreground_muted_dark">
													{locale.settings_page.account_section.full_name}
												</span>
												<FormMessage className=" text-danger dark:text-danger_dark leading-tight" />
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="John Doe"
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

					{formError ? (
						<FormErrorMsg msg={formError} />
					) : (
						successMessage && <FormSuccessMsg msg={successMessage} />
					)}

					<DialogFooter className="w-full mt-4">
						<div className="w-full flex items-center justify-end gap-2">
							<DialogClose
								className="w-fit hover:bg-background_hover dark:hover:bg-background_hover_dark text-foreground/80 dark:text-foreground_dark/80 rounded-lg"
								aria-label={locale.globals.cancel}
							>
								<p className="text-base px-4 h-10 flex items-center justify-center">
									{locale.globals.cancel}
								</p>
							</DialogClose>

							<Button
								type="submit"
								aria-label={locale.settings_page.account_section.save_profile}
								className="h-10"
								disabled={
									form.getValues().name === name &&
									form.getValues().username === username &&
									form.getValues().currProfileProvider === currProfileProvider
								}
							>
								<p className="px-4">
									{locale.settings_page.account_section.save_profile}
								</p>
							</Button>
						</div>
					</DialogFooter>
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
		</DialogContent>
	);
};

export default EditProfileInfoForm;

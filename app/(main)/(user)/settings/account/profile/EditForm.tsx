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
import { DialogClose } from "@/components/ui/dialog";
import { updateUserProfile } from "@/app/api/actions/user";
import { maxNameLength, maxUsernameLength } from "@/config";
import { isValidName, isValidUsername, parseProfileProvider } from "@/lib/user";
import {
	CheckCircledIcon,
	ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
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

export const formSchema = z.object({
	currProfileProvider: z.string(),
	username: z
		.string()
		.min(1, {
			message: "Enter your username",
		})
		.max(maxUsernameLength, {
			message: `Your username can only have a maximum of ${maxUsernameLength} characters`,
		}),
	name: z
		.string()
		.min(2, {
			message: "Enter your name",
		})
		.max(maxNameLength, {
			message: `Your name can only have a maximum of ${maxNameLength} characters`,
		}),
});

type Props = {
	name: string;
	username: string;
	linkedProviders: Providers[];
	currProfileProvider: Providers;
	setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditProfileInfoForm = ({
	name,
	username,
	linkedProviders,
	currProfileProvider,
	setDialogOpen,
}: Props) => {
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			currProfileProvider: currProfileProvider,
			username: username || "",
			name: name || "",
		},
	});

	const checkFormError = (
		event?: React.KeyboardEvent<HTMLInputElement>,
		inputName?: "name" | "username",
	) => {
		let name = form.getValues("name");
		let username = form.getValues("username");

		// Make the username lower case
		form.setValue("username", username.toLowerCase());
		username = form.getValues("username");

		if (event && inputName && inputName === "name") {
			// @ts-expect-error
			name = event.target.value;
		}
		if (event && inputName && inputName === "username") {
			// @ts-expect-error
			username = event.target.value;
		}

		if (!username && !name) return setFormError("");

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
		if (!providerName) return setFormError("Invalid profile provider");

		setLoading(true);

		const result = await updateUserProfile({
			data: {
				username: values.username,
				name: values.name,
				profileImageProvider: providerName,
			},
		});

		setLoading(false);

		if (result?.success === true) {
			setSuccessMessage(result?.message || "Profile successfully updated");
			await sleep(1_000);
			setDialogOpen(false);
		} else if (result?.success === false) {
			setFormError(result?.message || "Couldn't update your profile info!");
		}
	};

	return (
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
												Profile image provider
											</span>
											<FormMessage className="text-rose-600 dark:text-rose-400 leading-tight" />
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl className="capitalize">
												<SelectTrigger>
													<SelectValue placeholder="Select a verified email to display" />
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
												Username
											</span>
											<FormMessage className="text-rose-600 dark:text-rose-400 leading-tight" />
										</FormLabel>
										<FormControl>
											<Input
												placeholder="john_doe"
												className="w-full flex items-center justify-centerp"
												onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
													checkFormError(e, "username");
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
							name="name"
							render={({ field }) => (
								<>
									<FormItem className="w-full flex flex-col items-center justify-center space-y-1">
										<FormLabel className="w-full flex items-end justify-between text-left min-h-4 gap-12">
											<span className="text-foreground_muted dark:text-foreground_muted_dark">
												Full name
											</span>
											<FormMessage className=" text-rose-600 dark:text-rose-400 leading-tight" />
										</FormLabel>
										<FormControl>
											<Input
												placeholder="John Doe"
												className="w-full flex items-center justify-center"
												onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
													checkFormError(e, "name");
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

				{formError ? (
					<FormErrorMsg msg={formError} />
				) : (
					successMessage && <FormSuccessMsg msg={successMessage} />
				)}

				<div className="w-full flex items-center justify-end gap-2">
					<DialogClose className="w-fit hover:bg-background_hover dark:hover:bg-background_hover_dark rounded-lg">
						<p className="px-4 h-9 flex items-center justify-center">Close</p>
					</DialogClose>

					<Button
						type="submit"
						aria-label="Log in"
						className=""
						disabled={
							form.getValues().name === name &&
							form.getValues().username === username &&
							form.getValues().currProfileProvider === currProfileProvider
						}
					>
						<p className="px-4 font-semibold">Save</p>
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
	);
};

export default EditProfileInfoForm;

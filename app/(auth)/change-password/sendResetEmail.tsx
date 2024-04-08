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
	CheckCircledIcon,
	ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { isValidEmail } from "@/lib/user";
import { initiatePasswordChange } from "@/app/api/actions/user";
import { sleep } from "@/lib/utils";
import { useRouter } from "next/navigation";
import FormErrorMsg from "@/components/formErrorMsg";

const formSchema = z.object({
	email: z
		.string()
		.min(2, {
			message: "Enter a valid email",
		})
		.max(256, { message: "Enter a valid email" }),
});

type Props = {
	userEmail: string | undefined | null;
};

const SendResetEmail = ({ userEmail }: Props) => {
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [showSuccessPage, setShowSuccessPage] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: userEmail,
		},
	});

	const checkFormError = () => {
		const email = form.getValues("email");
		const validEmail = email ? isValidEmail(email) : false;
		let error = null;

		if (!validEmail) {
			error = "Enter a valid email address";
			setFormError(error);
		} else {
			error = null;
			setFormError(error);
		}

		return error;
	};

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		const error = checkFormError();
		if (error) return;

		if (loading) return;
		setLoading(true);
		const result = await initiatePasswordChange(values?.email);
		setLoading(false);

		if (result?.success !== true) {
			return setFormError(result?.message || "Something went wrong");
		}

		setShowSuccessPage(true);
		await sleep(3_000);

		router.replace("/login");
	};

	if (showSuccessPage === true) {
		return (
			<div className="container flex flex-col items-center justify-center gap-2">
				<div className="w-full flex items-center justify-start gap-2 p-2 text-lg rounded-lg text-emerald-600 dark:text-emerald-500 bg-emerald-600/10 dark:bg-emerald-500/5">
					<CheckCircledIcon className="w-8 pl-2 h-6" />
					<h1 className="">Email sent successfully</h1>
				</div>
				<p className="text-foreground/75 dark:text-foreground_dark/75">
					Open the link sent to your email and change your password.
				</p>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="w-full flex flex-col items-center justify-center gap-5"
			>
				<div className="w-full flex flex-col items-center justify-center">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<>
								<FormItem className="w-full flex flex-col items-center justify-center">
									<FormLabel className="w-full flex items-center justify-between text-left gap-12">
										<span>Email</span>
										<FormMessage className=" text-rose-600 dark:text-rose-400 leading-tight" />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="email"
											required
											placeholder="example@abc.com"
											className="w-full flex items-center justify-center"
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												field.onChange(e);
												setFormError(null);
											}}
										/>
									</FormControl>
								</FormItem>
							</>
						)}
					/>
				</div>

				{formError && <FormErrorMsg msg={formError} />}

				<Button
					type="submit"
					aria-label="Log in"
					className="w-full bg-primary_accent dark:bg-primary_accent_dark hover:bg-primary_accent/80 dark:hover:bg-primary_accent_dark/80 text-foreground_dark dark:text-foreground_dark"
				>
					Continue
				</Button>
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
	);
};

export default SendResetEmail;

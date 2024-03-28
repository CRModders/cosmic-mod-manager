//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>. 

"use client";

import React, { useEffect, useState } from "react";
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
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { loginUser } from "@/app/api/actions/user";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { defaultLoginRedirect } from "@/config";
import { isValidEmail } from "@/lib/user";

const formSchema = z.object({
	email: z
		.string()
		.min(2, {
			message: "Enter a valid email",
		})
		.max(256, { message: "Enter a valid email" }),
	password: z.string().min(1, {
		message: "Enter a valid password",
	}),
});

const LoginForm = () => {
	// const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const searchParams = useSearchParams();
	const [callbackUrl, setCallbackUrl] = useState(
		searchParams.get("callbackUrl") || "",
	);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
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

		const result = await loginUser({
			email: values.email,
			password: values.password,
		});

		setLoading(false);

		if (result?.success === false) {
			return setFormError(result?.message || "Something went wrong");
		}
		// For some reason Next app router does not reload the page so had to use window reload
		// router.push(callbackUrl);
		// router.refresh();
		window.location.href = callbackUrl;
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setCallbackUrl(
			searchParams.get("callbackUrl") ||
				`${window.location.origin}${defaultLoginRedirect}`,
		);
	}, []);

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
											type="email"
											required
											placeholder="example@abc.com"
											className="w-full flex items-center justify-center"
											onKeyUp={() => {
												setFormError("");
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
						name="password"
						render={({ field }) => (
							<>
								<FormItem className="w-full flex flex-col items-center justify-center">
									<FormLabel className="w-full flex items-center justify-between text-left gap-12">
										<span>Password</span>
										<FormMessage className=" text-rose-600 dark:text-rose-400 leading-tight" />
									</FormLabel>
									<FormControl>
										<Input
											placeholder="********"
											type="password"
											className="w-full flex items-center justify-center"
											onKeyUp={() => {
												setFormError("");
											}}
											{...field}
										/>
									</FormControl>
								</FormItem>
							</>
						)}
					/>
				</div>

				{formError && (
					<div className="w-full flex items-start min-h-6 justify-center gap-2 text-rose-600 dark:text-rose-400">
						<>
							<ExclamationTriangleIcon className="w-5 h-5" />
							<p className="leading-tight">{formError}</p>
						</>
					</div>
				)}

				<Button
					type="submit"
					aria-label="Log in"
					className="w-full bg-primary_accent dark:bg-primary_accent_dark hover:bg-primary_accent/80 dark:hover:bg-primary_accent_dark/80 text-foreground_dark dark:text-foreground_dark text-[1.05rem]"
				>
					Log In
				</Button>
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

export default LoginForm;

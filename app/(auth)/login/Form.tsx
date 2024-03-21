"use client";

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
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/app/loading";
import { sleep } from "@/lib/utils";

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
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		// TODO: Check form data validity
		setLoading(true);

		await sleep(2_000);

		// TODO: Handle login errors and display appropriate messages

		const result = await signIn("credentials", {
			redirect: true,
			email: values.email,
			password: values.password,
			callbackUrl: callbackUrl,
		});

		// console.log(result);

		// toast({
		// 	title: "Invalid credentials",
		// 	description:
		// 		"Either of the email or password you entered was incorrect. Please try again",
		// });

		setLoading(false);
	};

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
											placeholder="example@abc.com"
											{...field}
											className="w-full flex items-center justify-center"
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
											{...field}
											className="w-full flex items-center justify-center"
										/>
									</FormControl>
								</FormItem>
							</>
						)}
					/>
				</div>

				<Button
					type="submit"
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

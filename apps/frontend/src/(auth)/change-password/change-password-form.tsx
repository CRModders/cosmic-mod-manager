import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormErrorMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { sleep } from "@/lib/utils";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { isValidEmail } from "@root/lib/user";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

type Props = {
	userEmail: string | undefined | null;
};

const ChangePasswordForm = ({ userEmail }: Props) => {
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [showSuccessPage, setShowSuccessPage] = useState(false);
	const navigate = useNavigate();

	const formSchema = z.object({
		email: z
			.string()
			.min(2, {
				message: "Invalid email address",
			})
			.max(256, { message: "Invalid email address" }),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: userEmail || "",
		},
	});

	const checkFormError = () => {
		const email = form.getValues("email");
		const validEmail = email ? isValidEmail(email) : false;
		let error = null;

		if (!validEmail) {
			error = "Invalid email address";
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

		const response = await useFetch("/api/user/send-password-change-email", {
			method: "POST",
			body: JSON.stringify({ email: values?.email }),
		});
		const result = await response.json();
		setLoading(false);

		if (result?.success !== true) {
			return setFormError(result?.message);
		}

		setShowSuccessPage(true);
		await sleep(3_000);

		navigate("/", { replace: true });
	};

	if (showSuccessPage === true) {
		return (
			<div className="container flex flex-col items-center justify-center gap-2">
				<div className="w-full flex items-center justify-start gap-3 p-2 text-lg rounded-lg text-success-text bg-success-bg/10">
					<CheckCircledIcon className="w-8 pl-2 h-6" />
					<h1 className="leading-tight">Password reset link sent to your email</h1>
				</div>
				<p className="text-foreground-muted">Open the link sent to your email and change your password.</p>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form
				name="Change password"
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
										<FormMessage className="text-danger-text leading-tight" />
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

				{formError && <FormErrorMessage text={formError} />}

				<Button
					type="submit"
					aria-label="Continue"
					className="w-full bg-accent-bg hover:bg-accent-bg/80 text-[hsla(var(--foreground-dark))] text-md"
				>
					Continue
				</Button>
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
	);
};

export default ChangePasswordForm;

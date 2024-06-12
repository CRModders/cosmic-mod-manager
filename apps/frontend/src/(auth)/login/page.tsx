import FormCard from "@/components/form-card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormErrorMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import { redirectToMessagePage } from "@/lib/utils";
import "@/src/globals.css";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidEmail } from "@root/lib/user";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import z from "zod";
import AuthProviders from "../oauth-providers";

const formSchema = z.object({
	email: z
		.string()
		.min(2, {
			message: "Invalid email address",
		})
		.max(256, { message: "Invalid email address" }),
	password: z.string().min(1, {
		message: "Invalid password",
	}),
});

const LoginPage = () => {
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

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
			error = "Invalid email address";
			setFormError(error);
		} else {
			error = null;
			setFormError(error);
		}

		return error;
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

		setLoading(true);

		const response = await useFetch("/api/auth/signin/credentials", {
			method: "POST",
			body: JSON.stringify({
				email: values.email,
				password: values.password,
			}),
		});
		setLoading(false);
		const result = await response.json();

		if (result?.success === false) {
			return setFormError(result?.message);
		}

		redirectToMessagePage(result?.message, "success", "/", "Home page");
	};
	return (
		<FormCard header="Log In" footer={<LoginPageFooter />}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="w-full flex flex-col items-center justify-center gap-5"
					name={"login"}
				>
					<div className="w-full flex flex-col items-center justify-center">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<>
									<FormItem className="w-full flex flex-col items-center justify-center">
										<FormLabel className="w-full flex items-center justify-between text-left gap-12">
											<span className="text-foreground font-semibold">Email</span>
											<FormMessage className="leading-tight" />
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="email"
												placeholder="example@abc.com"
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

					<div className="w-full flex flex-col items-center justify-center">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<>
									<FormItem className="w-full flex flex-col items-center justify-center">
										<FormLabel className="w-full flex items-center justify-between text-left gap-12">
											<span className="text-foreground font-semibold">Password</span>
											<FormMessage className="leading-tight" />
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="********"
												type="password"
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

					<Button type="submit" aria-label="Login" className="w-full">
						Login
					</Button>
				</form>
				{loading === true && <AbsolutePositionedSpinner />}
			</Form>
		</FormCard>
	);
};

const LoginPageFooter = () => {
	return (
		<>
			<div className="w-full flex items-start justify-center flex-col">
				<div className="w-full flex items-center gap-4 mt-2">
					<hr className="bg-bg-hover border-none w-full h-[0.1rem] flex-1" />
					<p className="shrink-0 text-sm text-foreground/30">OR</p>
					<hr className="bg-bg-hover border-none w-full h-[0.1rem] flex-1" />
				</div>

				<p className="text-sm flex items-center justify-start mx-1 my-2 text-foreground-muted">Login using:</p>
				<div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
					<AuthProviders />
				</div>
			</div>

			<div className="w-full flex flex-col items-center justify-center gap-1 mt-4 text-sm">
				<p className="text-center text-foreground">
					<span className="text-foreground-muted">Don't have an account?&nbsp;</span>
					<Link
						to="/signup"
						aria-label="Sign up"
						className="text-foreground/90 font-semibold decoration-[0.1rem] hover:underline underline-offset-2"
					>
						Sign up
					</Link>
				</p>
				<p className="text-center">
					<span className="text-foreground-muted">Forgot password?&nbsp;</span>
					<Link
						to="/change-password"
						aria-label="Change password"
						className="text-foreground/90 font-semibold decoration-[0.1rem] hover:underline underline-offset-2"
					>
						Change password
					</Link>
				</p>
			</div>
		</>
	);
};

export default LoginPage;

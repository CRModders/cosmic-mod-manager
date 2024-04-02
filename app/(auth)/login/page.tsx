import React, { Suspense } from "react";
import Link from "next/link";
import AuthProviders from "@/app/(auth)/authproviders";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoginForm from "./Form";
import LoadingUI from "@/components/ui/spinner";

const LoginPage = async () => {
	return (
		<div className="w-full flex items-center justify-center ">
			<div className="flex w-full max-w-md flex-col gap-4 rounded-large">
				<Card className="relative">
					<CardHeader className="w-full flex items-center justify-start">
						<h1 className="w-full text-left text-xl font-semibold">Log In</h1>
					</CardHeader>
					<CardContent className="w-full flex flex-col gap-2">
						<div className="w-full flex flex-col items-center justify-center gap-4">
							<Suspense fallback={<LoadingUI />}>
								<LoginForm />
							</Suspense>
						</div>

						<div className="w-full flex items-start justify-center flex-col">
							<div className="w-full flex items-center gap-4 mt-2">
								<hr className="bg-background_hover dark:bg-background_hover_dark border-none w-full h-[0.1rem] flex-1" />
								<p className="shrink-0 text-sm text-foreground_muted/50 dark:text-foreground_muted_dark/50">
									OR
								</p>
								<hr className="bg-background_hover dark:bg-background_hover_dark border-none w-full h-[0.1rem] flex-1" />
							</div>

							<p className="text-sm flex items-center justify-start mx-1 my-2 text-foreground_muted dark:text-foreground_muted_dark">
								Log In using :
							</p>
							<div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
								<AuthProviders />
							</div>
						</div>

						<div className="w-full flex flex-col items-center justify-center gap-1 mt-4 text-sm">
							<p className="text-center text-foreground dark:text-foreground_dark">
								<span className="text-foreground_muted dark:text-foreground_muted_dark">
									Need to create an account?&nbsp;
								</span>
								<Link
									href="/register"
									className="text-foreground dark:text-foreground_dark hover:underline underline-offset-2 font-bold"
								>
									Sign Up
								</Link>
							</p>
							<p className="text-center text-foreground dark:text-foreground_dark">
								<span className="text-foreground_muted dark:text-foreground_muted_dark">
									Don't remember your password?&nbsp;
								</span>
								<Link
									href="/change-password"
									className="text-foreground dark:text-foreground_dark hover:underline underline-offset-2 font-bold"
								>
									Change password
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default LoginPage;

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import AuthProviders from "@/app/(auth)/authproviders";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoadingUI from "@/components/ui/spinner";
import { get_locale } from "@/lib/lang";
import getLangPref from "@/lib/server/getLangPref";
import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "./Form";
import AuthError from "./authError";

const LoginPage = async () => {
	const langPref = getLangPref();
	const locale = get_locale(langPref).content;

	return (
		<div className="w-full flex items-center justify-center ">
			<div className="flex w-full max-w-md flex-col gap-4 rounded-large">
				<Suspense fallback={<LoadingUI />}>
					<AuthError locale={locale} />
				</Suspense>
				<Card className="relative">
					<CardHeader className="w-full flex items-center justify-start">
						<h1 className="w-full text-left text-xl">{locale.auth.login}</h1>
					</CardHeader>
					<CardContent className="w-full flex flex-col gap-2">
						<div className="w-full flex flex-col items-center justify-center gap-4">
							<Suspense fallback={<LoadingUI />}>
								<LoginForm locale={locale} />
							</Suspense>
						</div>

						<div className="w-full flex items-start justify-center flex-col">
							<div className="w-full flex items-center gap-4 mt-2">
								<hr className="bg-background_hover dark:bg-background_hover_dark border-none w-full h-[0.1rem] flex-1" />
								<p className="shrink-0 text-sm text-foreground_muted/50 dark:text-foreground_muted_dark/50">OR</p>
								<hr className="bg-background_hover dark:bg-background_hover_dark border-none w-full h-[0.1rem] flex-1" />
							</div>

							<p className="text-sm flex items-center justify-start mx-1 my-2 text-foreground_muted dark:text-foreground_muted_dark">
								{locale.auth.login_page.log_in_using}
							</p>
							<div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
								<AuthProviders />
							</div>
						</div>

						<div className="w-full flex flex-col items-center justify-center gap-1 mt-4 text-sm">
							<p className="text-center text-foreground dark:text-foreground_dark">
								<span className="text-foreground/80 dark:text-foreground_dark/80">
									{locale.auth.login_page.dont_have_an_account}&nbsp;
								</span>
								<Link
									href="/register"
									aria-label={locale.auth.sign_up}
									className="text-foreground dark:text-foreground_dark decoration-[0.1rem] hover:underline underline-offset-2"
								>
									{locale.auth.sign_up}
								</Link>
							</p>
							<p className="text-center">
								<span className="text-foreground/80 dark:text-foreground_dark/80">
									{locale.auth.login_page.forgot_password_msg}&nbsp;
								</span>
								<Link
									href="/change-password"
									aria-label={locale.auth.change_password_page.change_password}
									className="text-foreground dark:text-foreground_dark decoration-[0.1rem] hover:underline underline-offset-2"
								>
									{locale.auth.change_password_page.change_password}
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

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { AuthContext } from "@/src/providers/auth-provider";
import { useContext } from "react";
import { Link } from "react-router-dom";
import ChangePasswordForm from "./change-password-form";

const ChangePasswordPage = () => {
	const { session } = useContext(AuthContext);

	if (session === undefined) {
		return (
			<div className="w-full flex items-center justify-center min-h-[100vh]">
				<Spinner size="2rem" />
			</div>
		);
	}

	return (
		<div className="w-full flex items-center justify-center ">
			<div className="flex w-full max-w-md flex-col gap-4 rounded-large">
				<Card className="relative">
					<CardHeader className="w-full flex items-center justify-start">
						<h1 className="w-full text-left text-xl text-foreground-muted font-semibold">Change password</h1>
					</CardHeader>
					<CardContent className="w-full flex flex-col gap-2">
						<div className="w-full flex flex-col items-center justify-center gap-4">
							<ChangePasswordForm userEmail={session?.email || ""} />
						</div>

						<div className="w-full flex items-start justify-center flex-col">
							<div className="w-full flex items-center gap-4 mt-2">
								<hr className="bg-background-shallow border-none w-full h-[0.1rem] flex-1" />
								<p className="shrink-0 text-sm text-foreground/50">OR</p>
								<hr className="bg-background-shallow border-none w-full h-[0.1rem] flex-1" />
							</div>
						</div>

						<div className="w-full flex flex-col items-center justify-center gap-6">
							<Link
								aria-label="Login"
								to="/login"
								className="text-foreground-muted hover:underline decoration-[0.1rem] underline-offset-2 font-semibold"
							>
								Login
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default ChangePasswordPage;

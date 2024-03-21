import { Metadata } from "next";
import { Suspense } from "react";
import LoadingUI from "@/app/loading";

export const metadata: Metadata = {
	title: "Login",
	description:
		"Log into cosmic reach mod manager to get a more personalized experience.",
};

export default function LoginPageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Suspense fallback={<LoadingUI />}>
			<section className="flex w-full flex-col items-center justify-center">
				<div className="inline-block w-full">{children}</div>
			</section>
		</Suspense>
	);
}

import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Register",
	description:
		"Register for an account to get upload access Cosmic Reach mod manager",
};

export default function RegisterPageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex w-full flex-col items-center justify-center">
			<div className="inline-block w-full">{children}</div>
		</section>
	);
}

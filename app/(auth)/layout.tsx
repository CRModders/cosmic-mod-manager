import { siteTitle } from "@/config";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		default: " ",
		template: `%s - ${siteTitle}`,
	},
	description: "Cosmic reach mod manager",
};

export default function LoginPageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex w-full flex-col items-center justify-center text-center min-h-[100dvh] py-12">
			{children}
		</section>
	);
}

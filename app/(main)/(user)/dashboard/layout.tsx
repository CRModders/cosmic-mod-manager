import { siteTitle } from "@/config";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		default: "Dashboard",
		template: `%s - ${siteTitle}`,
	},
	description: "Your dashboard. Manage and upload your content on CRMM.",
};

export default function LoginPageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex w-full flex-col items-center justify-center text-center min-h-[100dvh]">
			{children}
		</section>
	);
}

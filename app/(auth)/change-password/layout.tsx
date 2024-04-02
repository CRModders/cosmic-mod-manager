import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Reset password",
	description: "Reset your CRMM account password.",
};

export default function ResetPasswordPageLayout({
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

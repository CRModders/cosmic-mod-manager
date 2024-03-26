import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Profile",
	description: "Your profile on CRMM",
};

export default function ProfilePageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex w-full flex-col items-center justify-center">
			{children}
		</section>
	);
}

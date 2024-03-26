import { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		default: " ",
		template: "%s - Cosmic reach mod manager",
	},
	description: "Cosmic reach mod manager",
};

export default function LoginPageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex w-full flex-col items-center justify-center">
			<div className="w-full flex items-center justify-center text-center min-h-[100dvh] pb-4">
				<div className="w-full flex items-center justify-center text-center margin px-8 py-12">
					{children}
				</div>
			</div>
		</section>
	);
}

import LoadingUI from "@/components/ui/spinner";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Confirm Action",
	description: "",
};

export default function ConfirmActionPageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Suspense fallback={<LoadingUI />}>{children}</Suspense>;
}

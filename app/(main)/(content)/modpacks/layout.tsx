import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Modpacks",
	description: "Modpacks on CRMM",
};

const ModpacksPageLayout = async ({
	children,
}: { children: React.ReactNode }) => {
	return (
		<section className="w-full flex items-center justify-center">
			{children}
		</section>
	);
};

export default ModpacksPageLayout;

import { siteTitle } from "@/config";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: {
		default: " ",
		template: `%s - ${siteTitle}`,
	},
};

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<section className="w-full flex items-center justify-center">
			{children}
		</section>
	);
};

export default Layout;

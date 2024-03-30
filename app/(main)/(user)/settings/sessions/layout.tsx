import { siteTitle } from "@/config";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		default: "Sessions",
		template: `%s - ${siteTitle}`,
	},
	description: "CRMM session management page",
};

const SessionsPageLayout = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return children;
};

export default SessionsPageLayout;

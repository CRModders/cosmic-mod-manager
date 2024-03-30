import { siteTitle } from "@/config";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		default: "Account settings",
		template: `%s - ${siteTitle}`,
	},
	description: "CRMM account settings page",
};

const AccountSettingsPageLayout = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return children;
};

export default AccountSettingsPageLayout;

import PanelLayout, {
	PanelContent,
	SidePanel,
} from "@/components/PanelLayout/Panel";
import { ShieldIcon } from "@/components/icons";
import { PersonIcon } from "@radix-ui/react-icons";
import React from "react";
import SidepanelLink from "./SidepanelLink";

const SettingsPageLayout = ({ children }: { children: React.ReactNode }) => {
	const baseUrlPrefix = "/settings";

	const SidePanelLinks = [
		{
			name: "Account",
			href: `${baseUrlPrefix}/account`,
			icon: <PersonIcon className="w-5 h-5" />,
		},
		{
			name: "Sessions",
			href: `${baseUrlPrefix}/sessions`,
			icon: <ShieldIcon className="w-5 h-5" />,
		},
	];

	return (
		<div className="w-full">
			<PanelLayout>
				<SidePanel>
					<div className="w-full">
						<h1 className="w-full px-1 text-3xl font-bold tracking-wider mb-4 text-foreground/80 dark:text-foreground_dark/80">
							Settings
						</h1>
						<ul className="w-full flex flex-col items-start justify-center gap-1">
							{SidePanelLinks?.map((link) => {
								return (
									<li key={link.href} className="w-full">
										<SidepanelLink
											href={link.href}
											label={link.name}
											icon={link.icon}
										/>
									</li>
								);
							})}
						</ul>
					</div>
				</SidePanel>
				<PanelContent>{children}</PanelContent>
			</PanelLayout>
		</div>
	);
};

export default SettingsPageLayout;

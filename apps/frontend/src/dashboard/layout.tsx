import {
	BarChartIcon,
	BellIcon,
	BuildingsIcon,
	CollectionsIcon,
	DashboardIconOutlined,
	DollarIcon,
	FlagIcon,
	LayoutListIcon,
} from "@/components/icons";
import "@/src/globals.css";
import { PanelContent, PanelLayout, SidePanel, SidepanelLink } from "@/src/settings/panel";
import React from "react";
import { Outlet } from "react-router-dom";

export default function DashboardPageLayout() {
	const baseUrlPrefix = "/dashboard";

	const SidePanelLinks = [
		{
			name: "Overview",
			href: `${baseUrlPrefix}/overview`,
			icon: <DashboardIconOutlined size="1rem" />,
		},
		{
			name: "Notifications",
			href: `${baseUrlPrefix}/notifications`,
			icon: <BellIcon size="1rem" />,
		},
		{
			name: "Active reports",
			href: `${baseUrlPrefix}/reports`,
			icon: <FlagIcon size="1rem" />,
		},
		{
			name: "Analytics",
			href: `${baseUrlPrefix}/analytics`,
			icon: <BarChartIcon size="1rem" />,
		},
	];

	const ManagementPagesLinks = [
		{
			name: "Projects",
			href: `${baseUrlPrefix}/projects`,
			icon: <LayoutListIcon size="1rem" />,
		},
		{
			name: "Organisations",
			href: `${baseUrlPrefix}/organisations`,
			icon: <BuildingsIcon size="1rem" />,
		},
		{
			name: "Collections",
			href: `${baseUrlPrefix}/collections`,
			icon: <CollectionsIcon size="1rem" />,
		},
		{
			name: "Revenue",
			href: `${baseUrlPrefix}/revenue`,
			icon: <DollarIcon size="1rem" />,
		},
	];

	return (
		<div className="w-full pb-32">
			<PanelLayout>
				<SidePanel>
					<div className="w-full">
						<h1 className="w-full px-1 text-3xl font-semibold mb-4 text-foreground-muted">Dashboard</h1>
						<ul className="w-full flex flex-col items-start justify-center gap-1">
							{SidePanelLinks?.map((link) => {
								return (
									<React.Fragment key={link.href}>
										<SidepanelLink href={link.href} label={link.name} icon={link.icon} />
									</React.Fragment>
								);
							})}
						</ul>
					</div>
					<div className="w-full mt-4">
						<h1 className="w-full px-1 text-xl font-semibold mb-2 text-foreground">Manage</h1>
						<ul className="w-full flex flex-col items-start justify-center gap-1">
							{ManagementPagesLinks?.map((link) => {
								return (
									<React.Fragment key={link.href}>
										<SidepanelLink href={link.href} label={link.name} icon={link.icon} />
									</React.Fragment>
								);
							})}
						</ul>
					</div>
				</SidePanel>
				<PanelContent>
					<Outlet />
				</PanelContent>
			</PanelLayout>
		</div>
	);
}

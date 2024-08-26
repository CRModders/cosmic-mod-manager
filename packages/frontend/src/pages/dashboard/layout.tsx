import { Panel, PanelAside, PanelAsideNavCard, PanelContent } from "@/components/layout/panel";
import { ButtonLink } from "@/components/ui/link";
import { SITE_NAME_SHORT } from "@shared/config";
import {
    BarChart2Icon,
    BellIcon,
    Building2Icon,
    DollarSignIcon,
    FlagIcon,
    LayoutDashboardIcon,
    LayoutListIcon,
    LibraryIcon,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <>
            <Helmet>
                <title>Dashboard | {SITE_NAME_SHORT}</title>
                <meta name="description" content="Dashboard" />
            </Helmet>

            <Panel className="pb-12">
                <PanelAside>
                    <PanelAsideNavCard label="Dashboard">
                        {SidePanelLinks.map((link) => (
                            <ButtonLink url={link.href} key={link.href}>
                                {link.icon}
                                {link.name}
                            </ButtonLink>
                        ))}

                        <span className="text-lg font-semibold mt-3">Manage</span>
                        {ManagementPagesLinks.map((link) => (
                            <ButtonLink url={link.href} key={link.href}>
                                {link.icon}
                                {link.name}
                            </ButtonLink>
                        ))}
                    </PanelAsideNavCard>
                </PanelAside>
                <PanelContent>
                    <Outlet />
                </PanelContent>
            </Panel>
        </>
    );
};

export default DashboardLayout;

const baseUrlPrefix = "/dashboard";
const SidePanelLinks = [
    {
        name: "Overview",
        href: `${baseUrlPrefix}/overview`,
        icon: <LayoutDashboardIcon size="1rem" />,
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
        icon: <BarChart2Icon size="1rem" />,
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
        icon: <Building2Icon size="1rem" />,
    },
    {
        name: "Collections",
        href: `${baseUrlPrefix}/collections`,
        icon: <LibraryIcon size="1rem" />,
    },
    {
        name: "Revenue",
        href: `${baseUrlPrefix}/revenue`,
        icon: <DollarSignIcon size="1rem" />,
    },
];

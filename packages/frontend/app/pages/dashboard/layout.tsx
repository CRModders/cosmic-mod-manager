import { Outlet } from "@remix-run/react";
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
import { Panel, PanelAside, PanelAsideNavCard, PanelContent } from "~/components/layout/panel";
import { ButtonLink } from "~/components/ui/link";
import type { RootOutletData } from "~/routes/layout";

interface Props {
    outletContext: RootOutletData;
}

export default function DashboardLayout({ outletContext }: Props) {
    return (
        <Panel className="pb-12">
            <PanelAside aside>
                <PanelAsideNavCard label="Dashboard">
                    {SidePanelLinks.map((link) => (
                        <ButtonLink url={link.href} key={link.href} className="relative" preventScrollReset>
                            {link.icon}
                            {link.name}
                        </ButtonLink>
                    ))}

                    <span className="text-lg font-semibold mt-3">Manage</span>
                    {ManagementPagesLinks.map((link) => (
                        <ButtonLink url={link.href} key={link.href} preventScrollReset>
                            {link.icon}
                            {link.name}
                        </ButtonLink>
                    ))}
                </PanelAsideNavCard>
            </PanelAside>
            <PanelContent main>
                <Outlet context={outletContext} />
            </PanelContent>
        </Panel>
    );
}

const baseUrlPrefix = "/dashboard";
const SidePanelLinks = [
    {
        name: "Overview",
        href: `${baseUrlPrefix}`,
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
        name: "Organizations",
        href: `${baseUrlPrefix}/organizations`,
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

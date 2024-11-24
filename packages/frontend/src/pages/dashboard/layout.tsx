import { Panel, PanelAside, PanelAsideNavCard, PanelContent } from "@/components/layout/panel";
import { NotificationBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/link";
import { useSession } from "@/src/contexts/auth";
import { SITE_NAME_LONG } from "@shared/config";
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
import { Outlet } from "react-router";
import { RedirectIfNotLoggedIn } from "../auth/guards";

const DashboardLayout = () => {
    const { notifications } = useSession();
    const undreadNotifications = (notifications || [])?.filter((n) => !n.read).length;

    return (
        <>
            <Helmet>
                <title>Dashboard | {SITE_NAME_LONG}</title>
                <meta name="description" content="Dashboard" />
            </Helmet>

            <RedirectIfNotLoggedIn redirectTo="/login" />

            <Panel className="pb-12">
                <PanelAside>
                    <PanelAsideNavCard label="Dashboard">
                        {SidePanelLinks.map((link) => (
                            <ButtonLink url={link.href} key={link.href} className="relative" preventScrollReset>
                                {link.icon}
                                {link.name}

                                {link.notificationBadge && undreadNotifications > 0 ? (
                                    <NotificationBadge>{undreadNotifications}</NotificationBadge>
                                ) : null}
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
                <PanelContent>
                    <Outlet />
                </PanelContent>
            </Panel>
        </>
    );
};

export const Component = DashboardLayout;

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
        notificationBadge: true,
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

import { CubeIcon, fallbackOrgIcon } from "@/components/icons";
import { ContentCardTemplate, Panel, PanelAside, PanelContent } from "@/components/layout/panel";
import { ImgWrapper } from "@/components/ui/avatar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ButtonLink } from "@/components/ui/link";
import { getOrgPagePathname, imageUrl } from "@/lib/utils";
import { RedirectIfNotLoggedIn } from "@/src/pages/auth/guards";
import { SITE_NAME_SHORT } from "@shared/config";
import { BarChart2Icon, SettingsIcon, UsersIcon } from "lucide-react";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";
import { orgDataContext } from "../org-context";

const OrgSettingsLayout = () => {
    const { orgData, projects } = useContext(orgDataContext);
    const baseUrl = orgData ? getOrgPagePathname(orgData.slug) : "";

    if (!orgData) {
        return null;
    }

    return (
        <>
            <Helmet>
                <title>
                    {orgData.name || ""} - Organization Settings | {SITE_NAME_SHORT}
                </title>
                <meta name="description" content="Organization settings" />
            </Helmet>

            <RedirectIfNotLoggedIn redirectTo="/login" />

            <Panel className="pb-12">
                <PanelAside className="flex flex-col gap-panel-cards lg:w-80">
                    <ContentCardTemplate className="gap-3">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard/organizations">Organizations</BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={baseUrl}>{orgData.name}</BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Settings</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="w-full flex items-start justify-start gap-3">
                            <ImgWrapper
                                src={imageUrl(orgData.icon)}
                                alt={orgData.name}
                                fallback={fallbackOrgIcon}
                                className="rounded h-14 w-14"
                            />

                            <div className="flex flex-col items-start justify-start">
                                <span className="text-lg font-semibold">{orgData.name}</span>
                                <span className="flex items-center justify-center gap-1 text-muted-foreground">
                                    {projects?.length || 0} {projects?.length === 1 ? "project" : "projects"}
                                </span>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-1">
                            <span className="text-xl font-semibold text-muted-foreground mt-1 mb-0.5">Organization settings</span>
                            {SidePanelLinks.map((link) => (
                                <ButtonLink key={link.href} url={`${baseUrl}/${link.href}`} preventScrollReset>
                                    {link.icon}
                                    {link.name}
                                </ButtonLink>
                            ))}
                        </div>
                    </ContentCardTemplate>
                </PanelAside>

                <PanelContent>
                    <Outlet />
                </PanelContent>
            </Panel>
        </>
    );
};

const SidePanelLinks = [
    {
        name: "Overview",
        href: "settings",
        icon: <SettingsIcon className="w-btn-icon h-btn-icon" />,
    },
    {
        name: "Members",
        href: "settings/members",
        icon: <UsersIcon className="w-btn-icon h-btn-icon" />,
    },
    {
        name: "Projects",
        href: "settings/projects",
        icon: <CubeIcon className="w-btn-icon h-btn-icon" />,
    },
    {
        name: "Analytics",
        href: "settings/analytics",
        icon: <BarChart2Icon className="w-btn-icon h-btn-icon" />,
    },
];

export const Component = OrgSettingsLayout;

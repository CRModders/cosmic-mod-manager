import { getOrgPagePathname, imageUrl } from "@root/utils";
import { SITE_NAME_SHORT } from "@shared/config";
import { BarChart2Icon, SettingsIcon, UsersIcon } from "lucide-react";
import { Outlet, useOutletContext } from "react-router";
import { CubeIcon, fallbackOrgIcon } from "~/components/icons";
import { ContentCardTemplate, Panel, PanelAside, PanelContent } from "~/components/layout/panel";
import { ImgWrapper } from "~/components/ui/avatar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { ButtonLink } from "~/components/ui/link";
import type { OrgDataContext } from "~/routes/organization/data-wrapper";

export default function OrgSettingsLayout() {
    const { session, orgData, orgProjects: projects, currUsersMembership } = useOutletContext<OrgDataContext>();
    const baseUrl = getOrgPagePathname(orgData.slug);

    return (
        <>
            <title>
                {orgData.name || ""} Settings - {SITE_NAME_SHORT}
            </title>

            <Panel className="pb-12">
                <PanelAside aside className="flex flex-col gap-panel-cards lg:w-80">
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
                                vtId={orgData.id}
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

                <PanelContent main>
                    <Outlet
                        context={
                            {
                                session: session,
                                orgData: orgData,
                                orgProjects: projects,
                                currUsersMembership,
                            } satisfies OrgDataContext
                        }
                    />
                </PanelContent>
            </Panel>
        </>
    );
}

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

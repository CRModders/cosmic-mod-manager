import { Outlet } from "react-router";
import { getProjectPagePathname, imageUrl } from "@root/utils";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import type { LoggedInUserData } from "@shared/types";
import type { ProjectDetailsData, TeamMember } from "@shared/types/api";
import {
    BarChart2Icon,
    ChevronRightIcon,
    CopyrightIcon,
    GitCommitHorizontalIcon,
    ImageIcon,
    LinkIcon,
    SettingsIcon,
    TagsIcon,
    TextIcon,
    UsersIcon,
} from "lucide-react";
import { ProjectStatusIcon, fallbackProjectIcon } from "~/components/icons";
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

export interface ProjectSettingsContext {
    session: LoggedInUserData;
    projectData: ProjectDetailsData;
    currUsersMembership: TeamMember;
}

export default function ProjectSettingsLayout({ session, projectData, currUsersMembership }: ProjectSettingsContext) {
    const baseUrl = projectData ? getProjectPagePathname(projectData.type[0] || "project", projectData.slug) : "";

    return (
        <Panel className="pb-12">
            <PanelAside aside className="flex flex-col gap-panel-cards lg:w-80">
                <ContentCardTemplate className="gap-3">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard/projects">Projects</BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={baseUrl}>{projectData.name}</BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Settings</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="w-full flex items-start justify-start gap-3">
                        <ImgWrapper
                            vtId={projectData.id}
                            src={imageUrl(projectData.icon)}
                            alt={projectData.name}
                            fallback={fallbackProjectIcon}
                            className="rounded h-14 w-14"
                        />

                        <div className="flex flex-col items-start justify-start">
                            <span className="text-lg font-semibold">{projectData.name}</span>
                            <span className="flex items-center justify-center gap-1 font-semibold text-muted-foreground">
                                <ProjectStatusIcon status={projectData.status} />
                                {CapitalizeAndFormatString(projectData.status)}
                            </span>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-1">
                        <span className="text-xl font-semibold mt-1 mb-0.5">Project settings</span>
                        {SidePanelLinks.map((link) => (
                            <ButtonLink
                                prefetch={link.prefetch ? "render" : undefined}
                                key={link.href}
                                url={`${baseUrl}/${link.href}`}
                                preventScrollReset
                            >
                                {link.icon}
                                {link.name}
                            </ButtonLink>
                        ))}

                        <span className="text-lg font-semibold mt-2">View</span>
                        {viewPageLinks.map((link) => (
                            <ButtonLink prefetch="render" key={link.href} url={`${baseUrl}/${link.href}`} className="justify-between">
                                <div className="flex items-center justify-center gap-2">
                                    {link.icon}
                                    {link.name}
                                </div>
                                <ChevronRightIcon className="w-btn-icon h-btn-icon text-muted-foreground" />
                            </ButtonLink>
                        ))}

                        <span className="text-lg font-semibold mt-2">Upload</span>
                        {UploadPageLinks.map((link) => (
                            <ButtonLink prefetch="render" key={link.href} url={`${baseUrl}/${link.href}`} className="justify-between">
                                <div className="flex items-center justify-center gap-2">
                                    {link.icon}
                                    {link.name}
                                </div>
                                <ChevronRightIcon className="w-btn-icon h-btn-icon text-muted-foreground" />
                            </ButtonLink>
                        ))}
                    </div>
                </ContentCardTemplate>
            </PanelAside>

            <PanelContent main>
                <Outlet
                    context={
                        {
                            session,
                            projectData,
                            currUsersMembership,
                        } satisfies ProjectSettingsContext
                    }
                />
            </PanelContent>
        </Panel>
    );
}

const SidePanelLinks = [
    {
        name: "General",
        href: "settings",
        icon: <SettingsIcon className="w-btn-icon h-btn-icon" />,
    },
    {
        name: "Tags",
        href: "settings/tags",
        icon: <TagsIcon className="w-btn-icon h-btn-icon" />,
    },
    {
        name: "Description",
        href: "settings/description",
        icon: <TextIcon className="w-btn-icon h-btn-icon" />,
    },
    {
        name: "License",
        href: "settings/license",
        icon: <CopyrightIcon className="w-btn-icon h-btn-icon" />,
    },
    {
        name: "Links",
        href: "settings/links",
        icon: <LinkIcon className="w-btn-icon h-btn-icon" />,
    },
    {
        name: "Members",
        href: "settings/members",
        icon: <UsersIcon className="w-btn-icon h-btn-icon" />,
        prefetch: false,
    },
];

const viewPageLinks = [
    {
        name: "Analytics",
        href: "settings/analytics",
        icon: <BarChart2Icon className="w-btn-icon h-btn-icon" />,
    },
];

const UploadPageLinks = [
    {
        name: "Gallery",
        href: "gallery",
        icon: <ImageIcon className="w-btn-icon h-btn-icon" />,
    },
    {
        name: "Versions",
        href: "versions",
        icon: <GitCommitHorizontalIcon className="w-btn-icon h-btn-icon" />,
    },
];

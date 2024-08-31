import { fallbackProjectIcon } from "@/components/icons";
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
import { getProjectPagePathname, imageUrl } from "@/lib/utils";
import { projectContext } from "@/src/contexts/curr-project";
import { SITE_NAME_SHORT } from "@shared/config";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
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
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";

const ProjectSettingsLayout = ({ projectType }: { projectType: string }) => {
    const { projectData } = useContext(projectContext);
    const baseUrl = projectData ? getProjectPagePathname(projectData.type[0] || projectType, projectData.slug) : "";

    if (!projectData) {
        return null;
    }

    return (
        <>
            <Helmet>
                <title>
                    {projectData?.name || ""} - Settings | {SITE_NAME_SHORT}
                </title>
            </Helmet>

            <Panel className="pb-12">
                <PanelAside className="flex flex-col gap-panel-cards lg:w-80">
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
                                src={imageUrl(projectData.icon)}
                                alt={projectData.name}
                                fallback={fallbackProjectIcon}
                                className="rounded h-14"
                            />

                            <div className="flex flex-col items-start justify-start">
                                <span className="text-lg font-semibold">{projectData.name}</span>
                                <span className="font-semibold text-muted-foreground">{CapitalizeAndFormatString(projectData.status)}</span>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-1">
                            <span className="text-xl font-semibold mt-1 mb-0.5">Project settings</span>
                            {SidePanelLinks.map((link) => (
                                <ButtonLink key={link.href} url={`${baseUrl}/${link.href}`}>
                                    {link.icon}
                                    {link.name}
                                </ButtonLink>
                            ))}

                            <span className="text-lg font-semibold mt-2">View</span>
                            {viewPageLinks.map((link) => (
                                <ButtonLink key={link.href} url={`${baseUrl}/${link.href}`} className="justify-between">
                                    <div className="flex items-center justify-center gap-2">
                                        {link.icon}
                                        {link.name}
                                    </div>
                                    <ChevronRightIcon className="w-btn-icon h-btn-icon text-muted-foreground" />
                                </ButtonLink>
                            ))}

                            <span className="text-lg font-semibold mt-2">Upload</span>
                            {UploadPageLinks.map((link) => (
                                <ButtonLink key={link.href} url={`${baseUrl}/${link.href}`} className="justify-between">
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

                <PanelContent>
                    <Outlet />
                </PanelContent>
            </Panel>
        </>
    );
};

export default ProjectSettingsLayout;

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

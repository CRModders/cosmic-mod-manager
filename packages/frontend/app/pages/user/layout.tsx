import { PopoverClose } from "@radix-ui/react-popover";
import { imageUrl } from "@root/utils";
import { OrgPagePath, UserProfilePath } from "@root/utils/urls";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import { getProjectTypesFromNames } from "@shared/lib/utils/convertors";
import { GlobalUserRole } from "@shared/types";
import type { Organisation, ProjectListItem } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import { CalendarIcon, ClipboardCopyIcon, DownloadIcon, EditIcon, FlagIcon } from "lucide-react";
import { CubeIcon, fallbackOrgIcon, fallbackUserIcon } from "~/components/icons";
import { PageHeader } from "~/components/layout/page-header";
import { ContentCardTemplate } from "~/components/layout/panel";
import { ImgWrapper } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { TimePassedSince } from "~/components/ui/date";
import Link, { VariantButtonLink } from "~/components/ui/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { useSession } from "~/hooks/session";
import SecondaryNav from "../project/secondary-nav";
import "./styles.css";

interface Props {
    children: React.ReactNode;
    userData: UserProfileData;
    projectsList: ProjectListItem[];
    orgsList: Organisation[];
}

export default function UserPageLayout({ userData, projectsList, orgsList, children }: Props) {
    const aggregatedDownloads = (projectsList || [])?.reduce((acc, project) => acc + project.downloads, 0) || 0;
    const totalProjects = (projectsList || [])?.length;

    const aggregatedProjectTypes = new Set<string>();
    for (const project of projectsList || []) {
        for (const type of project.type) {
            aggregatedProjectTypes.add(type);
        }
    }
    const projectTypesList = Array.from(aggregatedProjectTypes);

    return (
        <main className="profile-page-layout pb-12 gap-panel-cards">
            <ProfilePageHeader userData={userData} totalDownloads={aggregatedDownloads} totalProjects={totalProjects} />
            <div
                className="h-fit grid grid-cols-1 gap-panel-cards"
                style={{
                    gridArea: "content",
                }}
            >
                {projectTypesList?.length > 1 && totalProjects > 1 ? (
                    <SecondaryNav
                        className="bg-card-background rounded-lg px-3 py-2"
                        urlBase={UserProfilePath(userData.userName)}
                        links={[
                            { label: "All", href: "" },
                            ...getProjectTypesFromNames(projectTypesList).map((type) => ({
                                label: `${CapitalizeAndFormatString(type)}s`,
                                href: `/${type}s`,
                            })),
                        ]}
                    />
                ) : null}

                {totalProjects ? (
                    // biome-ignore lint/a11y/useSemanticElements: <explanation>
                    <div className="w-full flex flex-col gap-panel-cards" role="list">
                        {children}
                    </div>
                ) : (
                    <div className="w-full flex items-center justify-center py-12">
                        <p className="text-lg text-muted-foreground italic text-center">
                            {userData.userName} doesn't have any projects yet.
                        </p>
                    </div>
                )}
            </div>
            <PageSidebar userName={userData.userName} userId={userData.id} orgsList={orgsList || []} />
        </main>
    );
}

function PageSidebar({ userName, userId, orgsList }: { userName: string; userId: string; orgsList: Organisation[] }) {
    const joinedOrgs = orgsList.filter((org) => {
        const member = org.members.find((member) => member.userId === userId);
        return member?.accepted === true;
    });

    return (
        <div style={{ gridArea: "sidebar" }} className="w-full flex flex-col gap-panel-cards">
            <ContentCardTemplate title="Organizations" titleClassName="text-lg">
                {!joinedOrgs.length ? (
                    <span className="text-muted-foreground/75 italic">{userName} is not a member of any Organization</span>
                ) : null}

                <div className="flex flex-wrap gap-2 items-start justify-start">
                    <TooltipProvider>
                        {joinedOrgs.map((org) => (
                            <Tooltip key={org.id}>
                                <TooltipTrigger asChild>
                                    <Link to={OrgPagePath(org.slug)}>
                                        <ImgWrapper
                                            vtId={org.id}
                                            src={imageUrl(org.icon)}
                                            alt={org.name}
                                            fallback={fallbackOrgIcon}
                                            className="w-14 h-14"
                                        />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>{org.name}</TooltipContent>
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                </div>
            </ContentCardTemplate>
            {/* <ContentCardTemplate title="Badges" titleClassName="text-lg">
                <span className="text-muted-foreground italic">List of badges the user has earned</span>
            </ContentCardTemplate> */}
        </div>
    );
}

interface ProfilePageHeaderProps {
    totalProjects: number;
    totalDownloads: number;
    userData: UserProfileData;
}

function ProfilePageHeader({ userData, totalProjects, totalDownloads }: ProfilePageHeaderProps) {
    const session = useSession();
    let title = null;

    if ([GlobalUserRole.ADMIN, GlobalUserRole.MODERATOR].includes(userData.role)) {
        title = "Moderator";
    }

    return (
        <PageHeader
            vtId={userData.id}
            icon={imageUrl(userData.avatar)}
            iconClassName="rounded-full"
            fallbackIcon={fallbackUserIcon}
            title={userData.userName}
            description={userData.bio || ""}
            titleBadge={title ? <span className="font-semibold text-tiny uppercase text-extra-muted-foreground">{title}</span> : null}
            threeDotMenu={
                <>
                    <Button variant="ghost-destructive" className="w-full">
                        <FlagIcon className="w-btn-icon h-btn-icon" />
                        Report
                    </Button>
                    <PopoverClose asChild>
                        <Button
                            className="w-full"
                            variant="ghost"
                            onClick={() => {
                                navigator.clipboard.writeText(userData.id);
                            }}
                        >
                            <ClipboardCopyIcon className="w-btn-icon h-btn-icon" />
                            Copy ID
                        </Button>
                    </PopoverClose>
                </>
            }
            actionBtns={
                userData.id === session?.id ? (
                    <VariantButtonLink variant="secondary-inverted" url="/settings/profile" prefetch="render">
                        <EditIcon className="w-btn-icon h-btn-icon" />
                        Edit
                    </VariantButtonLink>
                ) : null
            }
        >
            <div className="flex items-center gap-2 border-0 border-r border-card-background dark:border-shallow-background pr-4">
                <CubeIcon className="w-btn-icon-md h-btn-icon-md" />
                <span className="font-semibold">{totalProjects} projects</span>
            </div>
            <div className="flex items-center gap-2 border-0 border-r border-card-background dark:border-shallow-background pr-4">
                <DownloadIcon className="w-btn-icon-md h-btn-icon-md" />
                <span className="font-semibold">{totalDownloads} downloads</span>
            </div>
            <div className="flex items-center gap-2">
                <CalendarIcon className="w-btn-icon-md h-btn-icon-md" />
                <span className="font-semibold">
                    Joined <TimePassedSince date={userData.dateJoined} />
                </span>
            </div>
        </PageHeader>
    );
}

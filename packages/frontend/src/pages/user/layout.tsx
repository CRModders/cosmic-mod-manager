import { CubeIcon, fallbackOrgIcon, fallbackUserIcon } from "@/components/icons";
import { PageHeader } from "@/components/layout/page-header";
import { ContentCardTemplate } from "@/components/layout/panel";
import { ImgWrapper } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VariantButtonLink } from "@/components/ui/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getOrgPagePathname, imageUrl, timeSince } from "@/lib/utils";
import { useSession } from "@/src/contexts/auth";
import { userProfileContext } from "@/src/contexts/user-profile";
import { PopoverClose } from "@radix-ui/react-popover";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import { getProjectTypesFromNames } from "@shared/lib/utils/convertors";
import type { Organisation } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import { CalendarIcon, ClipboardCopyIcon, DownloadIcon, EditIcon, FlagIcon } from "lucide-react";
import { useContext } from "react";
import { Link, useParams } from "react-router";
import SecondaryNav from "../project/secondary-nav";
import UserProjectsList from "./page";
import "./styles.css";

const UserPageLayout = () => {
    const { projectType } = useParams();
    const { userData, projectsList, orgsList } = useContext(userProfileContext);

    if (!userData) return null;

    const aggregatedDownloads = projectsList?.reduce((acc, project) => acc + project.downloads, 0) || 0;
    const totalProjects = projectsList?.length || 0;
    const aggregatedProjectTypes = new Set<string>();
    for (const project of projectsList || []) {
        for (const type of project.type) {
            aggregatedProjectTypes.add(type);
        }
    }
    const projectTypesList = Array.from(aggregatedProjectTypes);

    return (
        <div className="profile-page-layout pb-12 gap-panel-cards">
            <ProfilePageHeader userData={userData} totalDownloads={aggregatedDownloads} totalProjects={totalProjects} />
            <div
                className="flex items-start justify-start flex-col gap-panel-cards"
                style={{
                    gridArea: "content",
                }}
            >
                {projectTypesList?.length > 1 && totalProjects > 1 ? (
                    <SecondaryNav
                        className="bg-card-background rounded-lg px-3 py-2"
                        urlBase={`/user/${userData.userName}`}
                        links={[
                            { label: "All", href: "" },
                            ...getProjectTypesFromNames(projectTypesList).map((type) => ({
                                label: `${CapitalizeAndFormatString(type)}s` || "",
                                href: `/${type}s`,
                            })),
                        ]}
                    />
                ) : null}

                {totalProjects ? (
                    <ul className="w-full flex flex-col gap-panel-cards">
                        <UserProjectsList projectType={projectType} projectsList={projectsList} />
                    </ul>
                ) : (
                    <div className="w-full flex items-center justify-center py-12">
                        <p className="text-lg text-muted-foreground italic text-center">
                            {userData.userName} doesn't have any projects yet.
                        </p>
                    </div>
                )}
            </div>
            <PageSidebar userName={userData.userName} userId={userData.id} orgsList={orgsList || []} />
        </div>
    );
};

export const Component = UserPageLayout;

const PageSidebar = ({ userName, userId, orgsList }: { userName: string; userId: string; orgsList: Organisation[] }) => {
    const joinedOrgs = orgsList.filter((org) => {
        const member = org.members.find((member) => member.userId === userId);
        return member?.accepted === true;
    });

    return (
        <aside
            style={{
                gridArea: "sidebar",
            }}
            className="w-full flex flex-col gap-panel-cards"
        >
            <ContentCardTemplate title="Organizations" titleClassName="text-lg">
                {!joinedOrgs.length ? (
                    <span className="text-muted-foreground/75 italic">{userName} is not a member of any Organization</span>
                ) : null}

                <div className="flex flex-wrap gap-2 items-start justify-start">
                    <TooltipProvider>
                        {joinedOrgs.map((org) => (
                            <Tooltip key={org.id}>
                                <TooltipTrigger asChild>
                                    <Link to={getOrgPagePathname(org.slug)}>
                                        <ImgWrapper
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
        </aside>
    );
};

interface ProfilePageHeaderProps {
    totalProjects: number;
    totalDownloads: number;
    userData: UserProfileData;
}

const ProfilePageHeader = ({ userData, totalProjects, totalDownloads }: ProfilePageHeaderProps) => {
    const { session } = useSession();

    return (
        <PageHeader
            icon={imageUrl(userData.avatarUrl)}
            iconClassName="rounded-full"
            fallbackIcon={fallbackUserIcon}
            title={userData.userName}
            description={userData.bio || ""}
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
                    <VariantButtonLink variant="secondary-inverted" url="/settings">
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
                <span className="font-semibold">Joined {timeSince(new Date(userData.dateJoined))}</span>
            </div>
        </PageHeader>
    );
};

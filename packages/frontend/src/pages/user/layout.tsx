import { CubeIcon, fallbackUserIcon } from "@/components/icons";
import { ContentCardTemplate } from "@/components/layout/panel";
import { ImgWrapper } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VariantButtonLink } from "@/components/ui/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { imageUrl, timeSince } from "@/lib/utils";
import { useSession } from "@/src/contexts/auth";
import { userProfileContext } from "@/src/contexts/user-profile";
import { PopoverClose } from "@radix-ui/react-popover";
import { SITE_NAME_SHORT } from "@shared/config";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import type { UserProfileData } from "@shared/types/api/user";
import { CalendarIcon, ClipboardCopyIcon, DownloadIcon, EditIcon, FlagIcon, MoreVertical } from "lucide-react";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";
import SecondaryNav from "../project/secondary-nav";
import "./styles.css";

const UserPageLayout = () => {
    const { userData, projectsList } = useContext(userProfileContext);

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
        <>
            <Helmet>
                <title>
                    {userData?.userName || ""} | {SITE_NAME_SHORT}
                </title>
                <meta name="description" content={`${userData.userName}'s profile on ${SITE_NAME_SHORT}`} />
            </Helmet>

            <div className="profile-page-layout pb-12 gap-panel-cards">
                <ProfilePageHeader userData={userData} totalDownloads={aggregatedDownloads} totalProjects={totalProjects} />
                <div
                    className="flex items-start justify-start flex-col gap-panel-cards"
                    style={{
                        gridArea: "content",
                    }}
                >
                    {projectTypesList?.length > 1 ? (
                        <SecondaryNav
                            className="bg-card-background rounded-lg px-3 py-2"
                            urlBase={`/user/${userData.userName}`}
                            links={[
                                { label: "All", href: "" },
                                ...projectTypesList.map((type) => ({ label: CapitalizeAndFormatString(type) || "", href: `/${type}` })),
                            ]}
                        />
                    ) : null}
                    <Outlet />
                </div>
                <PageSidebar />
            </div>
        </>
    );
};

export default UserPageLayout;

const PageSidebar = () => {
    return (
        <div
            style={{
                gridArea: "sidebar",
            }}
            className="w-full flex flex-col gap-panel-cards"
        >
            <ContentCardTemplate title="Organisations" titleClassName="text-lg">
                <span className="text-muted-foreground italic">List of organisations</span>
            </ContentCardTemplate>
            <ContentCardTemplate title="Badges" titleClassName="text-lg">
                <span className="text-muted-foreground italic">List of badges the user has earned</span>
            </ContentCardTemplate>
        </div>
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
        <div className="profile-page-header w-full max-w-full mt-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-x-8 gap-y-6 pb-5 mb-2 border-0 border-b border-card-background dark:border-shallow-background">
            <div className="flex gap-5">
                <ImgWrapper
                    src={imageUrl(userData.avatarUrl)}
                    alt={userData.userName}
                    className="bg-card-background dark:bg-shallow-background/50 shadow shadow-white dark:shadow-black rounded-lg"
                    fallback={fallbackUserIcon}
                />
                <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h1 className="m-0 text-xl font-extrabold leading-none text-foreground-bright">{userData.userName}</h1>
                    </div>
                    <p className="text-muted-foreground leading-tight line-clamp-2 max-w-[70ch]">{userData.bio}</p>
                    <div className="mt-auto flex flex-wrap gap-4 text-muted-foreground">
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
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    {userData.id === session?.id ? (
                        <VariantButtonLink variant="secondary-inverted" url="/settings">
                            <EditIcon className="w-btn-icon h-btn-icon" />
                            Edit
                        </VariantButtonLink>
                    ) : null}

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"ghost-inverted"} className="rounded-full w-11 h-11 p-0" aria-label="more options">
                                <MoreVertical className="h-btn-icon-lg w-btn-icon-lg" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit flex flex-col gap-1 items-center justify-center min-w-0 p-2">
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
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    );
};

import { CubeIcon, fallbackOrgIcon, fallbackUserIcon } from "@app/components/icons";
import { MicrodataItemProps, MicrodataItemType, itemType } from "@app/components/microdata";
import { ContentCardTemplate } from "@app/components/misc/panel";
import { Button } from "@app/components/ui/button";
import Chip from "@app/components/ui/chip";
import { PopoverClose } from "@app/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@app/components/ui/tooltip";
import { getProjectTypesFromNames } from "@app/utils/convertors";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { GlobalUserRole } from "@app/utils/types";
import type { Organisation, ProjectListItem } from "@app/utils/types/api";
import type { UserProfileData } from "@app/utils/types/api/user";
import { imageUrl } from "@app/utils/url";
import { CalendarIcon, ClipboardCopyIcon, DownloadIcon, EditIcon, FlagIcon } from "lucide-react";
import { PageHeader } from "~/components/page-header";
import { ImgWrapper } from "~/components/ui/avatar";
import { TimePassedSince } from "~/components/ui/date";
import Link, { VariantButtonLink } from "~/components/ui/link";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { OrgPagePath, UserProfilePath } from "~/utils/urls";
import SecondaryNav from "../project/secondary-nav";

interface Props {
    children: React.ReactNode;
    userData: UserProfileData;
    projectsList: ProjectListItem[];
    orgsList: Organisation[];
}

export default function UserPageLayout({ userData, projectsList, orgsList, children }: Props) {
    const { t } = useTranslation();
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
        <main className="profile-page-layout pb-12 gap-panel-cards" itemScope itemType={itemType(MicrodataItemType.Person)}>
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
                            { label: t.common.all, href: "" },
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
                        <p className="text-lg text-muted-foreground italic text-center">{t.user.doesntHaveProjects(userData.userName)}</p>
                    </div>
                )}
            </div>
            <PageSidebar userName={userData.userName} userId={userData.id} orgsList={orgsList || []} />
        </main>
    );
}

function PageSidebar({ userName, userId, orgsList }: { userName: string; userId: string; orgsList: Organisation[] }) {
    const { t } = useTranslation();
    const joinedOrgs = orgsList.filter((org) => {
        const member = org.members.find((member) => member.userId === userId);
        return member?.accepted === true;
    });

    return (
        <div style={{ gridArea: "sidebar" }} className="w-full flex flex-col gap-panel-cards">
            <ContentCardTemplate title={t.dashboard.organizations} titleClassName="text-lg">
                {!joinedOrgs.length ? <span className="text-muted-foreground/75 italic">{t.user.isntPartOfAnyOrgs(userName)}</span> : null}

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
    const { t } = useTranslation();
    const session = useSession();
    let title = null;

    if ([GlobalUserRole.ADMIN, GlobalUserRole.MODERATOR].includes(userData.role)) {
        title = t.user.moderator;
    }
    return (
        <PageHeader
            vtId={userData.id}
            icon={imageUrl(userData.avatar)}
            iconClassName="rounded-full"
            fallbackIcon={fallbackUserIcon}
            title={userData.userName}
            description={userData.bio || ""}
            titleBadge={
                title ? (
                    <Chip className="font-semibold text-purple-600 dark:text-purple-400 !text-tiny uppercase bg-card-background">
                        {title}
                    </Chip>
                ) : null
            }
            threeDotMenu={
                <>
                    <Button variant="ghost-destructive" className="w-full" size="sm">
                        <FlagIcon className="w-btn-icon h-btn-icon" />
                        {t.common.report}
                    </Button>

                    <PopoverClose asChild>
                        <Button
                            className="w-full"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                navigator.clipboard.writeText(userData.id);
                            }}
                        >
                            <ClipboardCopyIcon className="w-btn-icon h-btn-icon" />
                            {t.common.copyId}
                            <span itemProp={MicrodataItemProps.itemid} className="sr-only">
                                {userData.id}
                            </span>
                        </Button>
                    </PopoverClose>
                </>
            }
            actionBtns={
                userData.id === session?.id ? (
                    <VariantButtonLink variant="secondary-inverted" url="/settings/profile" prefetch="render">
                        <EditIcon className="w-btn-icon h-btn-icon" />
                        {t.form.edit}
                    </VariantButtonLink>
                ) : null
            }
        >
            <div className="flex items-center gap-2 border-0 border-r border-card-background dark:border-shallow-background pr-4">
                <CubeIcon className="w-btn-icon-md h-btn-icon-md" />
                <span className="font-semibold">{t.user.projectsCount(totalProjects)}</span>
            </div>
            <div className="flex items-center gap-2 border-0 border-r border-card-background dark:border-shallow-background pr-4">
                <DownloadIcon className="w-btn-icon-md h-btn-icon-md" />
                <span className="font-semibold">{t.user.downloads(`${totalDownloads}`)}</span>
            </div>
            <div className="flex items-center gap-2">
                <CalendarIcon className="w-btn-icon-md h-btn-icon-md" />
                <span className="font-semibold">{t.user.joined(TimePassedSince({ date: userData.dateJoined }))}</span>
            </div>
        </PageHeader>
    );
}

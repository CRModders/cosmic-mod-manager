import { CubeIcon, fallbackOrgIcon, fallbackUserIcon } from "@app/components/icons";
import { MicrodataItemProps, MicrodataItemType, itemType } from "@app/components/microdata";
import { ContentCardTemplate } from "@app/components/misc/panel";
import { Button } from "@app/components/ui/button";
import Chip from "@app/components/ui/chip";
import { Prefetch } from "@app/components/ui/link";
import { PopoverClose } from "@app/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@app/components/ui/tooltip";
import { getProjectTypesFromNames } from "@app/utils/convertors";
import { FormatCount } from "@app/utils/number";
import { GlobalUserRole } from "@app/utils/types";
import type { Collection, Organisation, ProjectListItem } from "@app/utils/types/api";
import type { UserProfileData } from "@app/utils/types/api/user";
import { imageUrl } from "@app/utils/url";
import { CalendarIcon, ClipboardCopyIcon, DownloadIcon, EditIcon, FlagIcon } from "lucide-react";
import { PageHeader } from "~/components/page-header";
import { ImgWrapper } from "~/components/ui/avatar";
import { TimePassedSince } from "~/components/ui/date";
import Link, { VariantButtonLink } from "~/components/ui/link";
import { useSession } from "~/hooks/session";
import { formatLocaleCode } from "~/locales";
import { useTranslation } from "~/locales/provider";
import { OrgPagePath, UserProfilePath } from "~/utils/urls";
import SecondaryNav from "../project/secondary-nav";
import type { UserOutletData } from "~/routes/user/layout";
import { Outlet } from "react-router";

interface Props {
    userData: UserProfileData;
    projectsList: ProjectListItem[];
    orgsList: Organisation[];
    collections: Collection[];
}

export default function UserPageLayout(props: Props) {
    const { t } = useTranslation();
    const aggregatedDownloads = (props.projectsList || [])?.reduce((acc, project) => acc + project.downloads, 0) || 0;
    const totalProjects = (props.projectsList || [])?.length;

    const aggregatedProjectTypes = new Set<string>();
    for (const project of props.projectsList || []) {
        for (const type of project.type) {
            aggregatedProjectTypes.add(type);
        }
    }
    const projectTypesList = Array.from(aggregatedProjectTypes);

    const navLinks = [];
    if (props.projectsList.length > 0) navLinks.push({ label: t.common.all, href: "" });
    if (props.collections.length > 0) navLinks.push({ label: t.dashboard.collections, href: "/collections" });

    if (projectTypesList.length > 1) {
        navLinks.push(
            ...getProjectTypesFromNames(projectTypesList).map((type) => ({
                label: t.navbar[`${type}s`],
                href: `/${type}s`,
            })),
        );
    }

    return (
        <main className="profile-page-layout pb-12 gap-panel-cards" itemScope itemType={itemType(MicrodataItemType.Person)}>
            <ProfilePageHeader userData={props.userData} totalDownloads={aggregatedDownloads} totalProjects={totalProjects} />
            <div className="h-fit grid grid-cols-1 gap-panel-cards" style={{ gridArea: "content" }}>
                {navLinks?.length > 1 ? (
                    <SecondaryNav
                        className="bg-card-background rounded-lg px-3 py-2"
                        urlBase={UserProfilePath(props.userData.userName)}
                        links={navLinks}
                    />
                ) : null}

                {navLinks.length < 1 ? (
                    <div className="w-full flex items-center justify-center py-12">
                        <p className="text-lg text-muted-foreground italic text-center">{t.user.doesntHaveProjects(props.userData.name)}</p>
                    </div>
                ) : (
                    // biome-ignore lint/a11y/useSemanticElements: <explanation>
                    <div className="w-full flex flex-col gap-panel-cards" role="list">
                        <Outlet
                            context={
                                {
                                    projectsList: props.projectsList,
                                    collections: props.collections,
                                    userData: props.userData,
                                } satisfies UserOutletData
                            }
                        />
                    </div>
                )}
            </div>

            <PageSidebar displayName={props.userData.name} userId={props.userData.id} orgsList={props.orgsList || []} />
        </main>
    );
}

function PageSidebar({ displayName, userId, orgsList }: { displayName: string; userId: string; orgsList: Organisation[] }) {
    const { t } = useTranslation();
    const joinedOrgs = orgsList.filter((org) => {
        const member = org.members.find((member) => member.userId === userId);
        return member?.accepted === true;
    });

    return (
        <div style={{ gridArea: "sidebar" }} className="w-full flex flex-col gap-panel-cards">
            <ContentCardTemplate title={t.dashboard.organizations} titleClassName="text-lg">
                {!joinedOrgs.length ? (
                    <span className="text-muted-foreground/75 italic">{t.user.isntPartOfAnyOrgs(displayName)}</span>
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

            {
                // TODO:
                /* <ContentCardTemplate title="Badges" titleClassName="text-lg">
                    <span className="text-muted-foreground italic">List of badges the user has earned</span>
                </ContentCardTemplate> */
            }
        </div>
    );
}

interface ProfilePageHeaderProps {
    totalProjects: number;
    totalDownloads: number;
    userData: UserProfileData;
}

function ProfilePageHeader({ userData, totalProjects, totalDownloads }: ProfilePageHeaderProps) {
    const { t, locale } = useTranslation();
    const session = useSession();
    let title = null;

    if (GlobalUserRole.ADMIN === userData.role) {
        title = t.user[GlobalUserRole.ADMIN];
    } else if (GlobalUserRole.MODERATOR === userData.role) {
        title = t.user[GlobalUserRole.MODERATOR];
    }

    const ProjectsCount = t.count.projects(totalProjects);
    const DownloadsCount = t.count.downloads(totalDownloads);

    let DownloadsCount_Str = FormatCount(totalDownloads, formatLocaleCode(locale));
    if (DownloadsCount[0].length > 0) DownloadsCount_Str = `${DownloadsCount[0]} ${DownloadsCount_Str}`;
    if (DownloadsCount[2].length > 0) DownloadsCount_Str += ` ${DownloadsCount[2]}`;
    return (
        <PageHeader
            vtId={userData.id}
            icon={imageUrl(userData.avatar)}
            iconClassName="rounded-full"
            fallbackIcon={fallbackUserIcon}
            title={userData.name}
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
                    <Button variant="ghost-destructive" className="w-full justify-start" size="sm">
                        <FlagIcon aria-hidden className="w-btn-icon h-btn-icon" />
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
                            <ClipboardCopyIcon aria-hidden className="w-btn-icon h-btn-icon" />
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
                    <VariantButtonLink variant="secondary-inverted" url="/settings/profile" prefetch={Prefetch.Render}>
                        <EditIcon aria-hidden className="w-btn-icon h-btn-icon" />
                        {t.form.edit}
                    </VariantButtonLink>
                ) : null
            }
        >
            <div className="flex items-center gap-2 border-0 border-e border-card-background dark:border-shallow-background pe-4">
                <CubeIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                <span className="font-semibold">{ProjectsCount.join(" ")}</span>
            </div>
            <div className="flex items-center gap-2 border-0 border-e border-card-background dark:border-shallow-background pe-4">
                <DownloadIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                <span className="font-semibold">{DownloadsCount_Str}</span>
            </div>
            <div className="flex items-center gap-2">
                <CalendarIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                <span className="font-semibold">{t.user.joined(TimePassedSince({ date: userData.dateJoined }))}</span>
            </div>
        </PageHeader>
    );
}

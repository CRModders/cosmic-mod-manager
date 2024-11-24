import { fallbackUserIcon } from "@/components/icons";
import { ContentCardTemplate, PanelContent_AsideCardLayout } from "@/components/layout/panel";
import { ImgWrapper } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/link";
import { FullWidthSpinner, LoadingSpinner } from "@/components/ui/spinner";
import { imageUrl } from "@/lib/utils";
import { useSession } from "@/src/contexts/auth";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon, HistoryIcon } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router";
import { getAllUserProjectsQuery } from "./_loader";
import { NotificationsContext } from "./notifications/context";
import { NotificationItem } from "./notifications/page";

const OverviewPage = () => {
    const { session } = useSession();
    const {
        notifications,
        relatedProjects,
        relatedUsers,
        relatedOrgs,
        isLoading: notificationsLoading,
        refetchNotifications,
    } = useContext(NotificationsContext);
    const unreadNotifications = notifications?.filter((notification) => !notification.read);

    const projectsList = useQuery(getAllUserProjectsQuery());
    const totalProjects = projectsList.data?.length || 0;
    const totalDownloads = projectsList.data?.reduce((acc, project) => acc + project.downloads, 0) || 0;
    const totalFollowers = 0;

    if (!session?.id) return null;

    return (
        <div className="w-full flex flex-col items-start justify-start gap-panel-cards">
            <ContentCardTemplate>
                <div className="w-full flex flex-wrap gap-6">
                    <ImgWrapper
                        src={imageUrl(session?.avatarUrl)}
                        alt={session?.userName}
                        fallback={fallbackUserIcon}
                        className="rounded-full"
                    />

                    <div className="flex flex-col items-start justify-center">
                        <span className="text-xl font-semibold">{session.userName}</span>
                        <Link to={`/user/${session.userName}`} className="flex gap-1 items-center justify-center link_blue">
                            View your profile
                            <ChevronRightIcon className="w-btn-icon h-btn-icon" />
                        </Link>
                    </div>
                </div>
            </ContentCardTemplate>

            <PanelContent_AsideCardLayout>
                {notificationsLoading ? (
                    <FullWidthSpinner />
                ) : (
                    <Card className="w-full">
                        <CardHeader className="w-full flex flex-row items-center justify-between gap-x-6 gap-y-2">
                            <CardTitle className="w-fit">Notifications</CardTitle>
                            {(unreadNotifications?.length || 0) > 0 ? (
                                <Link to="/dashboard/notifications" className="link_blue flex items-center justify-center">
                                    See all
                                    <ChevronRightIcon className="w-btn-icon-md h-btn-icon-md" />
                                </Link>
                            ) : null}
                        </CardHeader>
                        <CardContent>
                            <ul className="w-full flex flex-col items-start justify-center gap-2">
                                {unreadNotifications?.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        relatedProject={relatedProjects?.get(`${notification.body?.projectId}`)}
                                        relatedUser={relatedUsers?.get(`${notification.body?.invitedBy}`)}
                                        relatedOrg={relatedOrgs?.get(`${notification.body?.orgId}`)}
                                        refetchNotifications={refetchNotifications}
                                        concise={true}
                                        showMarkAsReadButton={false}
                                    />
                                ))}

                                {!unreadNotifications?.length && (
                                    <li aria-label="No unread notifications">
                                        <span className="text-muted-foreground">You have no unread notifications.</span>

                                        <ButtonLink url="/dashboard/notifications/history" className="w-fit bg-shallow-background">
                                            <HistoryIcon className="w-btn-icon h-btn-icon" />
                                            View notification history
                                        </ButtonLink>
                                    </li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                <ContentCardTemplate title="Analytics" className="w-full flex flex-wrap flex-row items-start justify-start gap-panel-cards">
                    {projectsList.isLoading ? (
                        <div className="w-[14rem] h-full flex items-center justify-center p-4">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            <div className="w-[14rem] flex flex-col items-start justify-center bg-background p-4 rounded">
                                <span className="text-lg text-muted-foreground font-semibold mb-1">Total downloads</span>
                                <span className="text-2xl font-semibold">{totalDownloads}</span>
                                <span className="text-muted-foreground">from {totalProjects} projects</span>
                            </div>
                            <div className="w-[14rem] flex flex-col items-start justify-center bg-background p-4 rounded">
                                <span className="text-lg text-muted-foreground font-semibold mb-1">Total followers</span>
                                <span className="text-2xl font-semibold">{totalFollowers}</span>
                                <span className="text-muted-foreground">from {totalProjects} projects</span>
                            </div>
                        </>
                    )}
                </ContentCardTemplate>
            </PanelContent_AsideCardLayout>
        </div>
    );
};

export const Component = OverviewPage;

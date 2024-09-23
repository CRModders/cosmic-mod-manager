import { fallbackUserIcon } from "@/components/icons";
import { ContentCardTemplate, PanelContent_AsideCardLayout } from "@/components/layout/panel";
import { ImgWrapper } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/link";
import { imageUrl } from "@/lib/utils";
import { useSession } from "@/src/contexts/auth";
import { ChevronRightIcon, HistoryIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { userProfileContext } from "@/src/contexts/user-profile";
import { useContext } from "react";

const OverviewPage = () => {
    const { session } = useSession();
    const { projectsList } = useContext(userProfileContext);

    const totalProjects = projectsList?.length || 0;
    const totalDownloads = projectsList?.reduce((acc, project) => acc + project.downloads, 0) || 0;
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
                <ContentCardTemplate title="Notifications">
                    <div className="w-full flex flex-col items-start justify-center gap-2">
                        <span className="text-muted-foreground">You have no unread notifications.</span>
                        <ButtonLink url="/dashboard/notifications" className="w-fit bg-shallow-background">
                            <HistoryIcon className="w-btn-icon h-btn-icon" />
                            View notification history
                        </ButtonLink>
                    </div>
                </ContentCardTemplate>

                <ContentCardTemplate title="Analytics" className="w-full flex flex-wrap flex-row items-start justify-start gap-panel-cards">
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
                </ContentCardTemplate>
            </PanelContent_AsideCardLayout>
        </div>
    );
};

export default OverviewPage;

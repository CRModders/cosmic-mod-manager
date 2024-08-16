import { ContentCardTemplate, PanelContent_AsideCardLayout } from "@/components/layout/panel";
import AvatarImg from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/link";
import { useSession } from "@/src/contexts/auth";
import { ChevronRightIcon, HistoryIcon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

const OverviewPage = () => {
    const { session } = useSession();

    if (!session?.id) return null;

    return (
        <div className="w-full flex flex-col items-start justify-start gap-panel-cards">
            <ContentCardTemplate>
                <div className="w-full flex flex-wrap gap-6">
                    <AvatarImg
                        url={session?.avatarUrl || ""}
                        alt={session?.userName}
                        fallback={<UserIcon className="w-1/2 h-1/2 text-muted-foreground" />}
                        wrapperClassName="h-24"
                    />

                    <div className="flex flex-col items-start justify-center">
                        <span className="text-xl font-semibold">{session.userName}</span>
                        <Link
                            to={"/settings/account"}
                            className="flex gap-1 items-center justify-center link_blue underline hover:no-underline"
                        >
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
                        <span className="text-2xl font-semibold">43,849</span>
                        <span className="text-muted-foreground">from n projects</span>
                    </div>
                    <div className="w-[14rem] flex flex-col items-start justify-center bg-background p-4 rounded">
                        <span className="text-lg text-muted-foreground font-semibold mb-1">Total followers</span>
                        <span className="text-2xl font-semibold">4,227</span>
                        <span className="text-muted-foreground">from n projects</span>
                    </div>
                </ContentCardTemplate>
            </PanelContent_AsideCardLayout>
        </div>
    );
};

export default OverviewPage;

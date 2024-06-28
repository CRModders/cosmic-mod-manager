import { ContentWrapperCard } from "@/components/panel-layout";
import { Helmet } from "react-helmet";

const Notifications = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-4">
            <Helmet>
                <title>Notifications | CRMM</title>
                <meta name="description" content="Your unread notifications." />
            </Helmet>

            <ContentWrapperCard>
                <h1 className="w-full flex items-center justify-start font-semibold text-2xl text-foreground-muted">
                    Notifications
                </h1>
                <div className="w-full flex">
                    <p>You don't have any unread notifications.</p>
                </div>
            </ContentWrapperCard>
        </div>
    );
};

export default Notifications;

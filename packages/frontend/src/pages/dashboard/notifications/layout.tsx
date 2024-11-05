import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { NotificationsContext } from "./context";

const NotificationsPageLayout = () => {
    const { refetchNotifications } = useContext(NotificationsContext);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        refetchNotifications();
    }, []);

    return <Outlet />;
};

export const Component = NotificationsPageLayout;

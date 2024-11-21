import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { NotificationsContext } from "./context";

const NotificationsPageLayout = () => {
    const { refetchNotifications } = useContext(NotificationsContext);

    useEffect(() => {
        refetchNotifications();
    }, []);

    return <Outlet />;
};

export const Component = NotificationsPageLayout;

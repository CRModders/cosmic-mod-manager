import { Outlet } from "react-router-dom";
import { OrgDataContextProvider } from "./org-context";

const OrganisationPageLayoutWrapper = () => {
    return (
        <OrgDataContextProvider>
            <Outlet />
        </OrgDataContextProvider>
    );
};

export const Component = OrganisationPageLayoutWrapper;

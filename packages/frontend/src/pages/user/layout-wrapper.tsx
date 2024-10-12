import { UserProfileContextProvider } from "@/src/contexts/user-profile";
import { Outlet } from "react-router-dom";

const UserProfileLayoutWrapper = () => {
    return (
        <UserProfileContextProvider>
            <Outlet />
        </UserProfileContextProvider>
    );
};

export const Component = UserProfileLayoutWrapper;

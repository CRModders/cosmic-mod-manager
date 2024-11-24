import ProjectContextProvider from "@/src/contexts/curr-project";
import { Outlet } from "react-router";

const ProjectLayoutWrapper = () => {
    return (
        <ProjectContextProvider>
            <Outlet />
        </ProjectContextProvider>
    );
};

export const Component = ProjectLayoutWrapper;

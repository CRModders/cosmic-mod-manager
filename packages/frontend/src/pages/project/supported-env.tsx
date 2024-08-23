import { ProjectSupport } from "@shared/types";
import { GlobeIcon, HardDriveIcon, MonitorIcon } from "lucide-react";

const ClientSide = () => {
    return (
        <span className="flex items-center justify-start gap-x-1 font-semibold text-muted-foreground">
            <MonitorIcon className="w-btn-icon h-btn-icon" />
            Client side
        </span>
    );
};

const ServerSide = () => {
    return (
        <span className="flex items-center justify-start gap-x-1 font-semibold text-muted-foreground">
            <HardDriveIcon className="w-btn-icon h-btn-icon" />
            Server side
        </span>
    );
};

const ClientOrServerSide = () => {
    return (
        <span className="flex items-center justify-start gap-x-1 font-semibold text-muted-foreground">
            <GlobeIcon className="w-btn-icon h-btn-icon" />
            Client or server
        </span>
    );
};

const ClientAndServerSide = () => {
    return (
        <span className="flex items-center justify-start gap-x-1 font-semibold text-muted-foreground">
            <GlobeIcon className="w-btn-icon h-btn-icon" />
            Client and server
        </span>
    );
};

const Unsupported = () => {
    return (
        <span className="flex items-center justify-start gap-x-1 font-semibold text-muted-foreground">
            <GlobeIcon className="w-btn-icon h-btn-icon" />
            Unsupported
        </span>
    );
};

export const ProjectSupprotedEnvironments = ({ clientSide, serverSide }: { clientSide: ProjectSupport; serverSide: ProjectSupport }) => {
    if (clientSide === ProjectSupport.REQUIRED && serverSide === ProjectSupport.REQUIRED) {
        return <ClientAndServerSide />;
    }

    if (clientSide === ProjectSupport.OPTIONAL && serverSide === ProjectSupport.OPTIONAL) {
        return (
            <ClientOrServerSide />
        );
    }

    if (clientSide === ProjectSupport.REQUIRED && serverSide === ProjectSupport.OPTIONAL) {
        return (
            <>
                <ClientSide />
                <span className="flex gap-1 items-center">
                    <ServerSide />
                    <em className="text-extra-muted-foreground text-sm italic leading-none">(optional)</em>
                </span>
            </>
        )
    }

    if (clientSide === ProjectSupport.OPTIONAL && serverSide === ProjectSupport.REQUIRED) {
        return (
            <>
                <ServerSide />
                <span className="flex gap-1 items-center">
                    <ClientSide />
                    <em className="text-extra-muted-foreground text-sm italic leading-none">(optional)</em>
                </span>
            </>
        )
    }

    if (serverSide === ProjectSupport.REQUIRED || serverSide === ProjectSupport.OPTIONAL) return <ServerSide />;
    if (clientSide === ProjectSupport.REQUIRED || clientSide === ProjectSupport.OPTIONAL) return <ClientSide />;

    return <Unsupported />;
};

const ProjectSupportedEnv = ({ clientSide, serverSide }: { clientSide: ProjectSupport; serverSide: ProjectSupport }) => {
    if (clientSide === ProjectSupport.REQUIRED && serverSide === ProjectSupport.REQUIRED) return <ClientAndServerSide />;
    if (clientSide === ProjectSupport.OPTIONAL && serverSide === ProjectSupport.OPTIONAL) return <ClientOrServerSide />;

    if (serverSide === ProjectSupport.REQUIRED) return <ServerSide />;
    if (clientSide === ProjectSupport.REQUIRED) return <ClientSide />;

    if (serverSide === ProjectSupport.OPTIONAL) return <ServerSide />;
    if (clientSide === ProjectSupport.OPTIONAL) return <ClientSide />;

    if (serverSide === ProjectSupport.UNKNOWN || clientSide === ProjectSupport.UNKNOWN) return null;

    return <Unsupported />;
};

export default ProjectSupportedEnv;

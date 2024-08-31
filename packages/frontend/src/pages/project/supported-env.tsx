import { cn } from "@/lib/utils";
import { ProjectSupport } from "@shared/types";
import { GlobeIcon, HardDriveIcon, MonitorIcon } from "lucide-react";

const ClientSide = ({ className }: { className?: string }) => {
    return (
        <span className={cn("flex items-center justify-start gap-x-1 font-semibold text-muted-foreground", className)}>
            <MonitorIcon className="w-btn-icon h-btn-icon" />
            Client side
        </span>
    );
};

const ServerSide = ({ className }: { className?: string }) => {
    return (
        <span className={cn("flex items-center justify-start gap-x-1 font-semibold text-muted-foreground", className)}>
            <HardDriveIcon className="w-btn-icon h-btn-icon" />
            Server side
        </span>
    );
};

const ClientOrServerSide = ({ className }: { className?: string }) => {
    return (
        <span className={cn("flex items-center justify-start gap-x-1 font-semibold text-muted-foreground", className)}>
            <GlobeIcon className="w-btn-icon h-btn-icon" />
            Client or server
        </span>
    );
};

const ClientAndServerSide = ({ className }: { className?: string }) => {
    return (
        <span className={cn("flex items-center justify-start gap-x-1 font-semibold text-muted-foreground", className)}>
            <GlobeIcon className="w-btn-icon h-btn-icon" />
            Client and server
        </span>
    );
};

const Unsupported = ({ className }: { className?: string }) => {
    return (
        <span className={cn("flex items-center justify-start gap-x-1 font-semibold text-muted-foreground", className)}>
            <GlobeIcon className="w-btn-icon h-btn-icon" />
            Unsupported
        </span>
    );
};

export const ProjectSupprotedEnvironments = ({ clientSide, serverSide }: { clientSide: ProjectSupport; serverSide: ProjectSupport }) => {
    const environments = [];

    if (clientSide === ProjectSupport.REQUIRED && serverSide === ProjectSupport.REQUIRED) {
        environments.push(<ClientAndServerSide key="Client-and-server" />);
    } else if (clientSide === ProjectSupport.OPTIONAL && serverSide === ProjectSupport.OPTIONAL) {
        environments.push(
            ...[<ClientSide key="Client-size" />, <ServerSide key="Server-size" />, <ClientAndServerSide key="Client-and-server" />],
        );
    } else if (clientSide === ProjectSupport.REQUIRED && serverSide === ProjectSupport.OPTIONAL) {
        environments.push(...[<ClientSide key="Client-size" />, <ClientAndServerSide key="Client-and-server" />]);
    } else if (clientSide === ProjectSupport.OPTIONAL && serverSide === ProjectSupport.REQUIRED) {
        environments.push(...[<ServerSide key="Server-size" />, <ClientAndServerSide key="Client-and-server" />]);
    } else if (clientSide === ProjectSupport.REQUIRED || clientSide === ProjectSupport.OPTIONAL) {
        environments.push(...[<ClientSide key="Client-size" />]);
    } else if (serverSide === ProjectSupport.REQUIRED || serverSide === ProjectSupport.OPTIONAL) {
        environments.push(...[<ServerSide key="Server-size" />]);
    }

    return environments;
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

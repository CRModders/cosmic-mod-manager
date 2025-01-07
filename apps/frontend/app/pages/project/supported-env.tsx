import { cn } from "@app/components/utils";
import { EnvironmentSupport } from "@app/utils/types";
import { GlobeIcon, HardDriveIcon, MonitorIcon } from "lucide-react";
import { useTranslation } from "~/locales/provider";

interface Props {
    className?: string;
}
function ClientSide({ className }: Props) {
    const { t } = useTranslation();
    return (
        <span
            className={cn("flex items-center justify-start gap-x-1 font-semibold text-muted-foreground cursor-help", className)}
            title="Needs to be installed on the game client"
        >
            <MonitorIcon aria-hidden className="w-btn-icon h-btn-icon" />
            {t.projectSettings.clientSide}
        </span>
    );
}

function ServerSide({ className }: Props) {
    const { t } = useTranslation();
    return (
        <span
            className={cn("flex items-center justify-start gap-x-1 font-semibold text-muted-foreground cursor-help", className)}
            title="Needs to be installed on the server"
        >
            <HardDriveIcon aria-hidden className="w-btn-icon h-btn-icon" />
            {t.projectSettings.serverSide}
        </span>
    );
}

function ClientOrServerSide({ className }: Props) {
    const { t } = useTranslation();
    return (
        <span
            className={cn("flex items-center justify-start gap-x-1 font-semibold text-muted-foreground cursor-help", className)}
            title="Can be installed on either the game client or the server"
        >
            <GlobeIcon aria-hidden className="w-btn-icon h-btn-icon" />
            {t.projectSettings.clientOrServer}
        </span>
    );
}

function ClientAndServerSide({ className }: Props) {
    const { t } = useTranslation();
    return (
        <span
            className={cn("flex items-center justify-start gap-x-1 font-semibold text-muted-foreground cursor-help", className)}
            title="Needs to be installed on both the game client and the server"
        >
            <GlobeIcon aria-hidden className="w-btn-icon h-btn-icon" />
            {t.projectSettings.clientAndServer}
        </span>
    );
}

function Unsupported({ className }: Props) {
    const { t } = useTranslation();
    return (
        <span className={cn("flex items-center justify-start gap-x-1 font-semibold text-muted-foreground", className)}>
            <GlobeIcon aria-hidden className="w-btn-icon h-btn-icon" />
            {t.projectSettings.unsupported}
        </span>
    );
}

export function ProjectSupprotedEnvironments({
    clientSide,
    serverSide,
}: { clientSide: EnvironmentSupport; serverSide: EnvironmentSupport }) {
    const environments = [];

    if (clientSide === EnvironmentSupport.REQUIRED && serverSide === EnvironmentSupport.REQUIRED) {
        environments.push(<ClientAndServerSide key="Client-and-server" />);
    } else if (clientSide === EnvironmentSupport.OPTIONAL && serverSide === EnvironmentSupport.OPTIONAL) {
        environments.push(
            ...[<ClientSide key="Client-size" />, <ServerSide key="Server-size" />, <ClientAndServerSide key="Client-and-server" />],
        );
    } else if (clientSide === EnvironmentSupport.REQUIRED && serverSide === EnvironmentSupport.OPTIONAL) {
        environments.push(...[<ClientSide key="Client-size" />, <ClientAndServerSide key="Client-and-server" />]);
    } else if (clientSide === EnvironmentSupport.OPTIONAL && serverSide === EnvironmentSupport.REQUIRED) {
        environments.push(...[<ServerSide key="Server-size" />, <ClientAndServerSide key="Client-and-server" />]);
    } else if (clientSide === EnvironmentSupport.REQUIRED || clientSide === EnvironmentSupport.OPTIONAL) {
        environments.push(...[<ClientSide key="Client-size" />]);
    } else if (serverSide === EnvironmentSupport.REQUIRED || serverSide === EnvironmentSupport.OPTIONAL) {
        environments.push(...[<ServerSide key="Server-size" />]);
    }

    return environments;
}

export default function ProjectSupportedEnv({
    clientSide,
    serverSide,
}: { clientSide: EnvironmentSupport; serverSide: EnvironmentSupport }) {
    if (clientSide === EnvironmentSupport.REQUIRED && serverSide === EnvironmentSupport.REQUIRED) return <ClientAndServerSide />;
    if (clientSide === EnvironmentSupport.OPTIONAL && serverSide === EnvironmentSupport.OPTIONAL) return <ClientOrServerSide />;

    if (serverSide === EnvironmentSupport.REQUIRED) return <ServerSide />;
    if (clientSide === EnvironmentSupport.REQUIRED) return <ClientSide />;

    if (serverSide === EnvironmentSupport.OPTIONAL) return <ServerSide />;
    if (clientSide === EnvironmentSupport.OPTIONAL) return <ClientSide />;

    if (serverSide === EnvironmentSupport.UNKNOWN || clientSide === EnvironmentSupport.UNKNOWN) return null;

    return <Unsupported />;
}

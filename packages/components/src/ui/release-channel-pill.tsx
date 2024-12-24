import { CapitalizeAndFormatString } from "@app/utils/string";
import { VersionReleaseChannel } from "@app/utils/types";
import { FlaskConicalIcon } from "lucide-react";
import { cn } from "~/utils";

interface Props {
    releaseChannel: VersionReleaseChannel | string;
    labelClassName?: string;
    className?: string;
}

export default function ReleaseChannelChip({ releaseChannel, labelClassName, className }: Props) {
    return (
        <div
            className={cn(
                "flex gap-1.5 items-center justify-start",
                releaseChannelTextColor(releaseChannel as VersionReleaseChannel),
                className,
            )}
        >
            <div className="w-2 h-2 rounded-full bg-current" />
            <span className={cn("text-muted-foreground/90 leading-none font-semibold", labelClassName)}>
                {CapitalizeAndFormatString(releaseChannel)}
            </span>
        </div>
    );
}

export function ReleaseChannelBadge({ releaseChannel, className }: Props) {
    return (
        <div
            aria-hidden
            className={cn(
                "rounded-full h-10 aspect-square shrink-0 flex items-center justify-center",
                releaseChannelTextColor(releaseChannel as VersionReleaseChannel),
                releaseChannelBackgroundColor(releaseChannel as VersionReleaseChannel),
                className,
            )}
        >
            <ReleaseChannelIcon releaseChannel={releaseChannel as VersionReleaseChannel} className="w-5 h-5" />
        </div>
    );
}

function ReleaseChannelIcon({ releaseChannel, className }: Props) {
    switch (releaseChannel) {
        case VersionReleaseChannel.RELEASE:
            return <span className="font-extrabold uppercase">R</span>;

        case VersionReleaseChannel.BETA:
            return <span className="font-bold text-lg">β</span>;

        case VersionReleaseChannel.ALPHA:
            return <span className="font-bold text-[1.25rem]">α</span>;

        case VersionReleaseChannel.DEV:
            return <FlaskConicalIcon className="w-5 h-5" />;

        default:
            return null;
    }
}

export function releaseChannelTextColor(releaseChannel: VersionReleaseChannel) {
    switch (releaseChannel) {
        case VersionReleaseChannel.RELEASE:
            return "!text-blue-500 dark:!text-blue-400";

        case VersionReleaseChannel.BETA:
            return "!text-orange-600 dark:!text-orange-400";

        case VersionReleaseChannel.ALPHA:
        case VersionReleaseChannel.DEV:
            return "!text-danger-foreground";

        default:
            return "";
    }
}

export function releaseChannelBackgroundColor(releaseChannel: VersionReleaseChannel) {
    switch (releaseChannel) {
        case VersionReleaseChannel.RELEASE:
            return "!bg-blue-500/15 dark:!bg-blue-400/15";

        case VersionReleaseChannel.BETA:
            return "!bg-orange-600/15 dark:!bg-orange-400/15";

        case VersionReleaseChannel.ALPHA:
        case VersionReleaseChannel.DEV:
            return "!bg-danger-foreground/15";

        default:
            return "";
    }
}

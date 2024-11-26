import { cn } from "@root/utils";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import { VersionReleaseChannel } from "@shared/types";
import { FlaskConicalIcon } from "lucide-react";

type Props = {
    releaseChannel: VersionReleaseChannel | string;
    labelClassName?: string;
    className?: string;
};

const ReleaseChannelChip = ({ releaseChannel, labelClassName, className }: Props) => {
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
};

export default ReleaseChannelChip;

export const ReleaseChannelBadge = ({ releaseChannel, className }: Props) => {
    return (
        <div
            className={cn(
                "rounded-full h-10 aspect-square shrink-0 flex items-center justify-center",
                releaseChannelTextColor(releaseChannel as VersionReleaseChannel),
                releaseChannelBackgroundColor(releaseChannel as VersionReleaseChannel),
                className,
            )}
        >
            {releaseChannel === VersionReleaseChannel.DEV ? (
                <span className="flex items-center justify-center">
                    <FlaskConicalIcon className="w-[80%] h-[80%]" />
                </span>
            ) : (
                <span className="font-extrabold uppercase">{releaseChannel[0]}</span>
            )}
            <span className="sr-only">{CapitalizeAndFormatString(releaseChannel)}</span>
        </div>
    );
};

export const releaseChannelTextColor = (releaseChannel: VersionReleaseChannel) => {
    return releaseChannel === VersionReleaseChannel.RELEASE
        ? "!text-blue-500 dark:!text-blue-400"
        : releaseChannel === VersionReleaseChannel.BETA
          ? "!text-orange-600 dark:!text-orange-400"
          : releaseChannel === VersionReleaseChannel.ALPHA || releaseChannel === VersionReleaseChannel.DEV
            ? "!text-danger-foreground"
            : "";
};

export const releaseChannelBackgroundColor = (releaseChannel: VersionReleaseChannel) => {
    if (releaseChannel === VersionReleaseChannel.RELEASE) return "!bg-blue-500/15 dark:!bg-blue-400/15";
    if (releaseChannel === VersionReleaseChannel.BETA) return "!bg-orange-600/15 dark:!bg-orange-400/15";
    if (releaseChannel === VersionReleaseChannel.ALPHA) return "!bg-danger-foreground/15";
    if (releaseChannel === VersionReleaseChannel.DEV) return "!bg-danger-foreground/15";
    return "";
};

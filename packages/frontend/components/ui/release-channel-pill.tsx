import { cn } from "@/lib/utils";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import { VersionReleaseChannel } from "@shared/types";

type Props = {
    releaseChannel: VersionReleaseChannel | string;
    labelClassName?: string;
    className?: string;
};

const ReleaseChannelIndicator = ({ releaseChannel, labelClassName, className }: Props) => {
    return (
        <div
            className={cn(
                "flex gap-1.5 items-center justify-start",
                releaseChannel === VersionReleaseChannel.RELEASE
                    ? "text-blue-500 dark:text-blue-400"
                    : releaseChannel === VersionReleaseChannel.BETA
                      ? "text-orange-600 dark:text-orange-400"
                      : releaseChannel === VersionReleaseChannel.ALPHA
                        ? "text-danger-foreground"
                        : "",
                className,
            )}
        >
            <div className="w-2 h-2 rounded-full bg-current" />
            <span className={cn("text-current leading-none font-semibold", labelClassName)}>
                {CapitalizeAndFormatString(releaseChannel)}
            </span>
        </div>
    );
};

export default ReleaseChannelIndicator;

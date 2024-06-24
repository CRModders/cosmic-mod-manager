import { cn } from "@/lib/utils";
import { CapitalizeAndFormatString } from "@root/lib/utils";
import { ReleaseChannels } from "@root/types";

type Props = {
    release_channel: ReleaseChannels | string;
    labelClassName?: string;
};

const ReleaseChannelIndicator = ({ release_channel, labelClassName }: Props) => {
    return (
        <div
            className={cn(
                "flex gap-2 items-center justify-start",
                release_channel === ReleaseChannels.RELEASE
                    ? " text-blue-600 dark:text-blue-400"
                    : release_channel === ReleaseChannels.BETA
                        ? "text-orange-500 dark:text-orange-400"
                        : release_channel === ReleaseChannels.ALPHA
                            ? " text-danger-text"
                            : "",
            )}
        >
            <div className="w-2 h-2 rounded-full bg-current" />
            <span className={cn("text-current leading-none font-semibold", labelClassName)}>
                {CapitalizeAndFormatString(release_channel)}
            </span>
        </div>
    );
};

export default ReleaseChannelIndicator;

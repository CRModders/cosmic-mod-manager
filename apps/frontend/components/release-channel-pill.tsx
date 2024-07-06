import { cn } from "@/lib/utils";
import { CapitalizeAndFormatString } from "@root/lib/utils";
import { ReleaseChannels } from "@root/types";

type Props = {
    release_channel: ReleaseChannels | string;
    labelClassName?: string;
    className?: string;
};

const ReleaseChannelIndicator = ({ release_channel, labelClassName, className }: Props) => {
    return (
        <div
            className={cn(
                "flex gap-1.5 items-center justify-start brightness-[80%] dark:brightness-[95%]",
                release_channel === ReleaseChannels.RELEASE
                    ? "text-blue-500 dark:text-blue-400"
                    : release_channel === ReleaseChannels.BETA
                      ? "text-orange-500 dark:text-orange-400"
                      : release_channel === ReleaseChannels.ALPHA
                        ? "text-danger-text"
                        : "",
                className,
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

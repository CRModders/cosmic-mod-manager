import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatDate, timeSince } from "@root/lib/utils";
import { time_past_phrases } from "@root/types";

export const DotSeparator = ({ className }: { className?: string }) => {
	return (
		<span className="flex items-center justify-center select-none">
			&nbsp;&nbsp;
			<span className={cn("w-1 h-1 rounded bg-foreground/50", className)}> </span>
			&nbsp;&nbsp;
		</span>
	);
};

type Props = {
	lastUsed: Date;
	createdOn: Date;
};

const Timestamp = ({ lastUsed, createdOn }: Props) => {
	const timestamp_template = "${month} ${day}, ${year} at ${hours}:${minutes} ${amPm}";
	let formattedLastUsedDate = null;

	try {
		formattedLastUsedDate = formatDate(
			lastUsed,
			timestamp_template,
			lastUsed.getFullYear(),
			lastUsed.getMonth(),
			lastUsed.getDate(),
			lastUsed.getHours(),
			lastUsed.getMinutes(),
		);
	} catch (error) {
		formattedLastUsedDate = null;
		console.error(error);
	}

	let formattedCreatedOnDate = null;

	try {
		formattedCreatedOnDate = formatDate(
			createdOn,
			timestamp_template,
			createdOn.getFullYear(),
			createdOn.getMonth(),
			createdOn.getDate(),
			createdOn.getHours(),
			createdOn.getMinutes(),
		);
	} catch (error) {
		formattedCreatedOnDate = null;
		console.error(error);
	}

	return (
		<>
			{formattedLastUsedDate && (
				<div className="text-sm sm:text-base">
					Last used{" "}
					<TooltipWrapper text={formattedLastUsedDate}>
						<span>{timeSince(lastUsed, time_past_phrases)}</span>
					</TooltipWrapper>
				</div>
			)}
			{formattedCreatedOnDate && formattedLastUsedDate && <DotSeparator />}
			{formattedCreatedOnDate && (
				<div className="text-sm sm:text-base">
					Created{" "}
					<TooltipWrapper text={formattedCreatedOnDate}>
						<span>{timeSince(createdOn, time_past_phrases)}</span>
					</TooltipWrapper>
				</div>
			)}
		</>
	);
};

export default Timestamp;

export const TooltipWrapper = ({
	children,
	text,
	className,
	asChild,
}: {
	children: React.ReactNode;
	text: string;
	className?: string;
	asChild?: boolean;
}) => {
	return (
		<TooltipProvider delayDuration={400}>
			<Tooltip>
				<TooltipTrigger asChild={asChild} className={className}>
					{children}
				</TooltipTrigger>
				<TooltipContent>
					<span className="text-sm sm:text-base">{text}</span>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

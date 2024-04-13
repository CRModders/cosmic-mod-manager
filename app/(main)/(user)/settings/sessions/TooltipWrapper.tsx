import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const TooltipWrapper = ({
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

export default TooltipWrapper;

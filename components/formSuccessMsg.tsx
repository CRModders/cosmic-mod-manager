import { cn } from "@/lib/utils";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import React from "react";

type Props = {
	msg: string;
	className?: string;
	iconClassName?: string;
};

const FormSuccessMsg = ({ msg, className, iconClassName }: Props) => {
	return (
		<div
			className={cn(
				"w-full flex items-center justify-start p-2 gap-2 text-success dark:text-success_dark bg-success/10 dark:bg-success_dark/10 rounded-lg",
				className,
			)}
		>
			<CheckCircledIcon className={cn("pl-1 w-6 h-5 shrink-0", iconClassName)} />
			<p>{msg}</p>
		</div>
	);
};

export default FormSuccessMsg;

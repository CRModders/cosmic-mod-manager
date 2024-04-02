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
				"w-full flex items-center justify-start p-2 gap-2 text-emerald-600 dark:text-emerald-500 bg-emerald-600/10 dark:bg-emerald-500/5 rounded-lg",
				className,
			)}
		>
			<CheckCircledIcon className={cn("w-4 h-4", iconClassName)} />
			<p>{msg}</p>
		</div>
	);
};

export default FormSuccessMsg;

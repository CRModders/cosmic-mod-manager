import { cn } from "@/lib/utils";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";

type Props = {
	msg: string;
	className?: string;
	iconClassName?: string;
};

const FormErrorMsg = ({ msg, className, iconClassName }: Props) => {
	return (
		<div
			className={cn(
				"w-full flex items-center justify-start px-4 py-2 gap-2 text-rose-500 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-400/5 rounded-lg",
				className,
			)}
		>
			<ExclamationTriangleIcon className={cn("w-4 h-4", iconClassName)} />
			<p>{msg}</p>
		</div>
	);
};

export default FormErrorMsg;

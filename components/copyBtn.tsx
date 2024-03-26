"use client";

import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type Props = {
	text: string | number;
	className?: string;
	successMessage?: string;
};
let timeoutRef: NodeJS.Timeout = null;

const CopyBtn = ({ text, className, successMessage }: Props) => {
	const [showTickIcon, setShowTickIcon] = useState(false);
	const { toast } = useToast();
	const copyText = () => {
		try {
			clearTimeout(timeoutRef);
			navigator.clipboard.writeText(text.toString());
			setShowTickIcon(true);
			timeoutRef = setTimeout(() => {
				setShowTickIcon(false);
			}, 2_000);
		} catch (error) {
			toast({
				title: "Couldn't copy to clipboard !",
				description: "Try again or copy the text manually",
			});
		}
	};

	return (
		<Button
			size="icon"
			variant="ghost"
			className="flex items-center justify-center w-6 h-6"
			onClick={copyText}
		>
			{showTickIcon ? (
				<CheckIcon
					className={cn(
						"w-5 h-5 text-emerald-600 dark:text-emerald-500",
						className,
					)}
				/>
			) : (
				<CopyIcon
					className={cn(
						"w-3 h-3 text-foreground/50 dark:text-foreground_dark/50",
						className,
					)}
				/>
			)}
		</Button>
	);
};

export default CopyBtn;

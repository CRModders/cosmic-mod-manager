"use client";

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type Props = {
	text: string | number;
	className?: string;
	iconClassName?: string;
	successMessage?: string;
};
let timeoutRef: NodeJS.Timeout = null;

const CopyBtn = ({ text, className, iconClassName, successMessage }: Props) => {
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
			aria-label="Copy"
			className={cn("shrink-0 flex items-center justify-center w-6 h-6", className)}
			onClick={copyText}
		>
			{showTickIcon ? (
				<CheckIcon className={cn("w-5 h-5 text-emerald-600 dark:text-emerald-500", iconClassName)} />
			) : (
				<CopyIcon className={cn("w-3 h-3 text-foreground/50 dark:text-foreground_dark/50", iconClassName)} />
			)}
		</Button>
	);
};

export default CopyBtn;

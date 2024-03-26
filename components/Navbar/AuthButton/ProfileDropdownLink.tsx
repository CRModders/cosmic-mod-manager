import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
	icon: React.JSX.Element;
	label: string;
	className?: string;
	onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
	tabIndex?: number;
};

const ProfileDropdownLink = ({ icon, label, className, ...props }: Props) => {
	return (
		<Button
			variant="ghost"
			className={cn(
				"w-full text-lg flex items-center justify-start gap-2 text-foreground_muted dark:text-foreground_muted_dark",
				className,
			)}
			size="md"
			{...props}
		>
			<span className="w-6 flex items-center justify-start">{icon}</span>
			<p>{label}</p>
		</Button>
	);
};

export default ProfileDropdownLink;

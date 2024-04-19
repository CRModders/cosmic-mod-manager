//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import type React from "react";
import { cn } from "@/lib/utils";
import "@/app/globals.css";
import { Button } from "@/components/ui/button";

type Props = {
	icon: React.JSX.Element;
	label: string;
	className?: string;
	onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
	tabIndex?: number;
	disabled?: boolean;
};

const ProfileDropdownLink = ({ icon, label, className, ...props }: Props) => {
	return (
		<Button
			aria-label={label}
			type="button"
			variant="ghost"
			size="md"
			className={cn(
				"group w-full text-lg flex items-center justify-start gap-2 navlink_text hover:bg-transparent dark:hover:bg-transparent",
				className,
			)}
			{...props}
		>
			<span className="w-6 flex items-center justify-start link_icon">{icon}</span>
			<p>{label}</p>
		</Button>
	);
};

export default ProfileDropdownLink;

"use client";

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { Button } from "@/components/ui/button";
import { TrashIcon } from "@/components/Icons";
import { useToast } from "@/components/ui/use-toast";
import React from "react";

const DeleteAccountSection = () => {
	const { toast } = useToast();

	return (
		<div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-x-16 gap-y-2">
			<div className="flex shrink flex-col items-start justify-center">
				<p className="text-foreground_muted/80 dark:text-foreground_muted_dark/80 shrink">
					Once you delete your account, there is no going back. Deleting your
					account will remove all of your data, except your projects, from our
					servers.
				</p>
			</div>

			<Button
				className="flex items-center justify-center gap-2 bg-primary_accent dark:bg-primary_accent_dark hover:bg-primary_accent/90 hover:dark:bg-primary_accent_dark/90 text-foreground_dark hover:text-foreground_dark"
				variant="outline"
				onClick={() => {
					toast({ title: "// Not implemented yet" });
				}}
			>
				<TrashIcon size="1rem" />
				Delete account
			</Button>
		</div>
	);
};

export default DeleteAccountSection;

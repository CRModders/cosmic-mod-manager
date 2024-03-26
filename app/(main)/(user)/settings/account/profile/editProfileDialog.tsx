
//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>. "use client";

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Pencil1Icon } from "@radix-ui/react-icons";
import React, { useState } from "react";

import EditProfileInfoForm from "./EditForm";
import { Button } from "@/components/ui/button";

type Props = {
	name: string;
	username: string;
};

const EditProfileDialog = ({ name, username }: Props) => {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button
					className="flex gap-2 items-center justify-center"
					variant="outline"
				>
					<Pencil1Icon className="w-4 h-4" />
					<p className="text-lg pr-1">Edit</p>
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit profile</DialogTitle>
				</DialogHeader>

				<div className="w-full flex flex-col items-center justify-center py-4">
					<EditProfileInfoForm
						name={name}
						username={username}
						dialogOpen={dialogOpen}
						setDialogOpen={setDialogOpen}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default EditProfileDialog;

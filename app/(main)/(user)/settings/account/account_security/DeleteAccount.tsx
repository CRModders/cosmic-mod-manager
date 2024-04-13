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
import React, { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { initiateDeleteAccountAction } from "@/app/api/actions/user";
import { Spinner } from "@/components/ui/spinner";
import FormErrorMsg from "@/components/formErrorMsg";

const DeleteAccountSection = () => {
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleDeleteClick = async () => {
		setFormError(null);
		if (loading) return;
		setLoading(true);

		const res = await initiateDeleteAccountAction();

		setLoading(false);

		if (res?.success === true) {
			setDialogOpen(false);
			toast({
				title: res?.message || "Confirmation email sent.",
				description: "A confirmation email has been sent to your email addres. Confirm there to delete your account.",
			});

			return;
		}

		setFormError(res?.message);
	};

	return (
		<div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-x-16 gap-y-2">
			<div className="flex shrink flex-col items-start justify-center">
				<p className="text-foreground_muted/80 dark:text-foreground_muted_dark/80 shrink">
					Once you delete your account, there is no going back. Deleting your account will remove all of your data,
					except your projects, from our servers.
				</p>
			</div>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogTrigger asChild>
					<Button className="flex items-center justify-center gap-2 bg-danger dark:bg-danger_dark hover:bg-danger/90 hover:dark:bg-danger_dark/90 text-foreground_dark hover:text-foreground_dark dark:text-foreground_dark">
						<TrashIcon size="1rem" />
						Delete account
					</Button>
				</DialogTrigger>

				<DialogContent>
					<div className="w-full flex flex-col relative gap-4">
						<DialogHeader>
							<DialogTitle className="font-normal">Delete Account</DialogTitle>
						</DialogHeader>
						<div className="w-full flex flex-col gap-2 items-center justify-center">
							<p className="w-full text-left">Are you sure that you want to delete your account.</p>
							{formError && <FormErrorMsg msg={formError} />}
						</div>

						<DialogFooter className="w-full flex flex-row flex-wrap items-center justify-end gap-2">
							<DialogClose asChild>
								<Button variant="ghost" size="md">
									Cancel
								</Button>
							</DialogClose>

							<Button
								className="flex items-center justify-center gap-2 bg-danger dark:bg-danger_dark hover:bg-danger/90 hover:dark:bg-danger_dark/90 text-foreground_dark hover:text-foreground_dark dark:text-foreground_dark"
								onClick={handleDeleteClick}
							>
								<TrashIcon size="1rem" />
								Delete
							</Button>
						</DialogFooter>

						{loading === true && (
							<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full rounded-xl flex items-center justify-center">
								<div className="w-full h-full flex items-center justify-center relative rounded-xl">
									<div className="w-full h-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-background dark:bg-background_dark opacity-60" />
									<Spinner size="1.5rem" />
								</div>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default DeleteAccountSection;

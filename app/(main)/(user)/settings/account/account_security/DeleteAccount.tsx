"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TrashIcon } from "@radix-ui/react-icons";
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
				<TrashIcon className="w-4 h-4" />
				Delete account
			</Button>
		</div>
	);
};

export default DeleteAccountSection;

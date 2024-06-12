import { TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormErrorMessage } from "@/components/ui/form-message";
import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import useFetch from "@/src/hooks/fetch";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";

const DeleteAccountSection = () => {
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleDeleteClick = async () => {
		setFormError(null);
		if (loading) return;
		setLoading(true);

		const response = await useFetch("/api/user/send-account-deletion-email", {
			method: "POST",
		});
		setLoading(false);
		const res = await response.json();

		if (res?.success === true) {
			setDialogOpen(false);
			toast({
				title: res?.message,
				description: "A confirmation email has been sent to your email address. Confirm there to delete your account.",
			});
			return;
		}

		setFormError(res?.message);
	};

	return (
		<div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-x-16 gap-y-2">
			<div className="flex shrink flex-col items-start justify-center">
				<p className="text-base text-foreground-muted shrink">
					Once you delete your account, there is no going back. Deleting your account will remove all of your data,
					except your projects, from our servers.
				</p>
			</div>
			<Dialog
				open={dialogOpen}
				onOpenChange={(open: boolean) => {
					if (open === false) {
						setFormError("");
					}
					setDialogOpen(open);
				}}
			>
				<DialogTrigger asChild>
					<Button className="gap-2" variant={"destructive"}>
						<TrashIcon size="1rem" />
						Delete account
					</Button>
				</DialogTrigger>

				<DialogContent>
					<div className="w-full flex flex-col relative gap-4">
						<DialogHeader>
							<DialogTitle className="font-semibold text-foreground-muted">Delete account</DialogTitle>
						</DialogHeader>
						<div className="w-full flex flex-col gap-2 items-center justify-center">
							<p className="w-full text-left">Are you sure you want to delete your account?</p>
							{formError && <FormErrorMessage text={formError} />}
						</div>

						<DialogFooter className="w-full flex flex-row flex-wrap items-center justify-end gap-2 mt-4">
							<DialogClose asChild>
								<Button variant="secondary">Cancel</Button>
							</DialogClose>

							<Button className="gap-2" onClick={handleDeleteClick} variant={"destructive"}>
								<TrashIcon size="1rem" />
								Delete
							</Button>
						</DialogFooter>

						{loading === true && <AbsolutePositionedSpinner />}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default DeleteAccountSection;

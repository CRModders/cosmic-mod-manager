import { Button } from "@/components/ui/button";
import { GearIcon } from "@radix-ui/react-icons";
import React from "react";
import ProvidersList from "./ProvidersList";
import { getLinkedProvidersList } from "@/app/api/actions/user";

type Props = {
	id: string;
};

const ManageProviders = async ({ id }: Props) => {
	const linkedProviders = await getLinkedProvidersList();

	return (
		<div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-x-4 gap-y-2">
			<div className="flex shrink flex-col items-start justify-center">
				<p className="text-xl font-semibold text-foreground_muted dark:text-foreground_muted_dark">
					Manage authentication providers
				</p>
				<p className="text-foreground_muted/80 dark:text-foreground_muted_dark/80 shrink">
					Add or remove sign-on methods from your account, including GitHub,
					GitLab, Discord, and Google.
				</p>
			</div>

			<ProvidersList id={id} linkedProviders={linkedProviders}>
				<Button
					className="flex grow items-center justify-center gap-2"
					variant="outline"
				>
					<GearIcon className="w-4 h-4" />
					Manage providers
				</Button>
			</ProvidersList>
		</div>
	);
};

export default ManageProviders;

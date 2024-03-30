"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
	ArrowTopRightIcon,
	CheckCircledIcon,
	ExclamationTriangleIcon,
	TrashIcon,
} from "@radix-ui/react-icons";
import { authProvidersList } from "@/app/(auth)/authproviders";
import { unlinkAuthProvider } from "@/app/api/actions/user";
import { signIn } from "next-auth/react";

type Props = {
	id: string;
	linkedProviders: string[];
	children: React.ReactNode;
};

const ProvidersList = ({ id, linkedProviders, children }: Props) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const AddProvider = async (name: string) => {
		if (loading) return;
		setLoading(true);

		const result = await signIn(name, {
			redirect: true,
			callbackUrl: "/",
		});

		setLoading(false);
	};

	const RemoveProvider = async (name: string) => {
		if (loading) return;
		setLoading(true);
		const result = await unlinkAuthProvider(name);

		if (result?.success !== true) {
			setFormError(result?.message || "Something went wrong");
		}

		setSuccessMessage(result?.message);

		setLoading(false);
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Authentication providers</DialogTitle>
				</DialogHeader>

				<div className="w-full flex flex-col items-center justify-center py-4 gap-4">
					<div className="w-full flex flex-col items-center justify-center gap-2">
						{authProvidersList?.map((provider) => {
							return (
								<div
									key={provider.name}
									className="w-full flex items-center justify-between px-2 py-2 border-b border-shadow dark:border-shadow_dark"
								>
									<div className="flex items-center justify-center">
										<i className="w-8 flex items-center justify-start">
											{provider.icon}
										</i>
										<p className="text-foreground dark:text-foreground_dark">
											{provider.name}
										</p>
									</div>

									{linkedProviders.includes(provider.name.toLowerCase()) ? (
										<Button
											type="submit"
											size="md"
											className="py-4 gap-2 flex items-center justify-center"
											variant="secondary"
											onClick={() => {
												RemoveProvider(provider.name.toLowerCase());
											}}
										>
											<TrashIcon className="w-4 h-4" />
											<p>Remove</p>
										</Button>
									) : (
										<Button
											type="submit"
											size="md"
											className="py-4 gap-2 flex items-center justify-center"
											variant="secondary"
											onClick={() => {
												AddProvider(provider.name.toLowerCase());
											}}
										>
											<ArrowTopRightIcon className="w-4 h-4" />
											<p className="text-foreground dark:text-foreground_dark">
												Add
											</p>
										</Button>
									)}
								</div>
							);
						})}
					</div>

					{formError ? (
						<div className="w-full flex items-center justify-start px-2 py-2 gap-2 text-rose-600 dark:text-rose-500 bg-primary_accent bg-opacity-10 rounded-lg">
							<ExclamationTriangleIcon className="pl-2 w-6 h-6" />
							<p>{formError}</p>
						</div>
					) : (
						successMessage && (
							<div className="w-full flex items-center justify-start px-2 py-2 gap-2 text-emerald-700 dark:text-emerald-500 bg-emerald-500 bg-opacity-15 dark:bg-opacity-10 rounded-lg">
								<CheckCircledIcon className="pl-2 w-6 h-6" />
								<p>{successMessage}</p>
							</div>
						)
					)}

					{loading === true && (
						<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full rounded-xl flex items-center justify-center">
							<div className="w-full h-full flex items-center justify-center relative rounded-xl">
								<div className="w-full h-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-background dark:bg-background_dark opacity-60" />
								<Spinner size="2.4rem" />
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ProvidersList;

"use client";

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

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
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { authProvidersList } from "@/app/(auth)/authproviders";
import { unlinkAuthProvider } from "@/app/api/actions/user";
import { signIn } from "next-auth/react";
import FormErrorMsg from "@/components/formErrorMsg";
import FormSuccessMsg from "@/components/formSuccessMsg";
import { TrashIcon } from "@/components/Icons";

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
											<TrashIcon
												size="1rem"
												className="text-foreground/80 dark:text-foreground_dark/80"
											/>
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
						<FormErrorMsg msg={formError} />
					) : (
						successMessage && <FormSuccessMsg msg={successMessage} />
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

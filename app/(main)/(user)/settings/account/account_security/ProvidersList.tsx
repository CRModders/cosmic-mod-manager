"use client";

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { linkAuthProvider, unlinkAuthProvider } from "@/app/api/actions/user";
import FormErrorMsg from "@/components/formErrorMsg";
import FormSuccessMsg from "@/components/formSuccessMsg";
import { TrashIcon } from "@/components/Icons";
import { Account } from "@prisma/client";
import authProvidersList from "@/app/(auth)/avaiableAuthProviders";
import { locale_content_type } from "@/public/locales/interface";

type Props = {
	id: string;
	linkedProviders: Partial<Account>[];
	children: React.ReactNode;
	locale: locale_content_type;
};

const ProviderEmailInfoTooltip = ({ email, provider, provider_email_tooltip }: { email: string; provider?: string; provider_email_tooltip: string }) => {
	return (
		<TooltipProvider delayDuration={100}>
			<Tooltip>
				<TooltipTrigger className="text-sm sm:text-base flex items-center justify-center">{email}</TooltipTrigger>
				<TooltipContent>
					<p className="text-sm sm:text-base">{provider_email_tooltip.replace("${0}", provider ? provider : "provider")}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

const ProvidersList = ({ id, linkedProviders, children, locale }: Props) => {
	const linkedProvidersNameList = linkedProviders.map((linkedProvoder) => linkedProvoder.provider);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const AddProvider = async (name: string) => {
		if (loading) return;
		setLoading(true);

		await linkAuthProvider(name);

		setLoading(false);
	};

	const RemoveProvider = async (name: string) => {
		if (loading) return;
		setLoading(true);
		const result = await unlinkAuthProvider(name);

		if (result?.success !== true) {
			setFormError(result?.message);
		}

		setSuccessMessage(result?.message);

		setLoading(false);
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>

			<DialogContent autoFocus={false}>
				<DialogHeader>
					<DialogTitle className="font-normal">{locale.settings_page.account_section.auth_providers_label}</DialogTitle>
				</DialogHeader>

				<div className="w-full flex flex-col items-center justify-center py-4 gap-4">
					<div className="w-full flex flex-col items-center justify-center gap-2">
						<Accordion type="single" collapsible className="w-full">
							{authProvidersList?.map((provider) => {
								return (
									<AccordionItem value={provider.name} key={provider.name} className=" border-foreground/25 dark:border-foreground_dark/25">
										<AccordionTrigger>
											<div className="w-full flex items-center justify-start mb-1">
												<i className="w-8 flex items-center justify-start">{provider.icon}</i>
												<p className="text-base text-foreground dark:text-foreground_dark">{provider.name}</p>
											</div>
										</AccordionTrigger>
										<AccordionContent>
											<div className="w-full flex flex-wrap items-center justify-between px-2">
												{linkedProvidersNameList.includes(provider.name.toLowerCase()) ? (
													<>
														{linkedProviders.map((linkedProvider) => {
															if (linkedProvider.provider === provider.name.toLowerCase() && linkedProvider?.providerAccountEmail) {
																return (
																	<ProviderEmailInfoTooltip
																		key={provider?.name}
																		email={linkedProvider?.providerAccountEmail}
																		provider={linkedProvider?.provider}
																		provider_email_tooltip={locale.settings_page.account_section.provider_email_tooltip}
																	/>
																);
															}

															return null;
														})}

														<Button
															type="submit"
															size="md"
															className="py-4 gap-2 flex items-center justify-center"
															variant="secondary"
															aria-label={locale.globals.remove}
															onClick={() => {
																RemoveProvider(provider.name.toLowerCase());
															}}
														>
															<TrashIcon size="1rem" className="text-foreground/80 dark:text-foreground_dark/80" />
															<p>{locale.globals.remove}</p>
														</Button>
													</>
												) : (
													<>
														<p className="text-base text-foreground/90 dark:text-foreground_dark/90" key={provider?.name}>
															{locale.settings_page.account_section.link_a_provier.replace("${0}", provider?.name)}
														</p>

														<Button
															type="submit"
															size="md"
															className="py-4 gap-2 flex items-center justify-center"
															variant="secondary"
															aria-label={locale.globals.link}
															onClick={() => {
																AddProvider(provider.name.toLowerCase());
															}}
														>
															<ArrowTopRightIcon className="w-4 h-4" />
															<p className="text-foreground dark:text-foreground_dark">{locale.globals.link}</p>
														</Button>
													</>
												)}
											</div>
										</AccordionContent>
									</AccordionItem>
								);
							})}
						</Accordion>
					</div>

					{formError ? <FormErrorMsg msg={formError} /> : successMessage && <FormSuccessMsg msg={successMessage} />}

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
	);
};

export default ProvidersList;

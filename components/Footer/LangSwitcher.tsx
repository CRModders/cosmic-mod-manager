"use client";

import React, { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { setLanguagePreference } from "@/app/api/actions/lang";
import { Spinner } from "../ui/spinner";
import { GlobeIcon } from "../Icons";
import type { locale_content_type, locale_meta } from "@/public/locales/interface";
import type { availableLocalesListData } from "@/lib/lang";
import { DotSeparator } from "@/app/(main)/(user)/settings/sessions/Timestamp";

type Props = {
	locale?: {
		meta: locale_meta;
		content: locale_content_type;
	};
	availableLocales: availableLocalesListData[];
};

const LangSwitcher = ({ locale, availableLocales }: Props) => {
	const [loading, setLoading] = useState(false);
	const [currValue, setCurrValue] = useState<string>(`${locale.meta.language.code}-${locale.meta.region.code}`);
	const currentLang = `${locale.meta.language.locale_name} (${locale.meta.region.display_name})`;

	const setPref = async (value: string) => {
		if (loading) return;
		setLoading(true);
		const result = await setLanguagePreference(value);

		// Simulating an artificial delay for about 1.5 seconds to represent the time it takes for the revalidation, There is no direct way to wait for this as it's a non-blocking action
		setTimeout(() => {
			if (result === true) {
				setCurrValue(value);
			}
			setLoading(false);
		}, 1500);
	};

	return (
		<div className="flex relative items-center justify-center">
			<Select
				onValueChange={(value: string) => {
					setPref(value);
					setCurrValue(value);
				}}
				value={currValue}
			>
				<SelectTrigger
					tabIndex={loading ? -1 : 0}
					aria-label={currValue}
					className="h-10 bg-background dark:bg-background_dark hover:bg-transparent dark:hover:bg-transparent px-4 min-w-36 rounded-full text-base dark:shadow-blue-500/0 dark:border-zinc-600"
				>
					<div className="flex items-center justify-center gap-2 pr-2">
						<GlobeIcon size="1.25rem" />
						<SelectValue className="flex items-center justify-start" placeholder={<p>{currentLang}</p>} />
					</div>
				</SelectTrigger>

				<SelectContent>
					<SelectGroup>
						{availableLocales?.map((availableLocale) => {
							return (
								<SelectItem
									key={availableLocale.code}
									value={availableLocale.code}
									aria-label={`${availableLocale.locale_name} ${availableLocale.region}`}
								>
									<p className="w-full flex items-end justify-start gap-0.5 align-bottom">
										<span className="flex items-end justify-center align-bottom">{availableLocale.locale_name}</span>
										<DotSeparator className="w-[0.2rem] h-[0.2rem] bg-foreground/30 dark:bg-foreground_dark/30" />
										{availableLocale.region && (
											<span className="flex items-end justify-center align-bottom text-foreground/90 dark:text-foreground_dark/80">
												{availableLocale.region}
											</span>
										)}
									</p>
								</SelectItem>
							);
						})}
					</SelectGroup>
				</SelectContent>
			</Select>
			{loading && (
				<div className="w-full h-full rounded-full flex items-center justify-center absolute top-0 left-0 bg-background_hover/75 dark:bg-background_hover_dark/75">
					<Spinner size="1.5rem" />
				</div>
			)}
		</div>
	);
};

export default LangSwitcher;

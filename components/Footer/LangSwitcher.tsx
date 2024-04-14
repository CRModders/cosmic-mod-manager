"use client";

import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { setLanguagePreference } from "@/app/api/actions/lang";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import { GlobeIcon } from "../Icons";
import { locale_content_type, locale_meta } from "@/public/locales/interface";
import { availableLocalesListData } from "@/lib/lang";

type Props = {
	locale?: {
		meta: locale_meta;
		content: locale_content_type;
	};
	availableLocales: availableLocalesListData[];
};

const LangSwitcher = ({ locale, availableLocales }: Props) => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const currentLang = `${locale.meta.language.locale_name} (${locale.meta.region.display_name})`;

	const setPref = async (value: string) => {
		if (loading) return;
		setLoading(true);
		const result = await setLanguagePreference(value);
		if (result === true) {
			router.refresh();
			router.push(window.location.href.replace(window.location.origin, ""), { scroll: false });
		}
		setLoading(false);
	};

	return (
		<div className="flex relative items-center justify-center">
			<Select onValueChange={setPref}>
				<SelectTrigger
					tabIndex={loading ? -1 : 0}
					className="h-10 bg-background dark:bg-background_dark hover:bg-transparent dark:hover:bg-transparent px-4 min-w-36 rounded-full text-base dark:shadow-blue-500/0 dark:border-zinc-600"
				>
					<div className="flex items-center justify-center gap-2 pr-2">
						<GlobeIcon size="1.25rem" />
						<SelectValue placeholder={<p>{currentLang}</p>} />
					</div>
				</SelectTrigger>

				<SelectContent>
					{availableLocales?.map((availableLocale) => {
						return (
							<SelectItem
								key={availableLocale.code}
								value={availableLocale.code}
							>{`${availableLocale.locale_name} (${availableLocale.region})`}</SelectItem>
						);
					})}
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

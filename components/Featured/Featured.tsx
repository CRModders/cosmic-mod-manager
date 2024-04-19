//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import React from "react";
import type { FeaturedSectionContentData } from "@/types";
import { getFeaturedSectionContent } from "@/app/api/actions/featuredSection";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import styles from "./styles.module.css";
import { Button } from "@/components/ui/button";
import type { featured_section_locale } from "@/public/locales/interface";

type Props = {
	featuredSectionLocale: featured_section_locale;
};

const FeaturedSection = async ({ featuredSectionLocale }: Props) => {
	const FeaturedSectionContent: FeaturedSectionContentData = (await getFeaturedSectionContent())
		.featuredSectionContentData;

	if (!FeaturedSectionContent?.length) {
		return (
			<div>
				<p>Error loading featured section.</p>
				<form
					action={async () => {
						"use server";
						revalidatePath("/");
					}}
					name="Retry"
				>
					<Button type="submit" aria-label="Retry">
						Retry
					</Button>
				</form>
			</div>
		);
	}

	return (
		<>
			{FeaturedSectionContent.map((section) => (
				<div className="w-full flex items-start justify-start flex-col px-4 my-2" key={section.categoryName}>
					<h2 className="text-left text-2xl py-2 px-1 underline underline-offset-2">{section.title}</h2>

					<div className={`${styles.showcase_wrapper} w-full grid rounded-lg gap-6`}>
						{section.items.map((item) => {
							return (
								<Link
									className={`${styles.showcase_item} w-full rounded-lg p-3 grid gap-4 border-2 border-background_hover dark:border-background_hover_dark `}
									href={item.url}
									key={item.url}
									aria-label={item.name}
								>
									<div className="h-16 w-16 bg-background_hover dark:bg-background_hover_dark rounded-lg flex items-center justify-center">
										{" "}
									</div>
									<div className="flex flex-col items-start justify-start mr-4 max-h-24">
										<h3 className={`${styles.item_name} text-lg sm:text-xl`}>{item.name}</h3>
										<p className={`${styles.item_description} text-foreground/80 dark:text-foreground_dark/80`}>
											{item.description}
										</p>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			))}
		</>
	);
};

export default FeaturedSection;

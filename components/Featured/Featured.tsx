import React from "react";
import { FeaturedSectionContentData } from "@/types";
import { getFeaturedSectionContent } from "@/app/api/actions/featuredSection";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import styles from "./styles.module.css";
import { Button } from "@/components/ui/button";

const FeaturedSection = async () => {
	const FeaturedSectionContent: FeaturedSectionContentData = (
		await getFeaturedSectionContent()
	).featuredSectionContentData;

	if (!FeaturedSectionContent?.length) {
		return (
			<div>
				<p>Error loading featured section.</p>
				<form
					action={async () => {
						"use server";
						revalidatePath("/");
					}}
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
				<div
					className="w-full flex items-start justify-start flex-col px-4 my-2"
					key={section.categoryName}
				>
					<h2 className="text-left text-2xl py-2 px-1 underline underline-offset-2">
						{section.title}
					</h2>

					<div
						className={`${styles.showcase_wrapper} w-full grid rounded-lg gap-6`}
					>
						{section.items.map((item) => {
							return (
								<Link
									className={`${styles.showcase_item} w-full rounded-lg p-3 grid gap-4 border-2 border-background_hover dark:border-background_hover_dark `}
									href={item.url}
									key={item.url}
								>
									<div className="h-16 w-16 bg-background_hover dark:bg-background_hover_dark rounded-lg flex items-center justify-center">
										{" "}
									</div>
									<div className="flex flex-col items-start justify-start mr-4 max-h-24">
										<h3 className={`${styles.item_name} font-semibold`}>
											{item.name}
										</h3>
										<p
											className={`${styles.item_description} text-foreground_muted dark:text-foreground_muted_dark`}
										>
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

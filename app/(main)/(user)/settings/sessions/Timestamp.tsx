"use client";

import React from "react";
import { formatDate, timeSince } from "@/lib/utils";
import TooltipWrapper from "./TooltipWrapper";
import { locale_content_type } from "@/public/locales/interface";

export const DotSeparator = () => {
	return (
		<span className="flex items-center justify-center select-none">
			&nbsp;&nbsp;
			<span className="w-[0.25rem] h-[0.25rem] rounded bg-foreground/50 dark:bg-foreground_dark/50"> </span>&nbsp;&nbsp;
		</span>
	);
};

type Props = {
	lastUsed: Date;
	createdOn: Date;
	locale: locale_content_type;
};

const Timestamp = ({ lastUsed, createdOn, locale }: Props) => {
	const timestamp_template = locale.settings_page.sessions_section.timestamp_template;
	let formattedLastUsedDate = null;

	try {
		formattedLastUsedDate = formatDate(
			lastUsed,
			timestamp_template,
			lastUsed.getFullYear(),
			lastUsed.getMonth(),
			lastUsed.getDate(),
			lastUsed.getHours(),
			lastUsed.getMinutes(),
		);
	} catch (error) {}

	let formattedCreatedOnDate = null;

	try {
		formattedCreatedOnDate = formatDate(
			createdOn,
			timestamp_template,
			createdOn.getFullYear(),
			createdOn.getMonth(),
			createdOn.getDate(),
			createdOn.getHours(),
			createdOn.getMinutes(),
		);
	} catch (error) {}

	return (
		<>
			{formattedLastUsedDate && (
				<div className="text-sm sm:text-base">
					{locale.settings_page.sessions_section.last_used}{" "}
					<TooltipWrapper text={formattedLastUsedDate}>
						<span>{timeSince(lastUsed, locale.settings_page.sessions_section.time_past_phrases)}</span>
					</TooltipWrapper>
				</div>
			)}
			{formattedCreatedOnDate && formattedLastUsedDate && <DotSeparator />}
			{formattedCreatedOnDate && (
				<div className="text-sm sm:text-base">
					{locale.settings_page.sessions_section.created}{" "}
					<TooltipWrapper text={formattedCreatedOnDate}>
						<span>{timeSince(createdOn, locale.settings_page.sessions_section.time_past_phrases)}</span>
					</TooltipWrapper>
				</div>
			)}
		</>
	);
};

export default Timestamp;

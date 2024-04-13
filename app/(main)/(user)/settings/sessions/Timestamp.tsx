"use client";

import React from "react";
import { formatDate, timeSince } from "@/lib/utils";
import TooltipWrapper from "./TooltipWrapper";

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
};

const Timestamp = ({ lastUsed, createdOn }: Props) => {
	let formattedLastUsedDate = null;

	try {
		formattedLastUsedDate = formatDate(
			lastUsed,
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
					Last used{" "}
					<TooltipWrapper text={formattedLastUsedDate}>
						<span>{timeSince(lastUsed)}</span>
					</TooltipWrapper>
				</div>
			)}
			{formattedCreatedOnDate && formattedLastUsedDate && <DotSeparator />}
			{formattedCreatedOnDate && (
				<div className="text-sm sm:text-base">
					Created{" "}
					<TooltipWrapper text={formattedCreatedOnDate}>
						<span>{timeSince(createdOn)}</span>
					</TooltipWrapper>
				</div>
			)}
		</>
	);
};

export default Timestamp;

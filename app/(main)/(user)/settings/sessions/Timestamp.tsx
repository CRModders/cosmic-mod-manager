"use client";

import React from "react";
import { formatDate, timeSince } from "@/lib/utils";
import TooltipWrapper from "./TooltipWrapper";

export const DotSeparator = () => {
	return (
		<span className="flex items-center justify-center select-none">
			&nbsp;
			<span className="w-[0.25rem] h-[0.25rem] rounded bg-foreground/50 dark:bg-foreground_dark/50">
				{" "}
			</span>
			&nbsp;
		</span>
	);
};

type Props = {
	lastUsed: Date;
	createdOn: Date;
};

const Timestamp = ({ lastUsed, createdOn }: Props) => {
	const lastUsed_year = lastUsed.getFullYear();
	const lastUsed_monthIndex = lastUsed.getMonth();
	const lastUsed_day = lastUsed.getDate();
	const lastUsed_hours = lastUsed.getHours();
	const lastUsed_minutes = lastUsed.getMinutes();

	const createdOn_year = createdOn.getFullYear();
	const createdOn_monthIndex = createdOn.getMonth();
	const createdOn_day = createdOn.getDate();
	const createdOn_hours = createdOn.getHours();
	const createdOn_minutes = createdOn.getMinutes();

	return (
		<>
			<div className="text-sm sm:text-base">
				Last used{" "}
				<TooltipWrapper
					text={formatDate(
						lastUsed,
						lastUsed_year,
						lastUsed_monthIndex,
						lastUsed_day,
						lastUsed_hours,
						lastUsed_minutes,
					)}
				>
					<span>{timeSince(lastUsed)}</span>
				</TooltipWrapper>
			</div>
			<DotSeparator />
			<div className="text-sm sm:text-base">
				Created{" "}
				<TooltipWrapper
					text={formatDate(
						createdOn,
						createdOn_year,
						createdOn_monthIndex,
						createdOn_day,
						createdOn_hours,
						createdOn_minutes,
					)}
				>
					<span>{timeSince(createdOn)}</span>
				</TooltipWrapper>
			</div>
		</>
	);
};

export default Timestamp;

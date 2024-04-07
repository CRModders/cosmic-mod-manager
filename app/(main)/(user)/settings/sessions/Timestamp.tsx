"use client";

import React from "react";
import { formatDate, timeSince } from "@/lib/utils";
import TooltipWrapper from "./TooltipWrapper";

const DotSeparator = () => {
	return (
		<span className=" text-foreground/60 dark:text-foreground_dark/60 text-lg mx-2">
			•
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
	const lastUsed_day = lastUsed.getDay();
	const lastUsed_hours = lastUsed.getHours();
	const lastUsed_minutes = lastUsed.getMinutes();

	const createdOn_year = createdOn.getFullYear();
	const createdOn_monthIndex = createdOn.getMonth();
	const createdOn_day = createdOn.getDay();
	const createdOn_hours = createdOn.getHours();
	const createdOn_minutes = createdOn.getMinutes();

	return (
		<>
			<div className="">
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
					<span className=" text-foreground dark:text-foreground_dark">
						{timeSince(lastUsed)}
					</span>
				</TooltipWrapper>
			</div>
			<DotSeparator />
			<div className="">
				created{" "}
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
					<span className=" text-foreground dark:text-foreground_dark">
						{timeSince(createdOn)}
					</span>
				</TooltipWrapper>
			</div>
		</>
	);
};

export default Timestamp;

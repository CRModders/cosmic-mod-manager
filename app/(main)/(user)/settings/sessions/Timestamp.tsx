import React from "react";
import TooltipWrapper from "./TooltipWrapper";
import { formatDate, timeSince } from "@/lib/utils";

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
	return (
		<>
			<div className="">
				Last used{" "}
				<TooltipWrapper text={formatDate(lastUsed)}>
					<span className=" text-foreground dark:text-foreground_dark">
						{timeSince(lastUsed)}
					</span>
				</TooltipWrapper>
			</div>
			<DotSeparator />
			<div className="">
				created{" "}
				<TooltipWrapper text={formatDate(createdOn)}>
					<span className=" text-foreground dark:text-foreground_dark">
						{timeSince(createdOn)}
					</span>
				</TooltipWrapper>
			</div>
		</>
	);
};

export default Timestamp;

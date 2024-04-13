//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import crypto from "crypto";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { time_past_phrases } from "@/public/locales/interface";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const sleep = async (timeoutMs = 1_000) => {
	const p = new Promise((resolve) => {
		setTimeout(() => {
			resolve("...");
		}, timeoutMs);
	});

	await p;
};

export const shuffleCharacters = (str: string) => {
	const characters = str.split("");
	for (let i = characters.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[characters[i], characters[j]] = [characters[j], characters[i]];
	}
	return characters.join("");
};

type randomCodeGenOptions = {
	length?: number;
	onlyNumbers?: boolean;
};

export const generateRandomCode = ({ length = 32, onlyNumbers = false }: randomCodeGenOptions) => {
	return shuffleCharacters(crypto.randomUUID().replaceAll("-", ""));
};

export const timeSince = (pastTime: Date, timePastPhrases: time_past_phrases): string => {
	try {
		const now = new Date();
		const diff = now.getTime() - pastTime.getTime();
		const seconds = Math.abs(diff / 1000);
		const minutes = Math.round(seconds / 60);
		const hours = Math.round(minutes / 60);
		const days = Math.round(hours / 24);
		const weeks = Math.round(days / 7);
		const months = Math.round(days / 30.4375);
		const years = Math.round(days / 365.25);

		if (seconds < 60) {
			return timePastPhrases.just_now;
		}
		if (minutes < 60) {
			return minutes === 1
				? timePastPhrases.minute_ago.replace("${0}", `${minutes}`)
				: timePastPhrases.minutes_ago.replace("${0}", `${minutes}`);
		}
		if (hours < 24) {
			return hours === 1
				? timePastPhrases.hour_ago.replace("${0}", `${hours}`)
				: timePastPhrases.hours_ago.replace("${0}", `${hours}`);
		}
		if (days < 7) {
			return days === 1
				? timePastPhrases.day_ago.replace("${0}", `${days}`)
				: timePastPhrases.days_ago.replace("${0}", `${days}`);
		}
		if (weeks < 4) {
			return weeks === 1
				? timePastPhrases.week_ago.replace("${0}", `${weeks}`)
				: timePastPhrases.weeks_ago.replace("${0}", `${weeks}`);
		}
		if (months < 12) {
			return months === 1
				? timePastPhrases.month_ago.replace("${0}", `${months}`)
				: timePastPhrases.months_ago.replace("${0}", `${months}`);
		}
		return years === 1
			? timePastPhrases.year_ago.replace("${0}", `${years}`)
			: timePastPhrases.years_ago.replace("${0}", `${years}`);
	} catch (error) {
		console.log({ error });
		return null;
	}
};

export const formatDate = (
	date: Date,
	timestamp_template: string,
	local_year?: number,
	local_monthIndex?: number,
	local_day?: number,
	local_hours?: number,
	local_minutes?: number,
): string => {
	try {
		const monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		const year = local_year || date.getFullYear();
		const monthIndex = local_monthIndex || date.getMonth();
		const month = monthNames[monthIndex];
		const day = local_day || date.getDate();

		const hours = local_hours || date.getHours();
		const minutes = local_minutes || date.getMinutes();
		const amPm = hours >= 12 ? "PM" : "AM";
		const adjustedHours = hours % 12 || 12; // Convert to 12-hour format

		const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();

		return timestamp_template
			.replace("${month}", `${month}`)
			.replace("${day}", `${day}`)
			.replace("${year}", `${year}`)
			.replace("${hours}", `${adjustedHours}`)
			.replace("${minutes}", `${formattedMinutes}`)
			.replace("${amPm}", `${amPm}`);
	} catch (error) {
		console.log({ error });
		return null;
	}
};

import { TypeTimePastPhrases } from "@root/types";

export const timeSince = (pastTime: Date, timePastPhrases: TypeTimePastPhrases): string => {
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
				? timePastPhrases.minute_ago
				: timePastPhrases.minutes_ago.replace("${0}", `${minutes}`);
		}
		if (hours < 24) {
			return hours === 1
				? timePastPhrases.hour_ago
				: timePastPhrases.hours_ago.replace("${0}", `${hours}`);
		}
		if (days < 7) {
			return days === 1
				? timePastPhrases.day_ago
				: timePastPhrases.days_ago.replace("${0}", `${days}`);
		}
		if (weeks < 4) {
			return weeks === 1
				? timePastPhrases.week_ago
				: timePastPhrases.weeks_ago.replace("${0}", `${weeks}`);
		}
		if (months < 12) {
			return months === 1
				? timePastPhrases.month_ago
				: timePastPhrases.months_ago.replace("${0}", `${months}`);
		}
		return years === 1
			? timePastPhrases.year_ago
			: timePastPhrases.years_ago.replace("${0}", `${years}`);
	} catch (error) {
		console.error(error)
		return "";
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
		console.error(error)
		return "";
	}
};
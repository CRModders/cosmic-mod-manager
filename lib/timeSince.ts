function timeSince(pastTime: Date): string {
	const now = new Date();
	const diff = now.getTime() - pastTime.getTime();
	const seconds = Math.abs(diff / 1000);
	const minutes = round(seconds / 60);
	const hours = round(minutes / 60);
	const days = round(hours / 24);
	const weeks = round(days / 7);
	const months = round(days / 30.4375);
	const years = round(days / 365.25);

	if (seconds < 1) {
		return "just now";
	}
	if (minutes < 60) {
		return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
	} else if (hours < 24) {
		return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
	} else if (days < 7) {
		return `${days} ${days === 1 ? "day" : "days"} ago`;
	} else if (weeks < 4) {
		return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
	} else if (months < 12) {
		return `${months} ${months === 1 ? "month" : "months"} ago`;
	} else {
		return `${years} ${years === 1 ? "year" : "years"} ago`;
	}
}

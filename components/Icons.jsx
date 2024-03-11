const ParseSize = ({ size, width, height }) => {
	let IconWidth = size;
	let IconHeight = size;

	if (size) {
		IconWidth = size;
		IconHeight = size;
	}

	if (!IconWidth && !IconHeight) {
		IconWidth = "1.6rem";
		IconHeight = "1.6rem";
	}

	return { IconWidth, IconHeight };
};

export const SunIcon = ({ size, width, height }) => {
	const { IconWidth, IconHeight } = ParseSize({ size, width, height });

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
			aria-hidden="true"
			className="icon sun_icon stroke-[var(--regular-text-light)] dark:stroke-[var(--regular-text-dark)]"
			width={IconWidth}
			height={IconHeight}
		>
			<circle cx="12" cy="12" r="5" />
			<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
		</svg>
	);
};

export const MoonIcon = ({ size, width, height }) => {
	const { IconWidth, IconHeight } = ParseSize({ size, width, height });

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
			aria-hidden="true"
			className="icon moon_icon stroke-[var(--regular-text-light)] dark:stroke-[var(--regular-text-dark)]"
			width={IconWidth}
			height={IconHeight}
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</svg>
	);
};

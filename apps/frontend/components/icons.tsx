import { cn } from "@/lib/utils";
import type { IconSvgProps } from "@/types";
import type React from "react";

const DefaultSvgSize = "1.6rem";

export const SunIcon: React.FC<IconSvgProps> = ({
	size,
	width,
	height,
	...props
}) => {
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
			id="sun_icon"
			width={size || width || DefaultSvgSize}
			height={size || height || DefaultSvgSize}
			{...props}
		>
			<circle cx="12" cy="12" r="5" id="sun_center_circle" />
			<path
				id="sun_corona"
				d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
			/>
		</svg>
	);
};

export const MoonIcon: React.FC<IconSvgProps> = ({
	size,
	width,
	height,
	...props
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			id="moon_icon"
			width={size || width || DefaultSvgSize}
			height={size || height || DefaultSvgSize}
			{...props}
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				id="moon_path"
				d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
			/>
		</svg>
	);
};

export const BrandIcon: React.FC<IconSvgProps> = ({
	size,
	width,
	height,
	className,
	...props
}) => {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			viewBox="0 0 500 500"
			xmlns="http://www.w3.org/2000/svg"
			width={size || width || DefaultSvgSize}
			height={size || height || DefaultSvgSize}
			{...props}
		>
			<defs>
				<linearGradient
					id="gradient-5-0"
					gradientTransform="matrix(0.962532, 0.271168, -1.096881, 3.931027, 128.002136, -339.044042)"
					gradientUnits="userSpaceOnUse"
					x1="252.872"
					x2="252.872"
					y1="91.975"
					y2="178.255"
					href="#gradient-5"
				/>
				<linearGradient id="gradient-5">
					<stop
						className="text-[#f43f5e] dark:text-[#f43f5e]"
						stopColor="currentColor"
						offset="0"
					/>
					<stop
						className="text-[#e11d48] dark:text-[#e11d48]"
						stopColor="currentColor"
						offset="0.468"
					/>
					<stop
						className="text-[#9f1239] dark:text-[#9f1239]"
						stopColor="currentColor"
						offset="1"
					/>
				</linearGradient>
				<linearGradient
					id="gradient-5-1"
					gradientTransform="matrix(0.962739, 0.270435, -2.282381, 8.17965, 644.298995, -2472.513201)"
					gradientUnits="userSpaceOnUse"
					x1="328.973"
					x2="328.973"
					y1="302.535"
					y2="344"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-2"
					gradientTransform="matrix(0.960646, 0.277775, -0.293503, 1.051859, 73.677418, -71.707976)"
					gradientUnits="userSpaceOnUse"
					x1="233.357"
					x2="233.357"
					y1="93.14"
					y2="415.587"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-11"
					gradientTransform="matrix(0.963409, 0.268035, -0.537597, 1.926649, 135.157115, -291.933176)"
					gradientUnits="userSpaceOnUse"
					x1="233.318"
					x2="233.318"
					y1="166.34"
					y2="342.381"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-4"
					gradientTransform="matrix(-0.449788, -0.893135, 3.65307, -1.814132, 32.055191, 9.462093)"
					gradientUnits="userSpaceOnUse"
					x1="0"
					x2="0"
					y1="-128.015"
					y2="128.015"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-12"
					gradientTransform="matrix(-0.454907, -0.89054, 3.65307, -1.814132, -377.567998, 185.347967)"
					gradientUnits="userSpaceOnUse"
					x1="-24.663"
					x2="-24.663"
					y1="-18.955"
					y2="237.075"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-7"
					gradientTransform="matrix(0.96021, 0.279278, -7.409994, 26.555962, 2301.315107, -7707.758434)"
					gradientUnits="userSpaceOnUse"
					x1="-282.158"
					x2="-282.158"
					y1="263.574"
					y2="336.566"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-13"
					gradientTransform="matrix(0.961629, 0.274356, -7.409995, 26.555962, 2301.7157, -7709.147534)"
					gradientUnits="userSpaceOnUse"
					x1="-282.158"
					x2="-282.158"
					y1="263.574"
					y2="336.566"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-6"
					gradientTransform="matrix(0.977806, -0.20951, 5.842082, 26.944352, -487.655141, -2910.651075)"
					gradientUnits="userSpaceOnUse"
					x1="-334.571"
					x2="-334.571"
					y1="72.923"
					y2="145.915"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-14"
					gradientTransform="matrix(0.978768, -0.204975, 5.84208, 26.94435, -487.333321, -2909.133742)"
					gradientUnits="userSpaceOnUse"
					x1="-334.571"
					x2="-334.571"
					y1="72.923"
					y2="145.915"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-5"
					gradientTransform="matrix(0.088226, 0.9961, -27.420322, 2.872861, 5335.545287, -684.349574)"
					gradientUnits="userSpaceOnUse"
					x1="69.583"
					x2="69.583"
					y1="158.847"
					y2="231.839"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-15"
					gradientTransform="matrix(0.099439, 0.995042, -27.420323, 2.872861, 5334.765234, -684.275949)"
					gradientUnits="userSpaceOnUse"
					x1="69.583"
					x2="69.583"
					y1="158.847"
					y2="231.839"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-3"
					gradientTransform="matrix(-0.253872, -0.967236, 26.733549, -6.741244, 65.668075, 122.517085)"
					gradientUnits="userSpaceOnUse"
					x1="-4.671"
					x2="-4.671"
					y1="-29.972"
					y2="43.02"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-16"
					gradientTransform="matrix(-0.240294, -0.970701, 26.733549, -6.741244, 65.731496, 122.500902)"
					gradientUnits="userSpaceOnUse"
					x1="-4.671"
					x2="-4.671"
					y1="-29.972"
					y2="43.02"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-8"
					gradientTransform="matrix(0.95929, 0.282424, -2.614185, 8.774237, -445.685694, 2804.352828)"
					gradientUnits="userSpaceOnUse"
					x1="-934.352"
					x2="-934.352"
					y1="-324.133"
					y2="-234.133"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-17"
					gradientTransform="matrix(0.957983, 0.286826, -2.614182, 8.774245, -446.906173, 2808.468429)"
					gradientUnits="userSpaceOnUse"
					x1="-934.352"
					x2="-934.352"
					y1="-324.133"
					y2="-234.133"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-10"
					gradientTransform="matrix(0.994713, -0.102699, 0.863054, 9.114626, -460.799204, 292.145571)"
					gradientUnits="userSpaceOnUse"
					x1="-3.173"
					x2="-3.173"
					y1="-83.268"
					y2="6.732"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-18"
					gradientTransform="matrix(0.994778, -0.102063, 0.863055, 9.114626, -460.798983, 292.147604)"
					gradientUnits="userSpaceOnUse"
					x1="-3.173"
					x2="-3.173"
					y1="-83.268"
					y2="6.732"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-9"
					gradientTransform="matrix(0.819153, 0.573575, -5.328305, 7.445034, -1979.703151, 2124.598982)"
					gradientUnits="userSpaceOnUse"
					x1="-269.883"
					x2="-269.883"
					y1="-345.192"
					y2="-255.191"
					href="#gradient-5"
				/>
				<linearGradient
					id="gradient-5-19"
					gradientTransform="matrix(0.8047, 0.59368, -5.328303, 7.445036, -1983.602806, 2130.025703)"
					gradientUnits="userSpaceOnUse"
					x1="-269.883"
					x2="-269.883"
					y1="-345.192"
					y2="-255.191"
					href="#gradient-5"
				/>
			</defs>

			<g style={{}}>
				<g>
					<line
						strokeWidth={"22px"}
						fillOpacity={"0"}
						fill="none"
						stroke="url('#gradient-5-0')"
						x1="255.925"
						x2="249.819"
						y1="91.975"
						y2="178.255"
					/>
					<line
						style={{
							transformBox: "fill-box",
							transformOrigin: "50% 50%",
						}}
						strokeWidth={"22px"}
						fillOpacity={"0"}
						fill="none"
						stroke="url('#gradient-5-1')"
						x1="293.846"
						x2="364.1"
						y1="302.535"
						y2="344"
					/>
					<path
						fillRule="evenodd"
						paintOrder="fill"
						filter="none"
						strokeMiterlimit="30"
						strokeLinecap="square"
						strokeWidth="22px"
						fillOpacity="0"
						fill="url('#gradient-5')"
						stroke="url('#gradient-5-2')"
						d="M 321.33 251.114 L 394.352 248.519 C 398.757 372.456 267.344 454.683 157.811 396.53 C 48.277 338.376 42.771 183.456 147.901 117.673 C 209.148 79.349 288.42 86.489 341.834 135.139 L 292.632 189.159"
					/>
					<path
						strokeMiterlimit="4.7"
						fillRule="nonzero"
						strokeDashoffset="-14px"
						paintOrder="fill"
						filter="none"
						strokeWidth="22px"
						fillOpacity="0"
						fill="url('#gradient-5')"
						stroke="url('#gradient-5-11')"
						d="M 292.632 189.159 C 291.066 187.733 289.47 186.377 287.849 185.089 C 286.226 183.802 284.577 182.583 282.903 181.432 C 281.23 180.281 279.532 179.197 277.814 178.181 C 276.095 177.165 274.356 176.215 272.599 175.331 C 270.842 174.448 269.066 173.63 267.275 172.877 C 265.484 172.125 263.679 171.437 261.861 170.813 C 260.043 170.189 258.213 169.629 256.373 169.133 C 254.534 168.636 252.686 168.202 250.831 167.831 C 248.976 167.459 247.115 167.15 245.251 166.901 C 243.386 166.654 241.518 166.467 239.651 166.34 M 222.91 166.801 C 221.067 167.028 219.233 167.311 217.409 167.652 C 215.586 167.992 213.774 168.389 211.977 168.841 C 210.179 169.294 208.396 169.802 206.631 170.364 C 204.866 170.927 203.117 171.544 201.389 172.215 C 199.662 172.885 197.954 173.61 196.27 174.387 C 194.586 175.164 192.924 175.994 191.29 176.876 C 189.655 177.758 188.047 178.691 186.468 179.675 C 184.889 180.659 183.339 181.695 181.822 182.78 C 180.304 183.865 178.819 185 177.368 186.184 C 175.918 187.368 174.503 188.601 173.126 189.881 C 171.749 191.162 170.41 192.491 169.112 193.867 C 167.814 195.243 166.557 196.666 165.344 198.135 C 164.131 199.604 162.962 201.12 161.84 202.68 C 160.718 204.241 159.643 205.846 158.618 207.496 C 157.593 209.146 156.618 210.84 155.695 212.578 C 154.773 214.315 153.903 216.096 153.09 217.919 C 152.276 219.742 151.519 221.608 150.819 223.515 C 150.12 225.422 149.48 227.37 148.901 229.359 C 148.323 231.348 147.806 233.377 147.354 235.446 C 146.902 237.515 146.525 239.575 146.221 241.623 C 145.917 243.672 145.687 245.71 145.526 247.735 C 145.366 249.76 145.277 251.771 145.255 253.768 C 145.234 255.764 145.282 257.745 145.395 259.709 C 145.509 261.673 145.688 263.619 145.932 265.546 C 146.175 267.474 146.482 269.381 146.851 271.268 C 147.22 273.154 147.65 275.019 148.14 276.86 C 148.629 278.701 149.178 280.519 149.783 282.31 C 150.389 284.102 151.052 285.869 151.769 287.608 C 152.486 289.346 153.258 291.057 154.083 292.738 C 154.907 294.419 155.783 296.07 156.71 297.689 C 157.636 299.309 158.613 300.896 159.637 302.449 C 160.662 304.003 161.735 305.521 162.852 307.005 C 163.97 308.488 165.133 309.935 166.339 311.344 C 167.546 312.752 168.795 314.123 170.085 315.454 C 171.376 316.784 172.707 318.074 174.077 319.322 C 175.447 320.569 176.856 321.775 178.3 322.936 C 179.745 324.097 181.226 325.213 182.741 326.283 C 184.256 327.353 185.806 328.376 187.386 329.351 C 188.967 330.326 190.58 331.252 192.222 332.127 C 193.864 333.002 195.535 333.827 197.233 334.599 C 198.932 335.371 200.658 336.09 202.408 336.754 C 204.159 337.419 205.934 338.028 207.732 338.58 C 209.53 339.132 211.35 339.627 213.191 340.063 C 215.032 340.499 216.893 340.876 218.771 341.192 C 220.65 341.507 222.547 341.763 224.459 341.954 C 226.372 342.145 228.3 342.273 230.241 342.336 C 232.183 342.399 234.138 342.397 236.103 342.327 M 254.033 339.82 C 256.045 339.327 258.061 338.76 260.078 338.117 C 261.254 337.743 262.417 337.345 263.568 336.925 C 264.718 336.505 265.856 336.063 266.981 335.599 C 268.105 335.135 269.217 334.648 270.315 334.141 C 271.413 333.634 272.497 333.105 273.567 332.556 C 274.638 332.007 275.695 331.437 276.736 330.847 C 277.778 330.257 278.806 329.648 279.819 329.019 C 280.832 328.39 281.83 327.741 282.813 327.073 C 283.796 326.406 284.763 325.72 285.715 325.015 C 286.667 324.311 287.603 323.588 288.524 322.848 C 289.444 322.108 290.348 321.35 291.235 320.575 C 292.123 319.8 292.994 319.007 293.848 318.199 C 294.702 317.39 295.54 316.566 296.359 315.725 C 297.179 314.884 297.981 314.028 298.766 313.157 C 299.551 312.285 300.318 311.398 301.066 310.496 C 301.815 309.595 302.545 308.679 303.257 307.749 C 303.969 306.819 304.662 305.875 305.336 304.917 C 306.011 303.959 306.666 302.989 307.301 302.004 C 307.937 301.021 308.553 300.025 309.149 299.016 M 316.548 283.043 C 316.934 281.927 317.299 280.802 317.641 279.668 C 317.983 278.534 318.303 277.392 318.6 276.242 C 318.897 275.091 319.171 273.933 319.421 272.767 C 319.672 271.602 319.9 270.428 320.103 269.249 C 320.307 268.068 320.488 266.882 320.643 265.689 C 320.8 264.496 320.931 263.296 321.038 262.092 C 321.146 260.887 321.229 259.677 321.286 258.461 C 321.344 257.246 321.377 256.026 321.384 254.801 C 321.392 253.576 321.374 252.347 321.33 251.114"
					/>
				</g>
				<g
					id="Br-3yOTDEaBP83UML-jtr"
					transform="matrix(0.39896, 0.153146, -0.153146, 0.39896, 412.844489, 359.250677)"
				>
					<g
						id="v_rOhgub5qGj28Tyw4pmT"
						transform="matrix(-0.282771, 0.736641, -0.736641, -0.282771, -480.948371, -77.264627)"
					>
						<path
							strokeWidth="0"
							strokeDasharray="none"
							strokeDashoffset="0"
							strokeLinejoin="miter"
							strokeMiterlimit="4"
							fillRule="nonzero"
							opacity="1"
							fill="url('#gradient-5-4')"
							stroke="url('#gradient-5-12')"
							d="M -15.874 10.672 C -22.868 2.904 -22.24 -9.079 -14.471 -16.074 C -6.703 -23.069 5.28 -22.44 12.274 -14.672 C 19.269 -6.903 18.642 5.079 10.873 12.074 C 3.104 19.069 -8.879 18.441 -15.874 10.672 Z M 0 -128.015 L -25.604 -44.346 L -110.864 -64.008 L -51.206 0 L -110.864 64.008 L -25.603 44.346 L 0 128.015 L 25.603 44.346 L 110.864 64.008 L 51.206 0 L 110.864 -64.008 L 25.603 -44.346 L 0 -128.015 Z"
							strokeLinecap="round"
						/>
						<g
							id="vBL0TyF1yPMQveZycDvgs"
							transform="matrix(-0.347223, -0.385629, 0.385629, -0.347223, -105.223657, -1.790213)"
						>
							<path
								style={{
									transformBox: "fill-box",
									transformOrigin: "50% 50%",
								}}
								strokeWidth="0"
								strokeDasharray="none"
								strokeDashoffset="0"
								strokeLinejoin="miter"
								strokeMiterlimit="4"
								fillRule="nonzero"
								opacity="1"
								fill="url('#gradient-5-7')"
								stroke="url('#gradient-5-13')"
								d="M -282.158 263.574 C -262.012 263.574 -245.662 279.924 -245.662 300.07 C -245.662 320.216 -262.012 336.566 -282.158 336.566 C -302.304 336.566 -318.654 320.216 -318.654 300.07 C -318.654 279.924 -302.304 263.574 -282.158 263.574 Z"
								strokeLinecap="round"
							/>
							<path
								style={{
									transformBox: "fill-box",
									transformOrigin: "50% 50%",
								}}
								strokeWidth="0"
								strokeDasharray="none"
								strokeDashoffset="0"
								strokeLinejoin="miter"
								strokeMiterlimit="4"
								fillRule="nonzero"
								opacity="1"
								fill="url('#gradient-5-6')"
								stroke="url('#gradient-5-14')"
								d="M -334.571 72.923 C -314.425 72.923 -298.075 89.273 -298.075 109.419 C -298.075 129.565 -314.425 145.915 -334.571 145.915 C -354.717 145.915 -371.067 129.565 -371.067 109.419 C -371.067 89.273 -354.717 72.923 -334.571 72.923 Z"
								strokeLinecap="round"
								transform="matrix(0.884382, 0.466763, -0.466763, 0.884382, -0.000001, 0.000008)"
							/>
							<path
								style={{
									transformBox: "fill-box",
									transformOrigin: "50% 50%",
								}}
								strokeWidth="0"
								strokeDasharray="none"
								strokeDashoffset="0"
								strokeLinejoin="miter"
								strokeMiterlimit="4"
								fillRule="nonzero"
								opacity="1"
								fill="url('#gradient-5-5')"
								stroke="url('#gradient-5-15')"
								d="M 69.583 158.847 C 89.729 158.847 106.079 175.197 106.079 195.343 C 106.079 215.489 89.729 231.839 69.583 231.839 C 49.437 231.839 33.087 215.489 33.087 195.343 C 33.087 175.197 49.437 158.847 69.583 158.847 Z"
								strokeLinecap="round"
								transform="matrix(0.36767, -0.929956, 0.929956, 0.36767, -0.000018, -0.000043)"
							/>
							<path
								style={{
									transformBox: "fill-box",
									transformOrigin: "50% 50%",
								}}
								strokeWidth="0"
								strokeDasharray="none"
								strokeDashoffset="0"
								strokeLinejoin="miter"
								strokeMiterlimit="4"
								fillRule="nonzero"
								opacity="1"
								fill="url('#gradient-5-3')"
								stroke="url('#gradient-5-16')"
								d="M -4.671 -29.972 C 15.475 -29.972 31.825 -13.622 31.825 6.524 C 31.825 26.67 15.475 43.02 -4.671 43.02 C -24.817 43.02 -41.167 26.67 -41.167 6.524 C -41.167 -13.622 -24.817 -29.972 -4.671 -29.972 Z"
								strokeLinecap="round"
								transform="matrix(-0.496122, 0.868253, -0.868253, -0.496122, 0.000072, -0.000004)"
							/>
						</g>
					</g>
					<path
						style={{
							transformBox: "fill-box",
							transformOrigin: "50% 50%",
						}}
						strokeWidth="1"
						strokeDasharray="none"
						strokeDashoffset="0"
						strokeLinejoin="miter"
						strokeMiterlimit="4"
						fillRule="nonzero"
						opacity="1"
						fill="url('#gradient-5-8')"
						stroke="url('#gradient-5-17')"
						d="M -934.352 -234.133 L -920.742 -265.523 L -889.352 -279.133 L -920.742 -292.743 L -934.352 -324.133 L -947.962 -292.743 L -979.352 -279.133 L -947.962 -265.523 L -934.352 -234.133 Z"
						strokeLinecap="round"
						transform="matrix(0.927184, -0.374606, 0.374606, 0.927184, 0, 0)"
					/>
					<path
						strokeWidth="1"
						strokeDasharray="none"
						strokeDashoffset="0"
						strokeLinejoin="miter"
						strokeMiterlimit="4"
						fillRule="nonzero"
						opacity="1"
						fill="url('#gradient-5-10')"
						stroke="url('#gradient-5-18')"
						d="M -3.173 6.732 L 10.437 -24.658 L 41.827 -38.268 L 10.437 -51.878 L -3.173 -83.268 L -16.783 -51.878 L -48.173 -38.268 L -16.783 -24.658 L -3.173 6.732 Z"
						strokeLinecap="round"
					/>
					<path
						style={{
							transformBox: "fill-box",
							transformOrigin: "50% 50%",
						}}
						strokeWidth="1"
						strokeDasharray="none"
						strokeDashoffset="0"
						strokeLinejoin="miter"
						strokeMiterlimit="4"
						fillRule="nonzero"
						opacity="1"
						fill="url('#gradient-5-9')"
						stroke="url('#gradient-5-19')"
						d="M -269.883 -255.191 L -256.273 -286.582 L -224.883 -300.192 L -256.273 -313.802 L -269.883 -345.192 L -283.493 -313.802 L -314.883 -300.192 L -283.493 -286.582 L -269.883 -255.191 Z"
						strokeLinecap="round"
						transform="matrix(0.754711, -0.656058, 0.656058, 0.754711, -0.000008, 0.000024)"
					/>
				</g>
			</g>
		</svg>
	);
};

export const GithubIcon: React.FC<IconSvgProps> = ({
	size,
	width,
	height,
	...props
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			fill="currentColor"
			viewBox="0 0 24 24"
			width={size || width || DefaultSvgSize}
			height={size || height || DefaultSvgSize}
			{...props}
		>
			<title>GitHub</title>
			<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
		</svg>
	);
};

export const DiscordIcon: React.FC<IconSvgProps> = ({
	size,
	width,
	height,
	className,
	...props
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			className={cn("fill-[#5865f2] dark:fill-[#5865f2]", className)}
			fill="currentColor"
			viewBox="0 0 24 24"
			width={size || width || DefaultSvgSize}
			height={size || height || DefaultSvgSize}
			{...props}
		>
			<title>Discord</title>
			<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
		</svg>
	);
};

export const LogoutIcon: React.FC<IconSvgProps> = ({
	size,
	width,
	height,
	...props
}) => {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			width={size || width || DefaultSvgSize}
			height={size || height || DefaultSvgSize}
			{...props}
		>
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<polyline points="16 17 21 12 16 7" />
			<line x1="21" y1="12" x2="9" y2="12" />
		</svg>
	);
};

export const GoogleIcon: React.FC<IconSvgProps> = ({
	size,
	width,
	height,
	...props
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			aria-label="Google"
			role="img"
			viewBox="0 0 512 512"
			width={size || width || DefaultSvgSize}
			height={size || height || DefaultSvgSize}
			{...props}
		>
			<path d="m0 0H512V512H0" fill="none" />
			<path
				fill="#34a853"
				d="m90 341a192 192 0 00296 59v-48h-62c-53 35-141 22-171-60"
			/>
			<path
				fill="#4285f4"
				d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
			/>
			<path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
			<path
				fill="#ea4335"
				d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
			/>
		</svg>
	);
};

export const ShieldIcon: React.FC<IconSvgProps> = ({
	size,
	width,
	height,
	...props
}) => {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
			viewBox="0 0 16 16"
			width={size || width || DefaultSvgSize}
			height={size || height || DefaultSvgSize}
			{...props}
		>
			<path d="M5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z" />
		</svg>
	);
};

export const KeyIcon: React.FC<IconSvgProps> = ({
	size,
	width,
	height,
	...props
}) => {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
			width={size || width || DefaultSvgSize}
			height={size || height || DefaultSvgSize}
			{...props}
		>
			<path
				fill="currentColor"
				d="M218.1,167.17c0,13,0,25.6,4.1,37.4-43.1,50.6-156.9,184.3-167.5,194.5a20.17,20.17,0,0,0-6.7,15c0,8.5,5.2,16.7,9.6,21.3,6.6,6.9,34.8,33,40,28,15.4-15,18.5-19,24.8-25.2,9.5-9.3-1-28.3,2.3-36s6.8-9.2,12.5-10.4,15.8,2.9,23.7,3c8.3.1,12.8-3.4,19-9.2,5-4.6,8.6-8.9,8.7-15.6.2-9-12.8-20.9-3.1-30.4s23.7,6.2,34,5,22.8-15.5,24.1-21.6-11.7-21.8-9.7-30.7c.7-3,6.8-10,11.4-11s25,6.9,29.6,5.9c5.6-1.2,12.1-7.1,17.4-10.4,15.5,6.7,29.6,9.4,47.7,9.4,68.5,0,124-53.4,124-119.2S408.5,48,340,48,218.1,101.37,218.1,167.17ZM400,144a32,32,0,1,1-32-32A32,32,0,0,1,400,144Z"
			/>
		</svg>
	);
};

export const GitlabIcon: React.FC<IconSvgProps> = ({
	size,
	width,
	height,
	...props
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			aria-label="GitLab"
			role="img"
			viewBox="0 0 512 512"
			width={size || width || DefaultSvgSize}
			height={size || height || DefaultSvgSize}
			{...props}
		>
			<path d="m0 0H512V512H0" fill="#FFFFFF00" />
			<path
				fill="#e24329"
				d="m71 222 52-136c5-12 21-12 26 0l35.5 109h143L363 86c5-12 21-12 26 0l52 136-185 120"
			/>
			<path fill="#fca326" d="m244 442q12 10 24 0l61-46V340.8H183V396" />
			<path
				fill="#fc6d26"
				d="m103 336A97 97 0 0171 222q37 8 65 28l193 146 80-60a97 97 0 0032-114q-37 8-65 28L183 396"
			/>
		</svg>
	);
};

export const GearIcon: React.FC<IconSvgProps> = ({
	size,
	width,
	height,
	...props
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
			width={size || width || DefaultSvgSize}
			height={size || height || DefaultSvgSize}
			{...props}
		>
			<path
				fillRule="evenodd"
				d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z"
				clipRule="evenodd"
			/>
		</svg>
	);
};

export const DashboardIcon: React.FC<IconSvgProps> = ({
	size,
	width,
	height,
	...props
}) => {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size || width || DefaultSvgSize}
			height={size || height || DefaultSvgSize}
			{...props}
		>
			<path fill="none" d="M0 0h24v24H0V0z" />
			<path
				fill="currentColor"
				d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z"
			/>
		</svg>
	);
};

export const PersonIcon: React.FC<IconSvgProps> = ({
	size,
	width,
	height,
	...props
}) => {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
			width={size || width || DefaultSvgSize}
			height={size || height || DefaultSvgSize}
			{...props}
		>
			<path
				fill="currentColor"
				d="M332.64,64.58C313.18,43.57,286,32,256,32c-30.16,0-57.43,11.5-76.8,32.38-19.58,21.11-29.12,49.8-26.88,80.78C156.76,206.28,203.27,256,256,256s99.16-49.71,103.67-110.82C361.94,114.48,352.34,85.85,332.64,64.58Z"
			/>
			<path
				fill="currentColor"
				d="M432,480H80A31,31,0,0,1,55.8,468.87c-6.5-7.77-9.12-18.38-7.18-29.11C57.06,392.94,83.4,353.61,124.8,326c36.78-24.51,83.37-38,131.2-38s94.42,13.5,131.2,38c41.4,27.6,67.74,66.93,76.18,113.75,1.94,10.73-.68,21.34-7.18,29.11A31,31,0,0,1,432,480Z"
			/>
		</svg>
	);
};

export const EditIcon: React.FC<IconSvgProps> = ({
	size,
	width,
	height,
	...props
}) => {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size || width || DefaultSvgSize}
			height={size || height || DefaultSvgSize}
			{...props}
		>
			<g id="Layer_2" data-name="Layer 2">
				<g id="edit-2">
					<g id="edit-2-2" data-name="edit-2">
						<rect className="fill-current opacity-0" width="24" height="24" />
						<path
							className="fill-current"
							d="M19,20H5a1,1,0,0,0,0,2H19a1,1,0,0,0,0-2Z"
						/>
						<path
							className="fill-current"
							d="M5,18h.09l4.17-.38a2,2,0,0,0,1.21-.57l9-9a1.92,1.92,0,0,0-.07-2.71h0L16.66,2.6A2,2,0,0,0,14,2.53l-9,9a2,2,0,0,0-.57,1.21L4,16.91a1,1,0,0,0,.29.8A1,1,0,0,0,5,18ZM15.27,4,18,6.73,16,8.68,13.32,6Z"
						/>
					</g>
				</g>
			</g>
		</svg>
	);
};

export const TrashIcon: React.FC<IconSvgProps> = ({
	size,
	width,
	height,
	...props
}) => {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 256 256"
			width={size || width || DefaultSvgSize}
			height={size || height || DefaultSvgSize}
			{...props}
		>
			<rect fill="none" />
			<path
				fill="currentColor"
				d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm0-120H96V40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z"
			/>
		</svg>
	);
};

export const GlobeIcon: React.FC<IconSvgProps> = ({
	size,
	width,
	height,
	...props
}) => {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 256 256"
			width={size || width || DefaultSvgSize}
			height={size || height || DefaultSvgSize}
			{...props}
		>
			<rect width="256" height="256" fill="none" />
			<circle
				cx="128"
				cy="128"
				r="96"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="12"
			/>
			<path
				d="M88,128c0,37.46,13.33,70.92,34.28,93.49a7.77,7.77,0,0,0,11.44,0C154.67,198.92,168,165.46,168,128s-13.33-70.92-34.28-93.49a7.77,7.77,0,0,0-11.44,0C101.33,57.08,88,90.54,88,128Z"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="12"
			/>
			<line
				x1="37.46"
				y1="96"
				x2="218.54"
				y2="96"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="12"
			/>
			<line
				x1="37.46"
				y1="160"
				x2="218.54"
				y2="160"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="12"
			/>
		</svg>
	);
};

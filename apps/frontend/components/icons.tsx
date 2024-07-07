import { cn } from "@/lib/utils";
import type { IconSvgProps } from "@/types";
import type React from "react";

const DefaultSvgSize = "1.6rem";

export const SunIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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

export const MoonIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path id="moon_path" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
};

export const BrandIcon: React.FC<IconSvgProps> = ({ size, width, height, className, ...props }) => {
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
                        className="text-[hsl(var(--accent-color-hue),_77%,_55%)] dark:text-[hsla(var(--accent-color-hue),_95%,_65%)]"
                        stopColor="currentColor"
                        offset="0"
                    />
                    <stop
                        className="text-[hsl(var(--accent-color-hue),_83%,_45%)] dark:text-[hsl(var(--accent-color-hue),_77%,_35%)]"
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

export const GithubIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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

export const DiscordIcon: React.FC<IconSvgProps> = ({ size, width, height, className, ...props }) => {
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

export const LogoutIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden={true}
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
    );
};

export const GoogleIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path fill="#34a853" d="m90 341a192 192 0 00296 59v-48h-62c-53 35-141 22-171-60" />
            <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
            <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
            <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
        </svg>
    );
};

export const ShieldIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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

export const KeyIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="currentColor"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path d="M218.1,167.17c0,13,0,25.6,4.1,37.4-43.1,50.6-156.9,184.3-167.5,194.5a20.17,20.17,0,0,0-6.7,15c0,8.5,5.2,16.7,9.6,21.3,6.6,6.9,34.8,33,40,28,15.4-15,18.5-19,24.8-25.2,9.5-9.3-1-28.3,2.3-36s6.8-9.2,12.5-10.4,15.8,2.9,23.7,3c8.3.1,12.8-3.4,19-9.2,5-4.6,8.6-8.9,8.7-15.6.2-9-12.8-20.9-3.1-30.4s23.7,6.2,34,5,22.8-15.5,24.1-21.6-11.7-21.8-9.7-30.7c.7-3,6.8-10,11.4-11s25,6.9,29.6,5.9c5.6-1.2,12.1-7.1,17.4-10.4,15.5,6.7,29.6,9.4,47.7,9.4,68.5,0,124-53.4,124-119.2S408.5,48,340,48,218.1,101.37,218.1,167.17ZM400,144a32,32,0,1,1-32-32A32,32,0,0,1,400,144Z" />
        </svg>
    );
};

export const GitlabIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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

export const GearIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden={true}
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
};

export const DashboardIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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

export const DashboardIconOutlined: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            fill="currentColor"
            {...props}
        >
            <path d="M13 21V11H21V21H13ZM3 13V3H11V13H3ZM9 11V5H5V11H9ZM3 21V15H11V21H3ZM5 19H9V17H5V19ZM15 19H19V13H15V19ZM13 3H21V9H13V3ZM15 5V7H19V5H15Z" />
        </svg>
    );
};

export const PersonIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
};

export const EditIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
                        <path className="fill-current" d="M19,20H5a1,1,0,0,0,0,2H19a1,1,0,0,0,0-2Z" />
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

export const TrashIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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

export const GlobeIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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

export const BellIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
};

export const FlagIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
    );
};

export const BarChartIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M3 3v18h18" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
        </svg>
    );
};

export const LayoutListIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
            <path d="M14 4h7" />
            <path d="M14 9h7" />
            <path d="M14 15h7" />
            <path d="M14 20h7" />
        </svg>
    );
};

export const BuildingsIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
            <path d="M10 6h4" />
            <path d="M10 10h4" />
            <path d="M10 14h4" />
            <path d="M10 18h4" />
        </svg>
    );
};

export const CollectionsIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="m16 6 4 14" />
            <path d="M12 6v14" />
            <path d="M8 8v12" />
            <path d="M4 4v16" />
        </svg>
    );
};

export const DollarIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            fill="currentColor"
            {...props}
        >
            <path d="M160 0c17.7 0 32 14.3 32 32V67.7c1.6 .2 3.1 .4 4.7 .7c.4 .1 .7 .1 1.1 .2l48 8.8c17.4 3.2 28.9 19.9 25.7 37.2s-19.9 28.9-37.2 25.7l-47.5-8.7c-31.3-4.6-58.9-1.5-78.3 6.2s-27.2 18.3-29 28.1c-2 10.7-.5 16.7 1.2 20.4c1.8 3.9 5.5 8.3 12.8 13.2c16.3 10.7 41.3 17.7 73.7 26.3l2.9 .8c28.6 7.6 63.6 16.8 89.6 33.8c14.2 9.3 27.6 21.9 35.9 39.5c8.5 17.9 10.3 37.9 6.4 59.2c-6.9 38-33.1 63.4-65.6 76.7c-13.7 5.6-28.6 9.2-44.4 11V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.1c-.4-.1-.9-.1-1.3-.2l-.2 0 0 0c-24.4-3.8-64.5-14.3-91.5-26.3c-16.1-7.2-23.4-26.1-16.2-42.2s26.1-23.4 42.2-16.2c20.9 9.3 55.3 18.5 75.2 21.6c31.9 4.7 58.2 2 76-5.3c16.9-6.9 24.6-16.9 26.8-28.9c1.9-10.6 .4-16.7-1.3-20.4c-1.9-4-5.6-8.4-13-13.3c-16.4-10.7-41.5-17.7-74-26.3l-2.8-.7 0 0C119.4 279.3 84.4 270 58.4 253c-14.2-9.3-27.5-22-35.8-39.6c-8.4-17.9-10.1-37.9-6.1-59.2C23.7 116 52.3 91.2 84.8 78.3c13.3-5.3 27.9-8.9 43.2-11V32c0-17.7 14.3-32 32-32z" />
        </svg>
    );
};

export const ChevronRightIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
    );
};

export const HistoryIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
        </svg>
    );
};

export const DevicesIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <rect
                x="136"
                y="104"
                width="128"
                height="80"
                rx="16"
                transform="translate(344 -56) rotate(90)"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="20"
            />
            <line
                x1="128"
                y1="208"
                x2="88"
                y2="208"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="20"
            />
            <path
                d="M160,176H40a16,16,0,0,1-16-16V64A16,16,0,0,1,40,48H184a16,16,0,0,1,16,16V80"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="20"
            />
            <line
                x1="192"
                y1="112"
                x2="208"
                y2="112"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="20"
            />
        </svg>
    );
};

export const CrownIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
        </svg>
    );
};

export const TagsIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z" />
            <path d="M6 9.01V9" />
            <path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19" />
        </svg>
    );
};

export const TextIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M17 6.1H3" />
            <path d="M21 12.1H3" />
            <path d="M15.1 18H3" />
        </svg>
    );
};

export const CopyrightIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9.354a4 4 0 1 0 0 5.292" />
        </svg>
    );
};

export const ChainIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    );
};

export const PeopleIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
            <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
        </svg>
    );
};

export const PhotoIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 8h.01" />
            <path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" />
            <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" />
            <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" />
        </svg>
    );
};

export const VersionIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
                r="48"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="20"
            />
            <line
                x1="8"
                y1="128"
                x2="80"
                y2="128"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="20"
            />
            <line
                x1="176"
                y1="128"
                x2="248"
                y2="128"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="20"
            />
        </svg>
    );
};

export const SaveIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
        </svg>
    );
};

export const UploadIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.25}
            stroke="currentColor"
            className="size-6"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
        </svg>
    );
};

export const BookIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
        </svg>
    );
};

export const EyeScanIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <circle cx="12" cy="12" r="1" />
            <path d="M5 12s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5" />
        </svg>
    );
};

export const BulletedListIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <line x1="8" x2="21" y1="6" y2="6" />
            <line x1="8" x2="21" y1="12" y2="12" />
            <line x1="8" x2="21" y1="18" y2="18" />
            <line x1="3" x2="3.01" y1="6" y2="6" />
            <line x1="3" x2="3.01" y1="12" y2="12" />
            <line x1="3" x2="3.01" y1="18" y2="18" />
        </svg>
    );
};

export const NumberedListIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <line x1="10" x2="21" y1="6" y2="6" />
            <line x1="10" x2="21" y1="12" y2="12" />
            <line x1="10" x2="21" y1="18" y2="18" />
            <path d="M4 6h1v4" />
            <path d="M4 10h2" />
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
        </svg>
    );
};

export const QuoteIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M17 6H3" />
            <path d="M21 12H8" />
            <path d="M21 18H8" />
            <path d="M3 12v6" />
        </svg>
    );
};

export const YoutubeIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
            <path d="m10 15 5-3-5-3z" />
        </svg>
    );
};

export const Heading1Icon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M4 12h8" />
            <path d="M4 18V6" />
            <path d="M12 18V6" />
            <path d="m17 12 3-2v8" />
        </svg>
    );
};

export const Heading2Icon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M4 12h8" />
            <path d="M4 18V6" />
            <path d="M12 18V6" />
            <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
        </svg>
    );
};

export const Heading3Icon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M4 12h8" />
            <path d="M4 18V6" />
            <path d="M12 18V6" />
            <path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" />
            <path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" />
        </svg>
    );
};

export const BoldIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
        </svg>
    );
};

export const StrikethroughIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M16 4H9a3 3 0 0 0-2.83 4" />
            <path d="M14 12a4 4 0 0 1 0 8H6" />
            <line x1="4" x2="20" y1="12" y2="12" />
        </svg>
    );
};

export const UnderlineIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M6 4v6a6 6 0 0 0 12 0V4" />
            <line x1="4" x2="20" y1="20" y2="20" />
        </svg>
    );
};

export const DownloadIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
    );
};

export const LeftArrowIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    );
};

export const RightArrowIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
    );
};

export const PlusIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
};

export const CheckIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            data-v-94bd792d=""
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
};

export const CaretDownFilledIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
                d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z"
                strokeWidth="0"
                fill="currentColor"
            />
        </svg>
    );
};

export const FunnelIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    );
};

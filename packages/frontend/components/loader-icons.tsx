import type { IconSvgProps } from "@/types";
import { DefaultSvgSize } from "./icons";

export const PuzzleIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
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
            <title>Puzzle</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 7h3a1 1 0 0 0 1 -1v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0 -1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-1a2 2 0 0 0 -4 0v1a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1a2 2 0 0 0 0 -4h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1" />
        </svg>
    );
};

export const QuiltIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlSpace="preserve"
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="2"
            clipRule="evenodd"
            viewBox="0 0 24 24"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <title>Quilt</title>
            <defs>
                <path
                    id="quilt"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="65.6"
                    d="M442.5 233.9c0-6.4-5.2-11.6-11.6-11.6h-197c-6.4 0-11.6 5.2-11.6 11.6v197c0 6.4 5.2 11.6 11.6 11.6h197c6.4 0 11.6-5.2 11.6-11.7v-197Z"
                />
            </defs>
            <path fill="none" d="M0 0h24v24H0z" />
            <use xlinkHref="#quilt" strokeWidth="65.6" transform="matrix(.03053 0 0 .03046 -3.2 -3.2)" />
            <use xlinkHref="#quilt" strokeWidth="65.6" transform="matrix(.03053 0 0 .03046 -3.2 7)" />
            <use xlinkHref="#quilt" strokeWidth="65.6" transform="matrix(.03053 0 0 .03046 6.9 -3.2)" />
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth="70.4"
                d="M442.5 234.8c0-7-5.6-12.5-12.5-12.5H234.7c-6.8 0-12.4 5.6-12.4 12.5V430c0 6.9 5.6 12.5 12.4 12.5H430c6.9 0 12.5-5.6 12.5-12.5V234.8Z"
                transform="rotate(45 3.5 24) scale(.02843 .02835)"
            />
        </svg>
    );
};

const commonProps = { className: "w-[0.95rem] aspect-square" };

const LoaderIcons = {
    puzzle_loader: <PuzzleIcon {...commonProps} />,
    quilt: <QuiltIcon {...commonProps} />,
};

export default LoaderIcons;

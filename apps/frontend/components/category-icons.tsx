import type { IconSvgProps } from "@/types";
import type React from "react";

const DefaultSvgSize = "0.9rem";

export const GridIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
        </svg>
    );
};

export const CompassIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
            <circle cx="12" cy="12" r="10" />
        </svg>
    );
};

export const BugIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="m8 2 1.88 1.88" />
            <path d="M14.12 3.88 16 2" />
            <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
            <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
            <path d="M12 20v-9" />
            <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
            <path d="M6 13H2" />
            <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
            <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
            <path d="M22 13h-4" />
            <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
        </svg>
    );
};

export const HomeIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
    );
};

export const DollarIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    );
};

export const SwordsIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
            <line x1="13" x2="19" y1="19" y2="13" />
            <line x1="16" x2="20" y1="16" y2="20" />
            <line x1="19" x2="21" y1="21" y2="19" />
            <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
            <line x1="5" x2="9" y1="14" y2="18" />
            <line x1="7" x2="4" y1="17" y2="20" />
            <line x1="3" x2="5" y1="19" y2="21" />
        </svg>
    );
};

export const WandSparklesIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
            <path d="m14 7 3 3" />
            <path d="M5 6v4" />
            <path d="M19 14v4" />
            <path d="M10 2v2" />
            <path d="M7 8H3" />
            <path d="M21 16h-4" />
            <path d="M11 3H9" />
        </svg>
    );
};

export const CarrotIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM8.64 14l-2.05-2.04M15.34 15l-2.46-2.46" />
            <path d="M22 9s-1.33-2-3.5-2C16.86 7 15 9 15 9s1.33 2 3.5 2S22 9 22 9z" />
            <path d="M15 2s-2 1.33-2 3.5S15 9 15 9s2-1.84 2-3.5C17 3.33 15 2 15 2z" />
        </svg>
    );
};

export const SlidersIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <line x1="4" x2="4" y1="21" y2="14" />
            <line x1="4" x2="4" y1="10" y2="3" />
            <line x1="12" x2="12" y1="21" y2="12" />
            <line x1="12" x2="12" y1="8" y2="3" />
            <line x1="20" x2="20" y1="21" y2="16" />
            <line x1="20" x2="20" y1="12" y2="3" />
            <line x1="2" x2="6" y1="14" y2="14" />
            <line x1="10" x2="14" y1="8" y2="8" />
            <line x1="18" x2="22" y1="16" y2="16" />
        </svg>
    );
};

export const BookClosedIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
    );
};

export const Server1Icon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
            <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
            <line x1="6" x2="6.01" y1="6" y2="6" />
            <line x1="6" x2="6.01" y1="18" y2="18" />
        </svg>
    );
};

export const AwardIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
            <circle cx="12" cy="8" r="6" />
        </svg>
    );
};

export const MobIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            xmlSpace="preserve"
            fillRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit="1.5"
            clipRule="evenodd"
            viewBox="0 0 24 24"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path fill="none" d="M0 0h24v24H0z" />
            <path fill="none" stroke="currentColor" strokeWidth="2" d="M3 3h18v18H3z" />
            <path
                stroke="currentColor"
                fill="currentColor"
                d="M6 6h4v4H6zm8 0h4v4h-4zm-4 4h4v2h2v6h-2v-2h-4v2H8v-6h2v-2Z"
            />
        </svg>
    );
};

export const LightningIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
        </svg>
    );
};

export const ChatBubbleIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
    );
};

export const ArchiveIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <rect width="20" height="5" x="2" y="3" rx="1" />
            <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
            <path d="M10 12h4" />
        </svg>
    );
};

export const CpuIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <rect width="16" height="16" x="4" y="4" rx="2" />
            <rect width="6" height="6" x="9" y="9" rx="1" />
            <path d="M15 2v2" />
            <path d="M15 20v2" />
            <path d="M2 15h2" />
            <path d="M2 9h2" />
            <path d="M20 15h2" />
            <path d="M20 9h2" />
            <path d="M9 2v2" />
            <path d="M9 20v2" />
        </svg>
    );
};

export const TruckIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
    );
};

export const BriefCaseIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            <rect width="20" height="14" x="2" y="6" rx="2" />
        </svg>
    );
};

export const GlobeIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
            <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" />
            <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
            <circle cx="12" cy="12" r="10" />
        </svg>
    );
};

export const BoxesIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
            <path d="m7 16.5-4.74-2.85" />
            <path d="m7 16.5 5-3" />
            <path d="M7 16.5v5.17" />
            <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
            <path d="m17 16.5-5-3" />
            <path d="m17 16.5 4.74-2.85" />
            <path d="M17 16.5v5.17" />
            <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" />
            <path d="M12 8 7.26 5.15" />
            <path d="m12 8 4.74-2.85" />
            <path d="M12 13.5V8" />
        </svg>
    );
};

export const BarChartIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
        </svg>
    );
};

export const SwordsClashIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path d="M17.4563 3L20.9991 3.00335L21.001 6.52648L15.5341 11.992L18.3624 14.8207L19.7772 13.4071L21.1915 14.8213L18.7166 17.2962L21.545 20.1246L20.1308 21.5388L17.3024 18.7104L14.8275 21.1853L13.4133 19.7711L14.8269 18.3562L11.9981 15.528L9.1703 18.3558L10.5849 19.7711L9.17064 21.1853L6.69614 18.71L3.86734 21.5388L2.45312 20.1246L5.28192 17.2958L2.80668 14.8213L4.22089 13.4071L5.63477 14.8202L8.46212 11.992L3.00181 6.53118L2.99907 3L6.54506 3.00335L11.9981 8.457L17.4563 3ZM9.87612 13.406L7.04807 16.234L7.75607 16.941L10.5831 14.113L9.87612 13.406ZM19.0001 5.001H18.2831L13.4121 9.87L14.1191 10.577L19.0001 5.698V5.001ZM5.00007 5.001V5.701L16.2411 16.942L16.9482 16.2349L5.71507 5.002L5.00007 5.001Z" />
        </svg>
    );
};

export const FeatherIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z" />
            <path d="M16 8 2 22" />
            <path d="M17.5 15H9" />
        </svg>
    );
};

export const KitchenSinkIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            viewBox="0 0 24 24"
            xmlSpace="preserve"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m19.9 14-1.4 4.9c-.3 1-1.1 1.7-2.1 1.7H7.6c-.9 0-1.8-.7-2.1-1.7L4.1 14h15.8zM12 10V4.5M12 4.5c0-1.2.9-2.1 2.1-2.1M14.1 2.4c1.2 0 2.1.9 2.1 2.1M22.2 12c0 .6-.2 1.1-.6 1.4-.4.4-.9.6-1.4.6H3.8c-1.1 0-2-.9-2-2 0-.6.2-1.1.6-1.4.4-.4.9-.6 1.4-.6h16.4c1.1 0 2 .9 2 2z"></path>
            </g>
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.2 7.2h0"
            ></path>
        </svg>
    );
};

export const PlayeresIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
};

export const QuestsIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
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
            <rect x="9" y="2" width="6" height="6"></rect>
            <rect x="16" y="16" width="6" height="6"></rect>
            <rect x="2" y="16" width="6" height="6"></rect>
            <path d="M12 8v4m0 0H5v4m7-4h7v4"></path>
        </svg>
    );
};

export const SquarePlusIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
        </svg>
    );
};

export const PhotoFrameIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
    );
};

export const HexagonIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
    );
};

export const PenToolIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" />
            <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" />
            <path d="m2.3 2.3 7.286 7.286" />
            <circle cx="11" cy="11" r="2" />
        </svg>
    );
};

export const SquarePenIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
        </svg>
    );
};

export const IceCreamConeIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11" />
            <path d="M17 7A5 5 0 0 0 7 7" />
            <path d="M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4" />
        </svg>
    );
};

export const HeadphoneIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
        </svg>
    );
};

export const CubeIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
        </svg>
    );
};

export const SunIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
        </svg>
    );
};

export const LetterTIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" x2="15" y1="20" y2="20" />
            <line x1="12" x2="12" y1="4" y2="20" />
        </svg>
    );
};

export const PanelIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
        </svg>
    );
};

export const StripedGlobeIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
        </svg>
    );
};

export const LayersIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
            <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
            <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
        </svg>
    );
};

export const BrushIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
            <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
        </svg>
    );
};

export const FilmIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 3v18" />
            <path d="M3 7.5h4" />
            <path d="M3 12h18" />
            <path d="M3 16.5h4" />
            <path d="M17 3v18" />
            <path d="M17 7.5h4" />
            <path d="M17 16.5h4" />
        </svg>
    );
};

export const CloudSunRainIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M12 2v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="M20 12h2" />
            <path d="m19.07 4.93-1.41 1.41" />
            <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" />
            <path d="M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24" />
            <path d="M11 20v2" />
            <path d="M7 19v2" />
        </svg>
    );
};

export const LampIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M8 2h8l4 10H4L8 2Z" />
            <path d="M12 12v6" />
            <path d="M8 22v-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H8Z" />
        </svg>
    );
};

export const PaletteIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
    );
};

export const TreeIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.04a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z" />
            <path d="M12 19v3" />
        </svg>
    );
};

export const RayReflectingIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <path d="M2.977 19.17h16.222" transform="translate(-.189 -.328) scale(1.09932)"></path>
            <path d="M3.889 3.259 12 19.17l5.749-11.277" transform="translate(-1.192 -.328) scale(1.09932)"></path>
            <path d="M9.865 6.192h4.623v4.623" transform="scale(1.09931) rotate(-18 20.008 .02)"></path>
        </svg>
    );
};

export const LightBulbIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
        </svg>
    );
};

export const MirrorIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="m3 7 5 5-5 5V7" />
            <path d="m21 7-5 5 5 5V7" />
            <path d="M12 20v2" />
            <path d="M12 14v2" />
            <path d="M12 8v2" />
            <path d="M12 2v2" />
        </svg>
    );
};

export const ShadowIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    );
};

export const SignalLowIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M2 20h.01" />
            <path d="M7 20v-4" />
        </svg>
    );
};

export const SignalMediumIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M2 20h.01" />
            <path d="M7 20v-4" />
            <path d="M12 20v-8" />
        </svg>
    );
};

export const SignalHighIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
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
            <path d="M2 20h.01" />
            <path d="M7 20v-4" />
            <path d="M12 20v-8" />
            <path d="M17 20V8" />
        </svg>
    );
};

export const PotatoIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            viewBox="0 0 512 512"
            fill="currentColor"
            stroke="currentColor"
            width={size || width || DefaultSvgSize}
            height={size || height || DefaultSvgSize}
            {...props}
        >
            <g>
                <g>
                    <path d="M218.913,116.8c-6.4-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8c3.2-3.2,4.8-6.4,4.8-11.2S222.113,120,218.913,116.8z"></path>
                </g>
            </g>
            <g>
                <g>
                    <path d="M170.913,372.8c-6.4-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8c3.2-3.2,4.8-8,4.8-11.2C175.713,379.2,174.113,376,170.913,372.8z"></path>
                </g>
            </g>
            <g>
                <g>
                    <path d="M250.913,228.8c-4.8-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8c3.2-3.2,4.8-8,4.8-11.2C255.713,235.2,254.113,232,250.913,228.8z"></path>
                </g>
            </g>
            <g>
                <g>
                    <path d="M410.913,212.8c-4.8-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8c3.2-3.2,4.8-8,4.8-11.2C415.713,219.2,414.113,216,410.913,212.8z"></path>
                </g>
            </g>
            <g>
                <g>
                    <path d="M346.913,308.8c-4.8-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8c3.2-3.2,4.8-8,4.8-11.2C351.713,315.2,350.113,312,346.913,308.8z"></path>
                </g>
            </g>
            <g>
                <g>
                    <path d="M346.913,100.8c-6.4-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8s4.8-6.4,4.8-11.2S350.113,104,346.913,100.8z"></path>
                </g>
            </g>
            <g>
                <g>
                    <path d="M503.713,142.4c-28.8-136-179.2-142.4-208-142.4c-4.8,0-9.6,0-16,0c-67.2,1.6-132.8,36.8-187.2,97.6    c-60.8,67.2-96,155.2-91.2,227.2c8,126.4,70.4,187.2,192,187.2c115.2,0,201.6-33.6,256-100.8    C513.313,331.2,519.713,219.2,503.713,142.4z M423.713,392c-48,59.2-126.4,89.6-230.4,89.6s-152-48-160-158.4    c-4.8-64,28.8-144,83.2-203.2c48-54.4,107.2-84.8,164.8-88c4.8,0,9.6,0,14.4,0c140.8,0,171.2,89.6,176,116.8    C486.113,219.2,481.313,320,423.713,392z"></path>
                </g>
            </g>
        </svg>
    );
};

const ICONS = {
    quilt_icon: <GridIcon />,
    puzzle_loader_icon: <BoxesIcon />,
    adventure_icon: <CompassIcon />,
    atmosphere_icon: <CloudSunRainIcon />,
    audio_icon: <HeadphoneIcon />,
    blocks_icon: <CubeIcon />,
    bloom_icon: <LampIcon />,
    cartoon_icon: <BrushIcon />,
    challenging_icon: <BarChartIcon />,
    "colored-lighting_icon": <PaletteIcon />,
    combat_icon: <SwordsClashIcon />,
    "core-shaders_icon": <CpuIcon />,
    cursed_icon: <BugIcon />,
    decoration_icon: <HomeIcon />,
    economy_icon: <DollarIcon />,
    entities_icon: <MobIcon />,
    environment_icon: <SunIcon />,
    equipment_icon: <SwordsIcon />,
    fantasy_icon: <WandSparklesIcon />,
    foliage_icon: <TreeIcon />,
    fonts_icon: <LetterTIcon />,
    food_icon: <CarrotIcon />,
    "game-mechanics_icon": <SlidersIcon />,
    gui_icon: <PanelIcon />,
    high_icon: <SignalHighIcon />,
    items_icon: <BookClosedIcon />,
    "kitchen-sink_icon": <KitchenSinkIcon />,
    library_icon: <BookClosedIcon />,
    lightweight_icon: <FeatherIcon />,
    locale_icon: <StripedGlobeIcon />,
    low_icon: <SignalLowIcon />,
    magic_icon: <WandSparklesIcon />,
    management_icon: <Server1Icon />,
    medium_icon: <SignalMediumIcon />,
    minigame_icon: <AwardIcon />,
    mobs_icon: <MobIcon />,
    modded_icon: <SquarePlusIcon />,
    models_icon: <LayersIcon />,
    multiplayer_icon: <PlayeresIcon />,
    optimization_icon: <LightningIcon />,
    "path-tracing_icon": <RayReflectingIcon />,
    pbr_icon: <LightBulbIcon />,
    potato_icon: <PotatoIcon />,
    quests_icon: <QuestsIcon />,
    realistic_icon: <PhotoFrameIcon />,
    reflections_icon: <MirrorIcon />,
    screenshot_icon: <PhotoFrameIcon />,
    "semi-realistic_icon": <FilmIcon />,
    shadows_icon: <ShadowIcon />,
    simplistic_icon: <HexagonIcon />,
    social_icon: <ChatBubbleIcon />,
    storage_icon: <ArchiveIcon />,
    technology_icon: <CpuIcon />,
    themed_icon: <PenToolIcon />,
    transportation_icon: <TruckIcon />,
    tweaks_icon: <SquarePenIcon />,
    utility_icon: <BriefCaseIcon />,
    "vanilla-like_icon": <IceCreamConeIcon />,
    worldgen_icon: <GlobeIcon />,
};

export default ICONS;

export const CategoryIcon = ({ name }: { name: string }) => {
    // @ts-ignore
    if (!ICONS[name]) return null;
    return (
        <i className="flex items-center justify-center">
            {
                // @ts-ignore
                ICONS[name]
            }
        </i>
    );
};

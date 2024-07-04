import type { IconSvgProps } from "@/types";
import type React from "react";

const DefaultSvgSize = "1rem";

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
            stroke-width="2"
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
            stroke-width="2"
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

export default {
    quilt_icon: <GridIcon />,
    adventure_icon: <CompassIcon />,
    atmosphere_icon: null,
    audio_icon: null,
    blocks_icon: null,
    bloom_icon: null,
    cartoon_icon: null,
    challenging_icon: null,
    "colored-lighting_icon": null,
    combat_icon: null,
    "core-shaders_icon": null,
    cursed_icon: <BugIcon />,
    decoration_icon: <HomeIcon />,
    economy_icon: <DollarIcon />,
    entities_icon: null,
    environment_icon: null,
    equipment_icon: <SwordsIcon />,
    fantasy_icon: null,
    foliage_icon: null,
    fonts_icon: null,
    food_icon: <CarrotIcon />,
    "game-mechanics_icon": <SlidersIcon />,
    gui_icon: null,
    high_icon: null,
    items_icon: null,
    "kitchen-sink_icon": null,
    library_icon: <BookClosedIcon />,
    lightweight_icon: null,
    locale_icon: null,
    low_icon: null,
    magic_icon: <WandSparklesIcon />,
    management_icon: <Server1Icon />,
    medium_icon: null,
    minigame_icon: <AwardIcon />,
    mobs_icon: null,
    modded_icon: null,
    models_icon: null,
    multiplayer_icon: null,
    optimization_icon: null,
    "path-tracing_icon": null,
    pbr_icon: null,
    potato_icon: null,
    quests_icon: null,
    realistic_icon: null,
    reflections_icon: null,
    screenshot_icon: null,
    "semi-realistic_icon": null,
    shadows_icon: null,
    simplistic_icon: null,
    social_icon: null,
    storage_icon: null,
    technology_icon: null,
    themed_icon: null,
    transportation_icon: null,
    tweaks_icon: null,
    utility_icon: null,
    "vanilla-like_icon": null,
    worldgen_icon: null,
};

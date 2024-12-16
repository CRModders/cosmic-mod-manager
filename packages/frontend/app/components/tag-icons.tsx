import type { IconSvgProps } from "@root/types";
import {
    ArchiveIcon,
    AwardIcon,
    BarChartIcon,
    BookIcon,
    BriefcaseIcon,
    BrushIcon,
    BugIcon,
    CameraIcon,
    CarrotIcon,
    CloudSunRainIcon,
    CompassIcon,
    CpuIcon,
    DollarSignIcon,
    EarthIcon,
    FeatherIcon,
    FilmIcon,
    FlipHorizontal2Icon,
    GlobeIcon,
    HardDriveIcon,
    HeadphonesIcon,
    HexagonIcon,
    HomeIcon,
    IceCreamConeIcon,
    ImageIcon,
    LampIcon,
    LayersIcon,
    LightbulbIcon,
    MessageCircleIcon,
    MonitorIcon,
    MountainIcon,
    NetworkIcon,
    PaletteIcon,
    PanelsTopLeftIcon,
    PenToolIcon,
    PickaxeIcon,
    ServerIcon,
    SignalHighIcon,
    SignalLowIcon,
    SignalMediumIcon,
    SlidersIcon,
    SquarePenIcon,
    SquarePlusIcon,
    SunIcon,
    SwordsIcon,
    TreeDeciduousIcon,
    TruckIcon,
    TypeIcon,
    UsersIcon,
    WandSparklesIcon,
    ZapIcon,
} from "lucide-react";
import { CubeIcon, DefaultSvgSize } from "./icons";

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
            <path stroke="currentColor" fill="currentColor" d="M6 6h4v4H6zm8 0h4v4h-4zm-4 4h4v2h2v6h-2v-2h-4v2H8v-6h2v-2Z" />
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
                <path d="m19.9 14-1.4 4.9c-.3 1-1.1 1.7-2.1 1.7H7.6c-.9 0-1.8-.7-2.1-1.7L4.1 14h15.8zM12 10V4.5M12 4.5c0-1.2.9-2.1 2.1-2.1M14.1 2.4c1.2 0 2.1.9 2.1 2.1M22.2 12c0 .6-.2 1.1-.6 1.4-.4.4-.9.6-1.4.6H3.8c-1.1 0-2-.9-2-2 0-.6.2-1.1.6-1.4.4-.4.9-.6 1.4-.6h16.4c1.1 0 2 .9 2 2z" />
            </g>
            <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16.2 7.2h0" />
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
            <path d="M2.977 19.17h16.222" transform="translate(-.189 -.328) scale(1.09932)" />
            <path d="M3.889 3.259 12 19.17l5.749-11.277" transform="translate(-1.192 -.328) scale(1.09932)" />
            <path d="M9.865 6.192h4.623v4.623" transform="scale(1.09931) rotate(-18 20.008 .02)" />
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
                    <path d="M218.913,116.8c-6.4-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8c3.2-3.2,4.8-6.4,4.8-11.2S222.113,120,218.913,116.8z" />
                </g>
            </g>
            <g>
                <g>
                    <path d="M170.913,372.8c-6.4-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8c3.2-3.2,4.8-8,4.8-11.2C175.713,379.2,174.113,376,170.913,372.8z" />
                </g>
            </g>
            <g>
                <g>
                    <path d="M250.913,228.8c-4.8-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8c3.2-3.2,4.8-8,4.8-11.2C255.713,235.2,254.113,232,250.913,228.8z" />
                </g>
            </g>
            <g>
                <g>
                    <path d="M410.913,212.8c-4.8-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8c3.2-3.2,4.8-8,4.8-11.2C415.713,219.2,414.113,216,410.913,212.8z" />
                </g>
            </g>
            <g>
                <g>
                    <path d="M346.913,308.8c-4.8-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8c3.2-3.2,4.8-8,4.8-11.2C351.713,315.2,350.113,312,346.913,308.8z" />
                </g>
            </g>
            <g>
                <g>
                    <path d="M346.913,100.8c-6.4-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8s4.8-6.4,4.8-11.2S350.113,104,346.913,100.8z" />
                </g>
            </g>
            <g>
                <g>
                    <path d="M503.713,142.4c-28.8-136-179.2-142.4-208-142.4c-4.8,0-9.6,0-16,0c-67.2,1.6-132.8,36.8-187.2,97.6    c-60.8,67.2-96,155.2-91.2,227.2c8,126.4,70.4,187.2,192,187.2c115.2,0,201.6-33.6,256-100.8    C513.313,331.2,519.713,219.2,503.713,142.4z M423.713,392c-48,59.2-126.4,89.6-230.4,89.6s-152-48-160-158.4    c-4.8-64,28.8-144,83.2-203.2c48-54.4,107.2-84.8,164.8-88c4.8,0,9.6,0,14.4,0c140.8,0,171.2,89.6,176,116.8    C486.113,219.2,481.313,320,423.713,392z" />
                </g>
            </g>
        </svg>
    );
};

const defaultProps = { className: "inline w-4 leading-none aspect-square" };

const tagIcons = {
    quilt: <QuiltIcon {...defaultProps} />,
    puzzle_loader: <PuzzleIcon {...defaultProps} />,
    paradox: <PuzzleIcon {...defaultProps} />,
    adventure: <CompassIcon {...defaultProps} />,
    atmosphere: <CloudSunRainIcon {...defaultProps} />,
    audio: <HeadphonesIcon {...defaultProps} />,
    blocks: <CubeIcon {...defaultProps} />,
    bloom: <LampIcon {...defaultProps} />,
    cartoon: <BrushIcon {...defaultProps} />,
    challenging: <BarChartIcon {...defaultProps} />,
    "colored-lighting": <PaletteIcon {...defaultProps} />,
    combat: <SwordsIcon {...defaultProps} />,
    "core-shaders": <CpuIcon {...defaultProps} />,
    cursed: <BugIcon {...defaultProps} />,
    decoration: <HomeIcon {...defaultProps} />,
    economy: <DollarSignIcon {...defaultProps} />,
    entities: <MobIcon {...defaultProps} />,
    environment: <SunIcon {...defaultProps} />,
    equipment: <PickaxeIcon {...defaultProps} />,
    fantasy: <WandSparklesIcon {...defaultProps} />,
    foliage: <TreeDeciduousIcon {...defaultProps} />,
    fonts: <TypeIcon {...defaultProps} />,
    food: <CarrotIcon {...defaultProps} />,
    "game-mechanics": <SlidersIcon {...defaultProps} />,
    gui: <PanelsTopLeftIcon {...defaultProps} />,
    high: <SignalHighIcon {...defaultProps} />,
    items: <BookIcon {...defaultProps} />,
    "kitchen-sink": <KitchenSinkIcon {...defaultProps} />,
    library: <BookIcon {...defaultProps} />,
    lightweight: <FeatherIcon {...defaultProps} />,
    locale: <GlobeIcon {...defaultProps} />,
    low: <SignalLowIcon {...defaultProps} />,
    magic: <WandSparklesIcon {...defaultProps} />,
    management: <ServerIcon {...defaultProps} />,
    medium: <SignalMediumIcon {...defaultProps} />,
    minigame: <AwardIcon {...defaultProps} />,
    mobs: <MobIcon {...defaultProps} />,
    modded: <SquarePlusIcon {...defaultProps} />,
    models: <LayersIcon {...defaultProps} />,
    multiplayer: <UsersIcon {...defaultProps} />,
    optimization: <ZapIcon {...defaultProps} />,
    "path-tracing": <RayReflectingIcon {...defaultProps} />,
    pbr: <LightbulbIcon {...defaultProps} />,
    potato: <PotatoIcon {...defaultProps} />,
    quests: <NetworkIcon {...defaultProps} />,
    realistic: <CameraIcon {...defaultProps} />,
    reflections: <FlipHorizontal2Icon {...defaultProps} />,
    screenshot: <ImageIcon {...defaultProps} />,
    "semi-realistic": <FilmIcon {...defaultProps} />,
    shadows: <MountainIcon {...defaultProps} />,
    simplistic: <HexagonIcon {...defaultProps} />,
    social: <MessageCircleIcon {...defaultProps} />,
    storage: <ArchiveIcon {...defaultProps} />,
    technology: <CpuIcon {...defaultProps} />,
    themed: <PenToolIcon {...defaultProps} />,
    transportation: <TruckIcon {...defaultProps} />,
    tweaks: <SquarePenIcon {...defaultProps} />,
    utility: <BriefcaseIcon {...defaultProps} />,
    "vanilla-like": <IceCreamConeIcon {...defaultProps} />,
    worldgen: <EarthIcon {...defaultProps} />,
    client: <MonitorIcon {...defaultProps} />,
    server: <HardDriveIcon {...defaultProps} />,
};

export default tagIcons;

export function TagIcon({ name }: { name: string }) {
    // @ts-ignore
    const icon = tagIcons[name];
    if (!icon) return null;

    return icon;
}

import { GameVersionReleaseType } from "../types";

export interface GameVersion {
    label: string;
    value: string;
    releaseType: GameVersionReleaseType;
    major: boolean;
}

const GAME_VERSIONS: GameVersion[] = [
    {
        label: "0.3.1",
        value: "0.3.1-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.3",
        value: "0.3.0-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.2.5",
        value: "0.2.5-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.2.4",
        value: "0.2.4-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.2.3",
        value: "0.2.3-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.2.2",
        value: "0.2.2-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.2.1",
        value: "0.2.1-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.2",
        value: "0.2.0-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.50",
        value: "0.1.50-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.49",
        value: "0.1.49-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.48",
        value: "0.1.48-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.47",
        value: "0.1.47-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.46",
        value: "0.1.46-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.45",
        value: "0.1.45-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.44",
        value: "0.1.44-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.43",
        value: "0.1.43-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.42",
        value: "0.1.42-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.41",
        value: "0.1.41-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.40",
        value: "0.1.40-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.39",
        value: "0.1.39-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.38",
        value: "0.1.38-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.37",
        value: "0.1.37-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.36",
        value: "0.1.36-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.35",
        value: "0.1.35-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.34",
        value: "0.1.34-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.33",
        value: "0.1.33-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.32",
        value: "0.1.32-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.31",
        value: "0.1.31-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.30",
        value: "0.1.30-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.29",
        value: "0.1.29-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.28",
        value: "0.1.28-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.27",
        value: "0.1.27-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.26",
        value: "0.1.26-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.25",
        value: "0.1.25-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.24",
        value: "0.1.24-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.23",
        value: "0.1.23-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.22",
        value: "0.1.22-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.21",
        value: "0.1.21-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.20",
        value: "0.1.20-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.19",
        value: "0.1.19-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.18",
        value: "0.1.18-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.17",
        value: "0.1.17-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.16",
        value: "0.1.16-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.15",
        value: "0.1.15-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.14",
        value: "0.1.14-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.13",
        value: "0.1.13-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.12",
        value: "0.1.12-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.11",
        value: "0.1.11-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.10",
        value: "0.1.10-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.9",
        value: "0.1.9-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.8",
        value: "0.1.8-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.7",
        value: "0.1.7-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.6",
        value: "0.1.6-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.5",
        value: "0.1.5-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.4",
        value: "0.1.4-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.3",
        value: "0.1.3-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.2",
        value: "0.1.2-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
    {
        label: "0.1.1",
        value: "0.1.1-pre-alpha",
        releaseType: GameVersionReleaseType.PRE_ALPHA,
        major: false,
    },
];
export default GAME_VERSIONS;

export const getGameVersionFromLabel = (label: string): GameVersion | null => {
    return GAME_VERSIONS.find((version) => version.label === label) || null;
};

export const getGameVersionFromValue = (value: string): GameVersion | null => {
    return GAME_VERSIONS.find((version) => version.value === value) || null;
};

export const getGameVersionsFromLabels = (labels: string[]): GameVersion[] => {
    return labels.map((label) => getGameVersionFromLabel(label)).filter((version) => version !== null) as GameVersion[];
};

export const getGameVersionsFromValues = (values: string[]): GameVersion[] => {
    return values.map((value) => getGameVersionFromValue(value)).filter((version) => version !== null) as GameVersion[];
};

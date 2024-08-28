import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: string;
};

export enum ThemeOptions {
    LIGHT = "light",
    DARK = "dark",
}

export interface UseThemeProps {
    themes?: string[];
    setTheme: (value: string | ((theme: string | undefined) => string)) => void;
    theme?: string | undefined;
}

export interface DependencyProjectData {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    type: string[];
}

export interface DependencyVersionData {
    id: string;
    title: string;
    versionNumber: string;
    slug: string;
}

export interface DependencyData {
    projects: DependencyProjectData[];
    versions: DependencyVersionData[];
}
import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: string;
};

export enum ThemeOptions {
    LIGHT = "light",
    DARK = "dark",
    SYSTEM = "system",
}

export interface UseThemeProps {
    themes?: string[];
    setTheme: (value: string | ((theme: string | undefined) => string)) => void;
    theme?: ThemeOptions;
}

export enum LoadingStatus {
    LOADING = "loading",
    LOADED = "loaded",
    FAILED = "failed",
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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type AwaitedReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
    ? U
    : // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      T extends (...args: any) => infer U
      ? U
      : never;

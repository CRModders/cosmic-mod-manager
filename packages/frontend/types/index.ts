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

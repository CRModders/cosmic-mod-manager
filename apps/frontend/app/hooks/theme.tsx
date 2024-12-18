import { ThemeOptions, type UseThemeProps } from "@app/components/types";
import { getCookie, setCookie } from "@app/utils/cookie";
import React, { useContext, useEffect } from "react";

const MEDIA = "(prefers-color-scheme: dark)";
export const ThemeContext = React.createContext<UseThemeProps | undefined>(undefined);
const themes = [ThemeOptions.DARK, ThemeOptions.LIGHT];

export function ThemeProvider({ children, initTheme }: { children: React.ReactNode; initTheme: ThemeOptions }): React.ReactNode {
    const context = React.useContext(ThemeContext);

    // Ignore nested context providers, just passthrough children
    if (context) return children;
    return <Theme initTheme={initTheme}>{children}</Theme>;
}

function Theme({ children, initTheme, storageKey = "theme" }: { children: React.ReactNode; initTheme: ThemeOptions; storageKey?: string }) {
    const [theme, setThemeState] = React.useState<string>(initTheme);

    const applyTheme = React.useCallback((theme: string) => {
        let resolved = theme;
        if (!resolved) return;

        // If theme is system, resolve it before setting theme
        if (theme === "system") {
            resolved = getSystemTheme();
        }

        const elem = document.documentElement;

        for (const theme_name of themes) {
            elem?.classList.remove(theme_name);
        }

        if (resolved) elem?.classList.add(resolved);
    }, []);

    const setTheme = React.useCallback(
        (value: string | ((theme: string | undefined) => string)) => {
            const newTheme = typeof value === "function" ? value(theme) : value;
            setThemeState(newTheme);

            try {
                setCookie(storageKey, newTheme);
            } catch {}
        },
        [theme],
    );

    useEffect(() => {
        const media = window.matchMedia(MEDIA);

        const handleMediaQuery = (e: MediaQueryList | MediaQueryListEvent) => {
            const newTheme = e.matches ? ThemeOptions.DARK : ThemeOptions.LIGHT;
            applyTheme(newTheme);
        };

        // Intentionally use deprecated listener methods to support iOS & old browsers
        media.addEventListener("change", handleMediaQuery);
        handleMediaQuery(media);

        return () => media.removeEventListener("change", handleMediaQuery);
    }, []);

    useEffect(() => {
        if (!theme) return;
        applyTheme(theme);

        if (!getTheme(storageKey)) {
            setTheme(theme);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

// Helpers
function getTheme(key: string, fallback?: string) {
    let theme: string | undefined;
    try {
        theme = getCookie(key, document.cookie) || undefined;
    } catch (e) {
        // Unsupported
    }
    return theme || fallback;
}

function getSystemTheme(e?: MediaQueryList | MediaQueryListEvent) {
    const event = e ? e : window.matchMedia(MEDIA);
    const isDark = event.matches;
    const systemTheme = isDark ? ThemeOptions.DARK : ThemeOptions.LIGHT;
    return systemTheme;
}

const defaultContext: UseThemeProps = { setTheme: (_) => {}, themes: [] };
export default function useTheme() {
    return useContext(ThemeContext) || defaultContext;
}

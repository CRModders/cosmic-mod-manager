import { ThemeOptions, type UseThemeProps } from "@/types";
import React, { useContext, useEffect } from "react";

const MEDIA = "(prefers-color-scheme: dark)";
export const ThemeContext = React.createContext<UseThemeProps | undefined>(undefined);
const themes = [ThemeOptions.DARK, ThemeOptions.LIGHT];

export const ThemeProvider = ({ children }: { children: React.ReactNode }): React.ReactNode => {
    const context = React.useContext(ThemeContext);

    // Ignore nested context providers, just passthrough children
    if (context) return children;
    return <Theme>{children}</Theme>;
};

const Theme = ({ children, storageKey = "theme" }: { children: React.ReactNode; storageKey?: string }) => {
    const [theme, setThemeState] = React.useState(() => getTheme(storageKey, ThemeOptions.DARK));

    const applyTheme = React.useCallback((theme: string) => {
        let resolved = theme;
        if (!resolved) return;

        // If theme is system, resolve it before setting theme
        if (theme === "system") {
            resolved = getSystemTheme();
        }

        const doc = document.documentElement;

        for (const theme_name of themes) {
            doc.classList.remove(theme_name);
        }

        if (resolved) doc.classList.add(resolved);
    }, []);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const setTheme = React.useCallback(
        (value: string | ((theme: string | undefined) => string)) => {
            const newTheme = typeof value === "function" ? value(theme) : value;
            setThemeState(newTheme);

            // Save to storage
            try {
                localStorage.setItem(storageKey, newTheme);
            } catch (e) {
                // Unsupported
            }
        },
        [theme],
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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

    // localStorage event handling
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key !== storageKey) {
                return;
            }

            // If default theme is set, use it if localstorage === null (happens on local storage manual deletion)
            const newTheme = e.newValue || ThemeOptions.DARK;
            setTheme(newTheme);
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [setTheme]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        applyTheme(theme ? theme : ThemeOptions.DARK);
    }, [theme]);

    const providerValue = React.useMemo(
        () => ({
            theme,
            setTheme,
        }),
        [theme, setTheme],
    );

    return <ThemeContext.Provider value={providerValue}>{children}</ThemeContext.Provider>;
};

// Helpers

const getTheme = (key: string, fallback?: string) => {
    let theme: string | undefined;
    try {
        theme = localStorage.getItem(key) || undefined;
    } catch (e) {
        // Unsupported
    }
    return theme || fallback;
};

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent) => {
    const event = e ? e : window.matchMedia(MEDIA);
    const isDark = event.matches;
    const systemTheme = isDark ? ThemeOptions.DARK : ThemeOptions.LIGHT;
    return systemTheme;
};

// USE-THEME HOOK EXPORT
const defaultContext: UseThemeProps = { setTheme: (_) => {}, themes: [] };
const useTheme = () => useContext(ThemeContext) || defaultContext;
export default useTheme;

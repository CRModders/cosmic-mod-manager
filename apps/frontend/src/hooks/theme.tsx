import type { UseThemeProps } from "@/types";
import { useContext } from "react";
import { ThemeContext } from "../providers/theme-provider";

const defaultContext: UseThemeProps = { setTheme: (_) => {}, themes: [] };

const useTheme = () => useContext(ThemeContext) ?? defaultContext;

export default useTheme;

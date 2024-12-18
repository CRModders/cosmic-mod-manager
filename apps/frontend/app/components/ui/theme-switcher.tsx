import DefaultThemeSwitch from "@app/components/ui/theme-switcher";
import useTheme from "~/hooks/theme";

type Props = Omit<React.ComponentProps<typeof DefaultThemeSwitch>, "theme" | "setTheme">;

export default function ThemeSwitch(props: Props) {
    const { theme, setTheme } = useTheme();

    return <DefaultThemeSwitch {...props} theme={theme} setTheme={setTheme} />;
}

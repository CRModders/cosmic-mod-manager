import { setCookie } from "@root/utils";
import { disableInteractions } from "@root/utils/dom";
import { useLocation, useNavigate } from "react-router";
import RefreshPage from "~/components/refresh-page";
import { CardContent, CardDescription, CardHeader, CardTitle, SectionCard } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { useRootData } from "~/hooks/root-data";
import { useTranslation } from "~/locales/provider";

export default function PreferencesPage() {
    const { t } = useTranslation();
    const data = useRootData();

    const navigate = useNavigate();
    const location = useLocation();

    function toggleViewTransitions(checked: boolean) {
        disableInteractions();
        setCookie("viewTransitions", `${checked}`);

        setTimeout(() => {
            RefreshPage(navigate, location);
        }, 100);
    }

    return (
        <>
            <SectionCard className="w-full">
                <CardHeader>
                    <CardTitle>{t.settings.toggleFeatures}</CardTitle>
                    <CardDescription>{t.settings.enableOrDisableFeatures}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full flex items-center justify-between gap-x-6 gap-y-1">
                        <label htmlFor="view-transitions" className="basis-[min-content] grow shrink-[2]">
                            <span className="block text-lg font-bold text-foreground my-0">{t.settings.viewTransitions}</span>
                            <span className="block text-muted-foreground my-0">{t.settings.viewTransitionsDesc}</span>
                        </label>
                        <Switch id="view-transitions" checked={data?.viewTransitions} onCheckedChange={toggleViewTransitions} />
                    </div>
                </CardContent>
            </SectionCard>
        </>
    );
}

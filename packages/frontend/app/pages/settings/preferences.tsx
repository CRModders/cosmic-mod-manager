import { useLocation, useNavigate, useRouteLoaderData } from "react-router";
import { setCookie } from "@root/utils";
import { disableInteractions } from "@root/utils/dom";
import RefreshPage from "~/components/refresh-page";
import { CardContent, CardDescription, CardHeader, CardTitle, SectionCard } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import type { RootOutletData } from "~/root";

export default function PreferencesPage() {
    const data = useRouteLoaderData<RootOutletData>("root");
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
                    <CardTitle>Toggle features</CardTitle>
                    <CardDescription>Enable or disable certain features on this device.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full flex items-center justify-between gap-x-6 gap-y-1">
                        <label htmlFor="view-transitions" className="basis-[min-content] grow shrink-[2]">
                            <span className="block text-lg font-bold text-foreground my-0">View Transitions</span>
                            <span className="block text-muted-foreground my-0">
                                Enables transitions (morph and crossfade) when navigating between pages.
                            </span>
                        </label>
                        <Switch id="view-transitions" checked={data?.viewTransitions} onCheckedChange={toggleViewTransitions} />
                    </div>
                </CardContent>
            </SectionCard>
        </>
    );
}

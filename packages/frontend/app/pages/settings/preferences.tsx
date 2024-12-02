import { useRouteLoaderData } from "@remix-run/react";
import { setCookie } from "@root/utils";
import { CardContent, CardDescription, CardHeader, CardTitle, SectionCard } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import type { RootOutletData } from "~/root";

export default function PreferencesPage() {
    const data = useRouteLoaderData<RootOutletData>("root");

    function refresh() {
        window.location.reload();
    }

    function toggleViewTransitions(checked: boolean) {
        setCookie("viewTransitions", `${checked}`);
        refresh();
    }

    return (
        <>
            <SectionCard className="w-full">
                <CardHeader>
                    <CardTitle>Toggle features</CardTitle>
                    <CardDescription>Enable or disable certain features on this device. (Needs a page refresh)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full flex items-center justify-between gap-x-6 gap-y-1">
                        <label htmlFor="view-transitions" className="basis-[min-content] grow shrink-[2]">
                            <span className="block text-lg font-bold text-foreground my-0">View Transitions</span>
                            <span className="block text-muted-foreground my-0">
                                Enables image transitions when navigating between pages.
                            </span>
                        </label>
                        <Switch id="view-transitions" checked={data?.viewTransitions} onCheckedChange={toggleViewTransitions} />
                    </div>
                </CardContent>
            </SectionCard>
        </>
    );
}

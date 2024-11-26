import { Navigate, Outlet, useLocation, useOutletContext } from "@remix-run/react";
import { MonitorSmartphoneIcon, UserIcon } from "lucide-react";
import { Panel, PanelAside, PanelAsideNavCard, PanelContent } from "~/components/layout/panel";
import { ButtonLink } from "~/components/ui/link";
import type { RootOutletData } from "~/root";

export default function SettingsPageLayout() {
    const context = useOutletContext<RootOutletData>();
    const location = useLocation();

    if (location.pathname === "/settings") {
        return <Navigate to="/settings/account" replace />;
    }

    return (
        <Panel>
            <PanelAside className="gap-2">
                <PanelAsideNavCard label="Settings">
                    <ButtonLink url="/settings/account" preventScrollReset>
                        <UserIcon className="size-4" />
                        Account
                    </ButtonLink>
                    <ButtonLink url="/settings/sessions" preventScrollReset>
                        <MonitorSmartphoneIcon className="size-4" />
                        Sessions
                    </ButtonLink>
                </PanelAsideNavCard>
            </PanelAside>
            <PanelContent>
                <Outlet
                    context={
                        {
                            ...context,
                        } satisfies RootOutletData
                    }
                />
            </PanelContent>
        </Panel>
    );
}

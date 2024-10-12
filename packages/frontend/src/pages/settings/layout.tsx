import { Panel, PanelAside, PanelAsideNavCard, PanelContent } from "@/components/layout/panel";
import { ButtonLink } from "@/components/ui/link";
import { SITE_NAME_SHORT } from "@shared/config";
import { MonitorSmartphone, UserIcon } from "lucide-react";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";
import { RedirectIfNotLoggedIn } from "../auth/guards";

const SettingsPageLayout = () => {
    return (
        <>
            <Helmet>
                <title>Settings | {SITE_NAME_SHORT}</title>
                <meta name="description" content="Settings" />
            </Helmet>

            <RedirectIfNotLoggedIn redirectTo="/login" />

            <main className="w-full">
                <Panel>
                    <PanelAside className="gap-2">
                        <PanelAsideNavCard label="Settings">
                            <ButtonLink url="/settings/account">
                                <UserIcon className="size-4" />
                                Account
                            </ButtonLink>
                            <ButtonLink url="/settings/sessions">
                                <MonitorSmartphone className="size-4" />
                                Sessions
                            </ButtonLink>
                        </PanelAsideNavCard>
                    </PanelAside>
                    <PanelContent>
                        <Outlet />
                    </PanelContent>
                </Panel>
            </main>
        </>
    );
};

export const Component = SettingsPageLayout;

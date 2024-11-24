import { Panel, PanelAside, PanelAsideNavCard, PanelContent } from "@/components/layout/panel";
import { ButtonLink } from "@/components/ui/link";
import { SITE_NAME_LONG } from "@shared/config";
import { MonitorSmartphoneIcon, UserIcon } from "lucide-react";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router";
import { RedirectIfNotLoggedIn } from "../auth/guards";

const SettingsPageLayout = () => {
    return (
        <>
            <Helmet>
                <title>Settings | {SITE_NAME_LONG}</title>
                <meta name="description" content="Settings" />
            </Helmet>

            <RedirectIfNotLoggedIn redirectTo="/login" />

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
                    <Outlet />
                </PanelContent>
            </Panel>
        </>
    );
};

export const Component = SettingsPageLayout;

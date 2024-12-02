import { Outlet, useOutletContext } from "@remix-run/react";
import { MonitorSmartphoneIcon, PaintbrushIcon, UserIcon } from "lucide-react";
import { Panel, PanelAside, PanelAsideNavCard, PanelContent } from "~/components/layout/panel";
import { ButtonLink } from "~/components/ui/link";
import type { RootOutletData } from "~/root";

export default function SettingsPageLayout() {
    const context = useOutletContext<RootOutletData>();

    return (
        <main className="w-full">
            <Panel>
                <PanelAside className="gap-2" aside>
                    <PanelAsideNavCard label="Settings">
                        <ButtonLink url="/settings" preventScrollReset>
                            <PaintbrushIcon className="size-4" />
                            Preferences
                        </ButtonLink>
                        {context.session?.id ? (
                            <>
                                <ButtonLink url="/settings/account" preventScrollReset>
                                    <UserIcon className="size-4" />
                                    Account
                                </ButtonLink>
                                <ButtonLink url="/settings/sessions" preventScrollReset>
                                    <MonitorSmartphoneIcon className="size-4" />
                                    Sessions
                                </ButtonLink>
                            </>
                        ) : null}
                    </PanelAsideNavCard>
                </PanelAside>
                <PanelContent>
                    <Outlet context={context satisfies RootOutletData} />
                </PanelContent>
            </Panel>
        </main>
    );
}

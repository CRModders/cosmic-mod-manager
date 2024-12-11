import { MonitorSmartphoneIcon, PaintbrushIcon, ShieldIcon, UserIcon } from "lucide-react";
import { Outlet } from "react-router";
import { Panel, PanelAside, PanelAsideNavCard, PanelContent } from "~/components/layout/panel";
import { ButtonLink } from "~/components/ui/link";
import { useSession } from "~/hooks/session";

export default function SettingsPageLayout() {
    const session = useSession();

    return (
        <main className="w-full">
            <Panel>
                <PanelAside className="gap-2" aside>
                    <PanelAsideNavCard label="Settings">
                        <ButtonLink url="/settings" prefetch="render" preventScrollReset>
                            <PaintbrushIcon className="size-4" />
                            Preferences
                        </ButtonLink>
                        {session?.id ? (
                            <>
                                <span className="text-lg font-semibold mt-3">Account</span>
                                <ButtonLink url="/settings/profile" prefetch="render" preventScrollReset>
                                    <UserIcon className="size-4" />
                                    Public profile
                                </ButtonLink>
                                <ButtonLink url="/settings/account" preventScrollReset>
                                    <ShieldIcon className="size-4" />
                                    Account and security
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
                    <Outlet />
                </PanelContent>
            </Panel>
        </main>
    );
}

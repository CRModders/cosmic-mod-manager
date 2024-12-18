import { Panel, PanelAside, PanelAsideNavCard, PanelContent } from "@app/components/misc/panel";
import { ButtonLink } from "@app/components/ui/link";
import { MonitorSmartphoneIcon, PaintbrushIcon, ShieldIcon, UserIcon } from "lucide-react";
import { Outlet } from "react-router";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";

export default function SettingsPageLayout() {
    const session = useSession();
    const { t } = useTranslation();

    return (
        <main className="w-full">
            <Panel>
                <PanelAside className="gap-2" aside>
                    <PanelAsideNavCard label="Settings">
                        <ButtonLink url="/settings" prefetch="render" preventScrollReset>
                            <PaintbrushIcon className="size-4" />
                            {t.settings.preferences}
                        </ButtonLink>
                        {session?.id ? (
                            <>
                                <span className="text-lg font-semibold mt-3">Account</span>
                                <ButtonLink url="/settings/profile" prefetch="render" preventScrollReset>
                                    <UserIcon className="size-4" />
                                    {t.settings.publicProfile}
                                </ButtonLink>
                                <ButtonLink url="/settings/account" preventScrollReset>
                                    <ShieldIcon className="size-4" />
                                    {t.settings.accountAndSecurity}
                                </ButtonLink>
                                <ButtonLink url="/settings/sessions" preventScrollReset>
                                    <MonitorSmartphoneIcon className="size-4" />
                                    {t.settings.sessions}
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

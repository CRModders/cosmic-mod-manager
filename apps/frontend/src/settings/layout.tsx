import { DevicesIcon, PersonIcon } from "@/components/icons";
import "@/src/globals.css";
import { PanelContent, PanelLayout, SidePanel, SidepanelLink } from "@/components/panel-layout";
import React from "react";
import { Outlet } from "react-router-dom";

export default function SettingsPageLayout() {
    const baseUrlPrefix = "/settings";

    const SidePanelLinks = [
        {
            name: "Account",
            href: `${baseUrlPrefix}/account`,
            icon: <PersonIcon className="w-4 h-4" strokeWidth={3} />,
        },
        {
            name: "Sessions",
            href: `${baseUrlPrefix}/sessions`,
            icon: <DevicesIcon size="1.15rem" strokeWidth={2.5} />,
        },
    ];

    return (
        <div className="w-full pb-32">
            <PanelLayout>
                <SidePanel>
                    <div className="w-full">
                        <h1 className="w-full px-1 text-3xl font-semibold mb-4 text-foreground-muted">Settings</h1>
                        <ul className="w-full flex flex-col items-start justify-center gap-1">
                            {SidePanelLinks?.map((link) => {
                                return (
                                    <React.Fragment key={link.href}>
                                        <SidepanelLink href={link.href} label={link.name} icon={link.icon} />
                                    </React.Fragment>
                                );
                            })}
                        </ul>
                    </div>
                </SidePanel>
                <PanelContent>
                    <Outlet />
                </PanelContent>
            </PanelLayout>
        </div>
    );
}

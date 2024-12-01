import { Outlet } from "@remix-run/react";
import { CopyrightIcon, HeartHandshakeIcon, LockIcon, ScaleIcon, ShieldIcon } from "lucide-react";
import { Panel, PanelAside, PanelAsideNavCard, PanelContent } from "~/components/layout/panel";
import { ButtonLink } from "~/components/ui/link";

export default function LegalPageLayout() {
    return (
        <main className="w-full">
            <Panel className="pb-12">
                <PanelAside aside>
                    <PanelAsideNavCard label="Legal">
                        {links.map((link) => (
                            <ButtonLink url={link.href} key={link.href} className="relative" preventScrollReset>
                                {link.icon}
                                {link.name}
                            </ButtonLink>
                        ))}
                    </PanelAsideNavCard>
                </PanelAside>
                <PanelContent main>
                    <Outlet />
                </PanelContent>
            </Panel>
        </main>
    );
}

const links = [
    {
        name: "Terms of Use",
        href: "/legal/terms",
        icon: <HeartHandshakeIcon size="1rem" />,
    },
    {
        name: "Content Rules",
        href: "/legal/rules",
        icon: <ScaleIcon size="1rem" />,
    },
    {
        name: "Copyright Policy",
        href: "/legal/copyright",
        icon: <CopyrightIcon size="1rem" />,
    },
    {
        name: "Security Notice",
        href: "/legal/security",
        icon: <ShieldIcon size="1rem" />,
    },
    {
        name: "Privacy Policy",
        href: "/legal/privacy",
        icon: <LockIcon size="1rem" />,
    },
];

import { PageUrl } from "@root/utils/urls";
import { CopyrightIcon, HeartHandshakeIcon, LockIcon, ScaleIcon, ShieldIcon } from "lucide-react";
import { Outlet } from "react-router";
import { Panel, PanelAside, PanelAsideNavCard, PanelContent } from "~/components/layout/panel";
import { ButtonLink } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";

export default function LegalPageLayout() {
    const { t } = useTranslation();
    const legal = t.legal;

    const links = [
        {
            name: legal.termsTitle,
            href: "/legal/terms",
            icon: <HeartHandshakeIcon size="1rem" />,
        },
        {
            name: legal.rulesTitle,
            href: "/legal/rules",
            icon: <ScaleIcon size="1rem" />,
        },
        {
            name: legal.copyrightPolicyTitle,
            href: "/legal/copyright",
            icon: <CopyrightIcon size="1rem" />,
        },
        {
            name: legal.securityNoticeTitle,
            href: "/legal/security",
            icon: <ShieldIcon size="1rem" />,
        },
        {
            name: legal.privacyPolicyTitle,
            href: "/legal/privacy",
            icon: <LockIcon size="1rem" />,
        },
    ];

    return (
        <Panel className="pb-12">
            <PanelAside aside>
                <PanelAsideNavCard label="Legal">
                    {links.map((link) => (
                        <ButtonLink prefetch="render" url={PageUrl(link.href)} key={link.href} className="relative" preventScrollReset>
                            {link.icon}
                            <span className="text-wrap leading-tight">{link.name}</span>
                        </ButtonLink>
                    ))}
                </PanelAsideNavCard>
            </PanelAside>
            <PanelContent main>
                <Outlet />
            </PanelContent>
        </Panel>
    );
}

export const descriptionSuffix = "an open source modding platform focused on Cosmic Reach";

import type { LinkProps } from "@remix-run/react";
import { SITE_NAME_LONG } from "@shared/config";
import { Settings2Icon } from "lucide-react";
import { BrandIcon } from "~/components/icons";
import Link, { VariantButtonLink } from "~/components/ui/link";
import ThemeSwitch from "../ui/theme-switcher";
import "./styles.css";

export default function Footer() {
    return (
        <footer className="w-full bg-card-background dark:bg-card-background/35 mt-24 pt-20 pb-16 mx-auto">
            <div className="footer-grid container gap-y-5">
                <LinksColumn area="logo">
                    <span className="flex gap-2 items-center justify-center text-[1.72rem] font-bold leading-none" title={SITE_NAME_LONG}>
                        <BrandIcon size="2.75rem" aria-label="CRMM Logo" />
                        CRMM
                    </span>
                </LinksColumn>

                <LinksColumn area="links-1">
                    <Title>Company</Title>

                    <FooterLink to="/legal/terms" aria-label="Terms and conditions">
                        Terms
                    </FooterLink>

                    <FooterLink to="/legal/privacy" aria-label="Privacy Policy">
                        Privacy
                    </FooterLink>

                    <FooterLink to="/legal/rules" aria-label="Content Rules">
                        Rules
                    </FooterLink>
                </LinksColumn>

                <LinksColumn area="links-2">
                    <Title>Resources</Title>

                    <FooterLink to="https://docs.crmm.tech" aria-label="Docs" target="_blank">
                        Docs
                    </FooterLink>

                    <FooterLink to="/status" aria-label="Status">
                        Status
                    </FooterLink>

                    <FooterLink to="mailto:support@crmm.tech" aria-label="Support" target="_blank">
                        Support
                    </FooterLink>
                </LinksColumn>

                <LinksColumn area="links-3">
                    <Title>Socials</Title>
                    <FooterLink to="/about" aria-label="About">
                        About
                    </FooterLink>

                    <FooterLink to="https://github.com/CRModders/cosmic-mod-manager" aria-label="GitHub Repo" target="_blank">
                        Github
                    </FooterLink>

                    <FooterLink to="https://discord.gg/T2pFVHmFpH" aria-label="Discord Invite" target="_blank">
                        Discord
                    </FooterLink>
                </LinksColumn>

                <div style={{ gridArea: "buttons" }} className="grid grid-cols-1 h-fit gap-2 place-items-center lg:place-items-start">
                    <ThemeSwitch
                        // className="pl-1 bg-shallow-background dark:bg-shallow-background/70 hover:bg-shallow-background/70 hover:dark:bg-shallow-background gap-0"
                        label="Change theme"
                        noDefaultStyle
                        variant="outline"
                        className="rounded-full px-1 gap-0"
                    />

                    <VariantButtonLink url="/settings" variant="outline" className="rounded-full">
                        <Settings2Icon className="w-btn-icon-md h-btn-icon-md" />
                        Settings
                    </VariantButtonLink>
                </div>
            </div>
        </footer>
    );
}

function Title({ children }: { children: React.ReactNode }) {
    return <h4 className="text-foreground-bright font-bold">{children}</h4>;
}

function FooterLink({ children, ...props }: LinkProps) {
    return (
        <Link
            {...props}
            prefetch="viewport"
            className="w-fit flex items-center justify-center lg:justify-start gap-2 leading-none text-muted-foreground hover:text-foreground hover:underline"
        >
            {children}
        </Link>
    );
}

function LinksColumn({ children, area }: { area: string; children: React.ReactNode }) {
    return (
        <div style={{ gridArea: area }} className="grid gap-4 h-fit lg:mr-16 place-items-center lg:place-items-start">
            {children}
        </div>
    );
}

import { Link } from "react-router-dom";
import { BrandIcon, DiscordIcon, GithubIcon } from "../icons";
import { DotSeparator } from "../ui/separator";
import ThemeSwitch from "../ui/theme-switcher";

const Footer = () => {
    return (
        <div className="w-full bg-card-background py-8 mt-12">
            <div className="container flex items-center justify-between flex-wrap gap-3">
                <span className="flex gap-2 items-center justify-center text-lg font-bold">
                    <BrandIcon size="2rem" />
                    CRMM
                </span>

                <div className="flex items-center justify-center gap-3 flex-wrap">
                    <FooterLink href="https://docs.crmm.tech">Docs</FooterLink>

                    <DotSeparator />

                    <FooterLink href="https://github.com/CRModders/cosmic-mod-manager">
                        <GithubIcon />
                        GitHub
                    </FooterLink>

                    <DotSeparator />

                    <FooterLink href="https://discord.gg/T2pFVHmFpH">
                        <DiscordIcon className="fill-current dark:fill-current" />
                        Discord
                    </FooterLink>
                </div>

                <div className="flex flex-col items-end justify-center gap-2">
                    <ThemeSwitch
                        className="pl-1 bg-shallow-background dark:bg-shallow-background/70 hover:bg-shallow-background/70 hover:dark:bg-shallow-background gap-0"
                        label="Change theme"
                    />
                </div>
            </div>
        </div>
    );
};

export default Footer;

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    return (
        <Link
            to={href}
            target="_blank"
            className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:underline"
        >
            {children}
        </Link>
    );
};

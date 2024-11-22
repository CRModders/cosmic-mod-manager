import { Link, type LinkProps } from "react-router-dom";
import { BrandIcon, DiscordIcon, GithubIcon } from "../icons";
import { DotSeparator } from "../ui/separator";
import ThemeSwitch from "../ui/theme-switcher";

const Footer = () => {
    return (
        <footer className="w-full bg-card-background py-8 mt-12">
            <div className="container flex items-center justify-between flex-wrap gap-x-5 gap-y-2">
                <span className="flex gap-2 items-center justify-center text-lg font-bold">
                    <BrandIcon size="2rem" aria-label="CRMM Logo" />
                    CRMM
                </span>

                <div className="flex items-center justify-center gap-3 flex-wrap">
                    <FooterLink to="https://docs.crmm.tech" aria-label="CRMM Docs">
                        Docs
                    </FooterLink>

                    <DotSeparator />

                    <FooterLink to="https://github.com/CRModders/cosmic-mod-manager" aria-label="GitHub Repo">
                        <GithubIcon />
                        GitHub
                    </FooterLink>

                    <DotSeparator />

                    <FooterLink to="https://discord.gg/T2pFVHmFpH" aria-label="Discord Invite">
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
        </footer>
    );
};

export default Footer;

const FooterLink = ({ children, ...props }: LinkProps) => {
    return (
        <Link
            {...props}
            target="_blank"
            className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:underline"
        >
            {children}
        </Link>
    );
};

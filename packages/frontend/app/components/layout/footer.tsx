import { cn, setCookie } from "@root/utils";
import { SITE_NAME_LONG, SITE_NAME_SHORT } from "@shared/config";
import { ArrowUpRightIcon, GlobeIcon, Settings2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { type LinkProps, useLocation } from "react-router";
import { BrandIcon } from "~/components/icons";
import Link, { useNavigate, VariantButtonLink } from "~/components/ui/link";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useRootData } from "~/hooks/root-data";
import { formatLocaleCode, parseLocale } from "~/locales";
import SupportedLocales from "~/locales/meta";
import { formatUrlWithLocalePrefix, useTranslation } from "~/locales/provider";
import { buttonVariants } from "../ui/button";
import { DotSeparator } from "../ui/separator";
import ThemeSwitch from "../ui/theme-switcher";

export default function Footer() {
    const { t, changeLocale } = useTranslation();
    const footer = t.footer;
    const legal = t.legal;

    // Just to trigger a re-render when the url changes to keep the locale in sync
    useLocation();

    return (
        <footer className="w-full bg-card-background dark:bg-card-background/35 mt-24 pt-20 pb-8 mx-auto">
            <div className="footer-grid container gap-y-5 pb-16">
                <LinksColumn area="logo">
                    <span className="flex gap-2 items-center justify-center text-[1.72rem] font-bold leading-none" title={SITE_NAME_LONG}>
                        <BrandIcon size="2.75rem" aria-label="CRMM Logo" />
                        CRMM
                    </span>
                </LinksColumn>

                <LinksColumn area="links-1">
                    <Title>{footer.company}</Title>

                    <FooterLink to="/legal/terms" aria-label={t.legal.termsTitle}>
                        {footer.terms}
                    </FooterLink>

                    <FooterLink to="/legal/privacy" aria-label={legal.privacyPolicyTitle}>
                        {footer.privacy}
                    </FooterLink>

                    <FooterLink to="/legal/rules" aria-label={legal.rulesTitle}>
                        {footer.rules}
                    </FooterLink>
                </LinksColumn>

                <LinksColumn area="links-2">
                    <Title>{footer.resources}</Title>

                    <FooterLink to="https://docs.crmm.tech" aria-label={footer.docs} target="_blank">
                        {footer.docs}
                        <ArrowUpRightIcon className="w-4 h-4 text-extra-muted-foreground inline" />
                    </FooterLink>

                    <FooterLink to="/status" aria-label={footer.status}>
                        {footer.status}
                    </FooterLink>

                    <FooterLink to="mailto:support@crmm.tech" aria-label={footer.support} target="_blank">
                        {footer.support}
                        <ArrowUpRightIcon className="w-4 h-4 text-extra-muted-foreground inline" />
                    </FooterLink>
                </LinksColumn>

                <LinksColumn area="links-3">
                    <Title>{footer.socials}</Title>
                    <FooterLink to="/about" aria-label={footer.about}>
                        {footer.about}
                    </FooterLink>

                    <FooterLink to="https://github.com/CRModders/cosmic-mod-manager" aria-label="GitHub Repo" target="_blank">
                        Github
                        <ArrowUpRightIcon className="w-4 h-4 text-extra-muted-foreground inline" />
                    </FooterLink>

                    <FooterLink to="https://discord.gg/T2pFVHmFpH" aria-label="Discord Invite" target="_blank">
                        Discord
                        <ArrowUpRightIcon className="w-4 h-4 text-extra-muted-foreground inline" />
                    </FooterLink>
                </LinksColumn>

                <div style={{ gridArea: "buttons" }} className="grid grid-cols-1 h-fit gap-2 place-items-center lg:place-items-start">
                    <ThemeSwitch label={t.footer.changeTheme} noDefaultStyle variant="outline" className="rounded-full px-1 gap-0" />

                    <VariantButtonLink prefetch="render" url="/settings" variant="outline" className="rounded-full">
                        <Settings2Icon className="w-btn-icon-md h-btn-icon-md" />
                        {t.common.settings}
                    </VariantButtonLink>

                    <div className="">
                        <LangSwitcher />
                    </div>
                </div>
            </div>

            <div className="container flex flex-wrap items-center justify-start gap-x-3 gap-y-2 text-[small]">
                <span>{t.footer.siteOfferedIn(SITE_NAME_SHORT)}</span>

                {SupportedLocales.map((locale) => {
                    const region = locale.region;
                    const label = region ? `${locale.nativeName} (${region.displayName})` : locale.nativeName;

                    const formattedCode = formatLocaleCode(locale);

                    return (
                        <Link
                            key={formattedCode}
                            to={formatUrlWithLocalePrefix(locale)}
                            className="link_blue hover:underline"
                            aria-label={label}
                            title={label}
                            preventScrollReset
                            escapeUrlWrapper
                            onClick={() => {
                                setLocaleCookie(formattedCode);
                                changeLocale(formattedCode);
                            }}
                        >
                            {label}
                        </Link>
                    );
                })}
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
            className="w-fit flex items-center justify-center lg:justify-start gap-1 leading-none text-muted-foreground hover:text-foreground hover:underline"
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

export function LangSwitcher() {
    const ctx = useRootData();
    const { locale, changeLocale } = useTranslation();
    const [currLang, setCurrLang] = useState(formatLocaleCode(locale));
    const navigate = useNavigate(true);

    useEffect(() => {
        setCurrLang(formatLocaleCode(locale));
    }, [locale]);

    return (
        <Select
            onValueChange={(value: string) => {
                setLocaleCookie(parseLocale(value));
                changeLocale(value, navigate);
            }}
            value={currLang}
        >
            <SelectTrigger noDefaultStyles aria-label={currLang} className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}>
                <GlobeIcon size="1.15rem" className="text-muted-foreground" />
                <SelectValue className="flex items-center justify-start" placeholder={<p>{currLang}</p>} />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    {ctx.supportedLocales?.map((locale) => {
                        const region = locale.region;
                        const label = region ? `${locale.nativeName} (${region.displayName})` : locale.nativeName;

                        return (
                            <SelectItem
                                key={label}
                                value={formatLocaleCode(locale)}
                                aria-label={label}
                                title={`${label} => /${formatLocaleCode(locale)}`}
                            >
                                <div className="w-full flex items-center justify-center gap-1.5 break-words">
                                    <span className="flex items-end justify-center align-bottom">{locale.nativeName}</span>
                                    {region ? (
                                        <>
                                            <DotSeparator className="bg-extra-muted-foreground" />
                                            <span className="text-sm text-muted-foreground/85">{region.displayName}</span>
                                        </>
                                    ) : null}
                                </div>
                            </SelectItem>
                        );
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

function setLocaleCookie(locale: string) {
    setCookie("locale", locale);
}

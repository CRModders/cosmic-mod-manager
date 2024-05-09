import { getAvailableLocales, get_locale } from "@/lib/lang";
import getLangPref from "@/lib/server/getLangPref";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Suspense } from "react";
import { BrandIcon } from "../Icons";
import ThemeSwitch from "../Navbar/ThemeSwitch";
import socialLinks from "../Socials";
import LangSwitcher from "./LangSwitcher";
import SettingsButton from "./SettingsButton";
import styles from "./styles.module.css";

const Footer = () => {
	const currentLang = getLangPref();
	const locale_data = get_locale(currentLang);
	const locale = locale_data.content;
	const availableLocales = getAvailableLocales();
	const exploreLinks = [
		{
			label: locale.globals.mods,
			href: "/mods",
		},
		{
			label: locale.globals.resource_packs,
			href: "/resourcepacks",
		},
		{
			label: locale.globals.modpacks,
			href: "/modpacks",
		},
		{
			label: locale.globals.shaders,
			href: "/shaders",
		},
	];

	return (
		<footer className="w-full bg-zinc-100 dark:bg-zinc-800 py-8 flex flex-col items-center justify-center">
			<div className="w-full">
				<div className={`${styles.footer_content_container} container gap-8`}>
					<div className="flex flex-col items-start justify-center pr-4 col-span-2">
						<div className="flex flex-col items-start justify-center">
							<BrandIcon size="4rem" />
							<h2 className="text-xl font-semibold">{locale.globals.site.full_name}</h2>
						</div>
						<p className="text-foreground_muted dark:text-foreground_muted_dark">{locale.footer.site_desc}</p>
					</div>

					<div className="w-full flex flex-col items-start justify-start">
						<h2 className="text-xl mb-2">{locale.footer.socials}</h2>
						<ul className="w-full flex flex-col items-start justify-center m-0 p-0">
							{socialLinks.map((socialLink) => {
								return (
									<li key={socialLink.label} className="group">
										<Link
											href={socialLink.href}
											aria-label={socialLink.label}
											target="_blank"
											className="py-[0.1rem] flex items-center justify-center text-foreground_muted dark:text-foreground_muted_dark group-hover:text-foreground dark:group-hover:text-foreground_dark"
										>
											<socialLink.icon
												size="1rem"
												className="text-foreground_muted dark:text-foreground_muted_dark group-hover:text-foreground dark:group-hover:text-foreground_dark fill-foreground_muted dark:fill-foreground_muted_dark group-hover:fill-foreground dark:group-hover:fill-foreground_dark"
											/>
											<p className="h-full flex items-center justify-center ml-2 mr-1">{socialLink.label}</p>
											<ArrowTopRightIcon className="w-4 h-4" />
										</Link>
									</li>
								);
							})}
						</ul>
					</div>

					<div className="w-full flex flex-col items-start justify-start">
						<h2 className="text-xl mb-2">{locale.footer.explore}</h2>
						<ul className="w-full flex flex-col items-start justify-center m-0 p-0">
							{exploreLinks?.map((link) => {
								return (
									<li
										key={link.href}
										className="inline-block text-foreground_muted dark:text-foreground_muted_dark m-0 p-0 hover:text-foreground dark:hover:text-foreground_dark"
									>
										<Link href={link.href} aria-label={link.label} className="py-[0.1rem] inline-block">
											{link.label}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
					<div className="w-full flex flex-col items-start justify-start gap-1">
						<ThemeSwitch
							label={locale.footer.change_theme}
							iconWrapperClassName="h-10 w-10"
							className="hover:bg-transparent bg-background dark:hover:bg-transparent dark:bg-background_dark px-1 border border-shadow dark:border-zinc-600"
						/>
						<Suspense>
							<SettingsButton locale={locale} />
						</Suspense>

						<LangSwitcher locale={locale_data} availableLocales={availableLocales} />
					</div>
				</div>
			</div>
			<div className="w-full">
				<div className="container pt-8 sm:pt-4 flex items-center gap-4 text-foreground_muted dark:text-foreground_muted_dark">
					<p>{locale.footer.privacy_policy}</p>
					<p>{locale.footer.terms}</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import "@/app/globals.css";
import FeaturedSection from "@/components/Featured/Featured";
import { BrandIcon } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { extract_elems, get_locale } from "@/lib/lang";
import getLangPref from "@/lib/server/getLangPref";
import { cn } from "@/lib/utils";
import { Frijole } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import AuthButton from "./AuthButton";

const frijole = Frijole({
	weight: ["400"],
	subsets: ["latin"],
});

export default async function Home() {
	const langPref = getLangPref();
	const locale = get_locale(langPref).content;

	// The animation keyframes in "@/app/globals.css" need to be updated according to the number of items in the list
	const showcaseItems = [
		locale.globals.mods,
		locale.globals.resource_packs,
		locale.globals.modpacks,
		locale.globals.shaders,
		locale.globals.mods,
	];
	const extracted_desc = extract_elems(locale.home_page.hero.description.line_1);
	const home_page_locale = locale.home_page;

	return (
		<main className="w-full h-fit flex flex-col items-center justify-start pb-8">
			<section className="w-full min-h-[100vh] flex flex-col items-center justify-center container py-12">
				<BrandIcon size="16rem" className=" text-primary_accent dark:text-primary_accent_dark" />
				<div className="w-full flex flex-col items-center justify-center">
					<h1
						className={cn(
							"text-2xl lg:text-4xl text-center font-semibold text-foreground dark:text-foreground_dark",
							frijole.className,
						)}
					>
						{locale.globals.site.full_name}
					</h1>

					<h2 className="h-10 lg:h-14 mb-2 overflow-hidden">
						<span className="hero_section_showcase flex flex-col items-center justify-center">
							{showcaseItems?.map((item, index) => {
								return (
									<strong
										key={`${item}${
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											index
										}`}
										className={cn(
											"flex items-center justify-center h-10 lg:h-14 text-2xl lg:text-4xl font-bold bg-clip-text bg-primary_accent_text dark:bg-primary_accent_dark text-transparent bg-cover bg-gradient-to-b from-rose-200 to-primary_accent_text via-primary_accent dark:via-primary_accent_dark dark:to-primary_accent_dark leading-loose",
											frijole.className,
										)}
									>
										{item}
									</strong>
								);
							})}
						</span>
					</h2>

					<div className="flex flex-col items-center justify-center gap-2">
						<h2 className="w-full text-center flex flex-wrap items-center justify-center text-xl lg:text-2xl text-foreground_muted dark:text-foreground_muted_dark">
							{extracted_desc.strings[0]}{" "}
							<Link
								href="https://finalforeach.itch.io/cosmic-reach"
								target="_blank"
								aria-label={extracted_desc.links[0]}
								className="text-primary_accent_text dark:text-primary_accent_dark"
							>
								&nbsp;{extracted_desc.links[0]}&nbsp;
							</Link>{" "}
							{extracted_desc.strings[1]}
						</h2>
						<h2 className="text-xl lg:text-2xl flex text-center text-foreground_muted dark:text-foreground_muted_dark">
							{home_page_locale.hero.description.line_2}
						</h2>
					</div>
				</div>

				<div className="flex gap-4 md:gap-8 flex-wrap items-center justify-center mt-6">
					<Button
						className="bg-primary_accent dark:bg-primary_accent hover:bg-primary_accent/80 dark:hover:bg-primary_accent_dark/80 "
						size="md"
						aria-label="Explore mods"
					>
						<p className="text-foreground_dark dark:text-foreground_dark font-semibold text-base sm:text-md">
							{home_page_locale.hero.explore_mods}
						</p>
					</Button>

					<Suspense fallback={<Spinner />}>
						<AuthButton authLocale={locale.auth} />
					</Suspense>
				</div>
			</section>

			<section className="w-full flex flex-col gap-2 items-center justify-center">
				<FeaturedSection featuredSectionLocale={home_page_locale.featured_section} />
			</section>
		</main>
	);
}

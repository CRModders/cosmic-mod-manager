import Link from "next/link";
import { BrandIcon } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import FeaturedSection from "@/components/Featured/Featured";
import { Suspense } from "react";
import AuthButton from "./AuthButton";
import { Spinner } from "@/components/ui/spinner";
import "@/app/globals.css";

export default async function Home() {
	// The animation keyframes need to be updated according to the number of items in the list
	const showcaseItems = [
		"mods",
		"resource packs",
		"modpacks",
		"shaders",
		"mods",
	];

	return (
		<main className="w-full h-fit flex flex-col items-center justify-start">
			<section className="w-full min-h-[100dvh] flex flex-col items-center justify-center container py-12">
				<BrandIcon
					size="18rem"
					className=" text-primary_accent dark:text-primary_accent_dark"
				/>
				<div className="w-full flex flex-col items-center justify-center">
					<h1 className="text-3xl lg:text-5xl text-center font-semibold text-foreground dark:text-foreground_dark">
						Cosmic Reach Mod Manager
					</h1>

					<h2 className="h-14 lg:h-20 overflow-hidden mb-2">
						<span className="hero_section_showcase flex flex-col items-center justify-center gap-4 lg:gap-2 py-1 lg:py-1">
							{showcaseItems?.map((item) => {
								return (
									<strong
										key={item}
										className="flex items-center justify-center text-4xl h-10 lg:h-16 lg:text-5xl font-bold bg-clip-text bg-primary_accent_text dark:bg-primary_accent_dark text-transparent bg-cover bg-gradient-to-b from-rose-200 to-primary_accent_text via-primary_accent dark:via-primary_accent_dark dark:to-primary_accent_dark leading-loose"
									>
										{item}
									</strong>
								);
							})}
						</span>
					</h2>

					<div className="flex flex-col items-center justify-center gap-2">
						<h2 className="w-full text-center flex flex-wrap items-center justify-center text-xl lg:text-2xl text-foreground_muted dark:text-foreground_muted_dark">
							The best place for your{" "}
							<Link
								href="https://finalforeach.itch.io/cosmic-reach"
								target="_blank"
								className="text-primary_accent_text dark:text-primary_accent_text_dark"
							>
								&nbsp;Cosmic&nbsp;Reach&nbsp;
							</Link>{" "}
							mods.
						</h2>
						<h2 className="text-xl lg:text-2xl flex text-center text-foreground_muted dark:text-foreground_muted_dark">
							Discover, play, and create content, all in one spot.
						</h2>
					</div>
				</div>

				<div className="flex gap-4 md:gap-8 flex-wrap items-center justify-center mt-6">
					<Button
						className="bg-primary_accent dark:bg-primary_accent hover:bg-primary_accent/80 dark:hover:bg-primary_accent_dark/80"
						size="lg"
						aria-label="Explore mods"
					>
						<p className="text-foreground_dark dark:text-foreground_dark lg:text-lg">
							Explore Mods
						</p>
					</Button>

					<Suspense fallback={<Spinner />}>
						<AuthButton />
					</Suspense>
				</div>
			</section>

			<section className="w-full flex flex-col gap-2 items-center justify-center">
				<FeaturedSection />
			</section>
		</main>
	);
}

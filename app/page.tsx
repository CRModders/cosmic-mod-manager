import Link from "next/link";
import { BrandIcon } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import FeaturedSection from "@/components/Featured/Featured";
import { Suspense } from "react";
import AuthButton from "./AuthButton";
import { Spinner } from "@/components/ui/spinner";

export default async function Home() {
	return (
		<main className="w-full h-fit flex flex-col items-center justify-start">
			<section className="w-full min-h-[100dvh] flex flex-col items-center justify-center container py-12">
				<BrandIcon
					size="18rem"
					className=" text-primary_accent dark:text-primary_accent_dark"
				/>
				<div className="w-full flex flex-col items-center justify-center gap-4">
					<h1 className="text-3xl lg:text-5xl text-center font-semibold text-foreground dark:text-foreground_dark">
						Cosmic Reach Mod Manager
					</h1>

					<div className="flex flex-col items-center justify-center gap-2">
						<h2 className="w-full text-center flex flex-wrap items-center justify-center text-2xl text-foreground_muted dark:text-foreground_muted_dark">
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
						<h2 className="text-2xl flex text-center text-foreground_muted dark:text-foreground_muted_dark">
							Discover, Play, and Create content all in one spot.
						</h2>
					</div>
				</div>

				<div className="flex gap-8 flex-wrap items-center justify-center mt-6">
					<Button
						className="bg-primary_accent dark:bg-primary_accent hover:bg-primary_accent/80 dark:hover:bg-primary_accent_dark/80"
						size="lg"
						aria-label="Explore mods"
					>
						<p className="text-foreground_dark dark:text-foreground_dark text-lg">
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

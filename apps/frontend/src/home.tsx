import { BrandIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import styles from "@/src/styles.module.css";
import { Link } from "react-router-dom";
import CTAButton from "./cta-button";

const featuredSectionContentData = [
	{
		categoryName: "Mods",
		title: "Popular mods",
		items: [
			{
				name: "Sodium",
				description: "A performace mod",
				logo: "NONE",
				url: "/mod/sodium",
			},
			{
				name: "Lithium",
				description: "A mod aimed to improve server performace",
				logo: "NONE",
				url: "/mod/lithium",
			},
			{
				name: "Furnicraft",
				description: "Add lots of amazing furnitures",
				logo: "NONE",
				url: "/mod/furnicraft",
			},
			{
				name: "Aether",
				description: "Adds a whole new Aether dimension to your game",
				logo: "NONE",
				url: "/mod/aether",
			},
		],
	},

	{
		categoryName: "Resource Packs",
		title: "Popular resource packs",
		items: [
			{
				name: "Bare bones",
				description: "A bare bones texture pack",
				logo: "NONE",
				url: "/resourcepack/bare-bones",
			},
			{
				name: "Optifine grass texture",
				description: "Provides grass textures like optifine",
				logo: "NONE",
				url: "/resourcepack/optifine-grass-texture",
			},
			{
				name: "X-ray texture pack",
				description: "X-ray texture pack enables to see throught blocks and find ores",
				logo: "NONE",
				url: "/resourcepack/x-ray-texture-pack",
			},
			{
				name: "PVP God texture pack",
				description: "A resource pack that make you the god of PvP, even if your cps don't go above 5",
				logo: "NONE",
				url: "/resourcepack/pvp-god-texture-pack",
			},
		],
	},
];

export default function HomePage() {
	// The animation keyframes in "@/app/globals.css" need to be updated according to the number of items in the list
	const showcaseItems = ["Mods", "Resource Packs", "Modpacks", "Shaders", "Mods"];

	return (
		<main className="w-full h-fit flex flex-col items-center justify-start pb-8">
			<section className="w-full min-h-[100vh] flex flex-col items-center justify-center container py-12">
				<BrandIcon size="16rem" className="text-accent-foreground" />
				<div className="w-full flex flex-col items-center justify-center">
					<h1 className="font-frijole text-2xl lg:text-4xl text-center text-foreground">Cosmic Reach Mod Manager</h1>

					<h2 className="h-10 lg:h-14 mb-2 overflow-hidden">
						<span className="hero_section_showcase flex flex-col items-center justify-center">
							{showcaseItems?.map((item, index) => {
								return (
									<strong
										key={`${item}${
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											index
										}`}
										className="flex font-normal items-center justify-center h-10 lg:h-14 text-2xl lg:text-4xl font-frijole bg-clip-text bg-accent-bg text-transparent bg-cover bg-gradient-to-b from-rose-200 to-accent-bg via-accent-bg leading-loose"
									>
										{item}
									</strong>
								);
							})}
						</span>
					</h2>

					<div className="flex flex-col items-center justify-center gap-2">
						<h2 className="w-full text-center flex flex-wrap items-center justify-center text-xl lg:text-2xl text-foreground-muted">
							The best place for your
							<a
								href="https://finalforeach.itch.io/cosmic-reach"
								target="_blank"
								rel="noreferrer"
								aria-label={"Cosmic Reach"}
								className="text-accent-foreground"
							>
								&nbsp;Cosmic Reach&nbsp;
							</a>{" "}
							mods.
						</h2>
						<h2 className="text-xl lg:text-2xl flex text-center text-foreground-muted">
							Discover, play, and create content, all in one spot.
						</h2>
					</div>
				</div>

				<div className="flex gap-4 md:gap-8 flex-wrap items-center justify-center mt-6">
					<Button size="lg" aria-label="Explore mods">
						<p className="text-[hsl(var(--foreground-dark))] dark:text-[hsl(var(--foreground-dark))] font-semibold text-base sm:text-md duration-0 dark:duration-0">
							Explore mods
						</p>
					</Button>

					<CTAButton />
				</div>
			</section>

			{featuredSectionContentData.map((section) => (
				<div className="w-full flex items-start justify-start flex-col px-4 my-2" key={section.categoryName}>
					<h2 className="text-left text-2xl py-2 px-1 underline underline-offset-2 text-foreground-muted">
						{section.title}
					</h2>

					<div className={`${styles.showcase_wrapper} w-full grid rounded-lg gap-6`}>
						{section.items.map((item) => {
							return (
								<Link
									className={`${styles.showcase_item} w-full rounded-lg p-3 grid gap-4 border-2 border-bg-hover`}
									to={item.url}
									key={item.url}
									aria-label={item.name}
								>
									<div className="h-16 w-16 bg-bg-hover rounded-lg flex items-center justify-center"> </div>
									<div className="flex flex-col items-start justify-start mr-4 max-h-24">
										<h3 className={`${styles.item_name} text-lg sm:text-xl text-foreground-muted font-semibold`}>
											{item.name}
										</h3>
										<p className={`${styles.item_description} text-foreground-muted`}>{item.description}</p>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			))}
		</main>
	);
}

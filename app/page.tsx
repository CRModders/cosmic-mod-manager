import React from "react";
import { Button } from "@nextui-org/react";
import NextLink from "next/link";

import FeaturedSectionList from "@/constants/TempFeaturedSections";
import { HeroSectionBrandLogo } from "@/components/Icons";
import Carousel from "@/components/Carousel/Carousel";

import styles from "./styles.module.css";

export default function Home() {
	// Update amount of content before site is live
	const content_count = 18989865695675;

	const parse_content_count = (count: number) => {
		const result = count;

		return count;
	};

	return (
		<main className={styles.main}>
			{/* Hero section */}
			<section className={`${styles.hero_section} container`}>
				<div className={styles.wrapper}>
					<div className={styles.brand_logo_wrapper}>
						<HeroSectionBrandLogo
							size={"12rem"}
							className={styles.brand_logo}
						/>
					</div>
					<h1 className={`${styles.heroTitle}`}>Cosmic Reach Mod Manager</h1>

					<h2
						className={`${styles.heroDescription} ${styles.primaryHeroDescription}`}
					>
						The best place for your{" "}
						<NextLink
							href="https://finalforeach.itch.io/cosmic-reach"
							className={styles.gameLink}
						>
							Cosmic Reach
						</NextLink>{" "}
						mods.
					</h2>
					<h2
						className={`${styles.heroDescription} ${styles.secondaryHeroDescription}`}
					>
						Discover, Play, and Create Content all in one spot.
					</h2>

					{/* <h2 className={`${styles.heroDesc}`}>
						The <b>best</b> place for your Cosmic Reach mods.
						<br />
						Discover, Play, and Create Content for Cosmic Reach all in one spot.
						<br />
						With over{" "}
						<span className={styles.accentColor}>
							{parse_content_count(content_count - 1)}
						</span>{" "}
						pieces of unique downloadable content on{" "}
						<span className={styles.accentColor}>CRMM</span>, you <b>will</b>{" "}
						find the mod for you.
					</h2> */}
					<br />
					<div className={styles.callToActionButtonsContainer}>
						{" "}
						<Button
							className={`${styles.callToActionButton} ${styles.primaryCallToActionButton}`}
							radius="sm"
							size="lg"
						>
							<p className={styles.callToActionButtonText}>Explore Mods</p>
						</Button>{" "}
						<Button
							className={`${styles.callToActionButton} ${styles.secondaryCallToActionButton}`}
							radius="sm"
							variant="bordered"
							size="lg"
						>
							<p className={styles.callToActionButtonText}>Upload Content</p>
						</Button>
					</div>
				</div>
			</section>

			{/* Featured section */}
			<section className={styles.featured_section}>
				<div className={styles.wrapper}>
					{FeaturedSectionList.map((section) => {
						return (
							<React.Fragment key={section.title}>
								<Carousel section_title={section.title} items={section.items} />
							</React.Fragment>
						);
					})}
				</div>
			</section>
		</main>
	);
}

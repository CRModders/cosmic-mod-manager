import React from "react";
import Carousel from "@/components/Carousel/Carousel";
import styles from "./styles.module.css"; // This is the css file for this page ok ill use that
import { HeroSectionBrandLogo } from "@/components/Icons";
import FeaturedSectionList from "@/constants/TempFeaturedSections";
import { Button } from "@nextui-org/react";

export default function Home() {
	// Update amount of content before site is live
	const content_count = 18989865695675;

	const parse_content_count = (count) => {
		const result = count;

		return count;
	};

	return (
		<main className="main">
			{/* Hero section */}
			<section className={`${styles.hero_section}`}>
				<div className={styles.wrapper}>
					<div className={styles.brand_logo_wrapper}>
						<HeroSectionBrandLogo
							size={"12rem"}
							className={styles.brand_logo}
						/>
					</div>
					<h1 className={`${styles.heroTitle}`}>Cosmic Reach Mod Manager:</h1>
					<h2 className={`${styles.heroDesc}`}>
						The <b>best</b> place for your Cosmic Reach mods.
						<br />
						Discover, Play, and Create Content for Cosmic Reach all in one spot.
						<br />
						With over{" "}
						<span className={styles.accentColor}>
							{parse_content_count - 1}
						</span>{" "}
						pieces of unique downloadable content on{" "}
						<span className={styles.accentColor}>CRMM</span>, you <b>will</b>{" "}
						find the mod for you.
					</h2>
					<br />
					<div>
						{" "}
						{/* Div for buttons to have a gap */}
						<Button className={styles.callToActionButton} radius="sm">
							<p className={styles.callToActionButtonText}>Explore Mods</p>
						</Button>{" "}
						<Button className={styles.callToActionButton} radius="sm">
							<p className={styles.callToActionButtonText}>Upload Mods</p>
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

{
	/*<div className="hero_section_wrapper w-full flex items-center justify-center flex-col gap-4 mt-16">
				<p className={`${styles.hero}`}>
					<img src="data:image/png;base64,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" />
					<br>Cosmic reach mods marketplace
				</p>
				</section>

				// Popular / Featured mods section 
				<div class="popBoxContainer">
					<article class="popBox">
						<h1>Popular Mods</h1>
						<article class="popItem">
							<img
								src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEUA/wAAAADX19cA2wAAVwAAUgAAGgAAWwAASwAAVgAA4gAA3QAARgAAugDU1NT39/cDBq/KAAABK0lEQVR4nO3PiQ2DMADAwAB96bf/tmWJqrrIN4E9LtfTxG7LOu5jZvtxeP53xE9tHfI69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehb/7Dx3H43LeJvY7DZXLvsc7t/fkCwNkSni/v0mIAAAAASUVORK5CYII="
								class="popItemImage"
							></img>
							<div>
								<h1>
									<a href="/user/ReallyGoodModder/content/mods/amazing-mod">
										Amazing Mod
									</a>
								</h1>
								<p class="popItemDesc">This mod is amazing</p>
								<p class="popItemDesc">
									by <a href="/user/ReallyGoodModder">ReallyGoodModder</a>
								</p>
							</div>
						</article>
						<article class="popItem">
							<img
								src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEUA/wAAAADX19cA2wAAVwAAUgAAGgAAWwAASwAAVgAA4gAA3QAARgAAugDU1NT39/cDBq/KAAABK0lEQVR4nO3PiQ2DMADAwAB96bf/tmWJqrrIN4E9LtfTxG7LOu5jZvtxeP53xE9tHfI69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehb/7Dx3H43LeJvY7DZXLvsc7t/fkCwNkSni/v0mIAAAAASUVORK5CYII="
								class="popItemImage"
							></img>
							<div>
								<h1>
									<a href="/user/ReallyGoodModder/content/mods/really-amazing-mod">
										Really Amazing Mod
									</a>
								</h1>
								<p class="popItemDesc">This mod is Really amazing</p>
								<p class="popItemDesc">
									by <a href="/user/ReallyGoodModder">ReallyGoodModder</a>
								</p>
							</div>
						</article>
					</article>
					<article class="popBox">
						<h1>Popular Shaders</h1>
						<article class="popItem">
							<img
								src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEUA/wAAAADX19cA2wAAVwAAUgAAGgAAWwAASwAAVgAA4gAA3QAARgAAugDU1NT39/cDBq/KAAABK0lEQVR4nO3PiQ2DMADAwAB96bf/tmWJqrrIN4E9LtfTxG7LOu5jZvtxeP53xE9tHfI69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehb/7Dx3H43LeJvY7DZXLvsc7t/fkCwNkSni/v0mIAAAAASUVORK5CYII="
								class="popItemImage"
							></img>
							<div>
								<h1>
									<a href="/user/ReallyGoodModder/content/shaders/amazing-shaders">
										Amazing Shaders
									</a>
								</h1>
								<p class="popItemDesc">These Shaders are amazing</p>
								<p class="popItemDesc">
									by <a href="/user/ReallyGoodModder">ReallyGoodModder</a>
								</p>
							</div>
						</article>
						<article class="popItem">
							<img
								src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEUA/wAAAADX19cA2wAAVwAAUgAAGgAAWwAASwAAVgAA4gAA3QAARgAAugDU1NT39/cDBq/KAAABK0lEQVR4nO3PiQ2DMADAwAB96bf/tmWJqrrIN4E9LtfTxG7LOu5jZvtxeP53xE9tHfI69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehb/7Dx3H43LeJvY7DZXLvsc7t/fkCwNkSni/v0mIAAAAASUVORK5CYII="
								class="popItemImage"
							></img>
							<div>
								<h1>
									<a href="/user/ReallyGoodModder/content/shaders/really-amazing-shaders">
										Really Amazing Shaders
									</a>
								</h1>
								<p class="popItemDesc">these Shaders are Really amazing</p>
								<p class="popItemDesc">
									by <a href="/user/ReallyGoodModder">ReallyGoodModder</a>
								</p>
							</div>
						</article>
					</article>
					<article class="popBox">
						<h1>Popular Modpacks</h1>
						<article class="popItem">
							<img
								src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEUA/wAAAADX19cA2wAAVwAAUgAAGgAAWwAASwAAVgAA4gAA3QAARgAAugDU1NT39/cDBq/KAAABK0lEQVR4nO3PiQ2DMADAwAB96bf/tmWJqrrIN4E9LtfTxG7LOu5jZvtxeP53xE9tHfI69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehb/7Dx3H43LeJvY7DZXLvsc7t/fkCwNkSni/v0mIAAAAASUVORK5CYII="
								class="popItemImage"
							></img>
							<div>
								<h1>
									<a href="/user/ReallyGoodModder/content/modpacks/amazing-modpack">
										Amazing modpack
									</a>
								</h1>
								<p class="popItemDesc">This modpack is amazing</p>
								<p class="popItemDesc">
									by <a href="/user/ReallyGoodModder">ReallyGoodModder</a>
								</p>
							</div>
						</article>
						<article class="popItem">
							<img
								src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEUA/wAAAADX19cA2wAAVwAAUgAAGgAAWwAASwAAVgAA4gAA3QAARgAAugDU1NT39/cDBq/KAAABK0lEQVR4nO3PiQ2DMADAwAB96bf/tmWJqrrIN4E9LtfTxG7LOu5jZvtxeP53xE9tHfI69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehb/7Dx3H43LeJvY7DZXLvsc7t/fkCwNkSni/v0mIAAAAASUVORK5CYII="
								class="popItemImage"
							></img>
							<div>
								<h1>
									<a href="/user/ReallyGoodModder/content/modpacks/really-amazing-modpack">
										Really Amazing Mmodpack
									</a>
								</h1>
								<p class="popItemDesc">This modpack is Really amazing</p>
								<p class="popItemDesc">
									by <a href="/user/ReallyGoodModder">ReallyGoodModder</a>
								</p>
							</div>
						</article>
					</article>
					<article class="popBox">
						<h1>Popular Resource Packs</h1>
						<article class="popItem">
							<img
								src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEUA/wAAAADX19cA2wAAVwAAUgAAGgAAWwAASwAAVgAA4gAA3QAARgAAugDU1NT39/cDBq/KAAABK0lEQVR4nO3PiQ2DMADAwAB96bf/tmWJqrrIN4E9LtfTxG7LOu5jZvtxeP53xE9tHfI69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehb/7Dx3H43LeJvY7DZXLvsc7t/fkCwNkSni/v0mIAAAAASUVORK5CYII="
								class="popItemImage"
							></img>
							<div>
								<h1>
									<a href="/user/ReallyGoodModder/content/resource-packs/amazing-resource-pack">
										Amazing Resource Pack
									</a>
								</h1>
								<p class="popItemDesc">This Resource Pack is amazing</p>
								<p class="popItemDesc">
									by <a href="/user/ReallyGoodModder">ReallyGoodModder</a>
								</p>
							</div>
						</article>
						<article class="popItem">
							<img
								src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEUA/wAAAADX19cA2wAAVwAAUgAAGgAAWwAASwAAVgAA4gAA3QAARgAAugDU1NT39/cDBq/KAAABK0lEQVR4nO3PiQ2DMADAwAB96bf/tmWJqrrIN4E9LtfTxG7LOu5jZvtxeP53xE9tHfI69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehr0Nfh74OfR36OvR16OvQ16GvQ1+Hvg59Hfo69HXo69DXoa9DX4e+Dn0d+jr0dejr0Nehb/7Dx3H43LeJvY7DZXLvsc7t/fkCwNkSni/v0mIAAAAASUVORK5CYII="
								class="popItemImage"
							></img>
							<div>
								<h1>
									<a href="/user/ReallyGoodModder/content/resource-packs/really-amazing-resource-pack">
										Really amazing Resource Pack
									</a>
								</h1>
								<p class="popItemDesc">This Resource Pack is Really amazing</p>
								<p class="popItemDesc">
									by <a href="/user/ReallyGoodModder">ReallyGoodModder</a>
								</p>
							</div>
						</article>
					</article>
				</div>
			</div> */
}

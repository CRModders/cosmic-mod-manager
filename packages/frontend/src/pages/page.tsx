import { BrandIcon } from "@/components/icons";
import "@/src/styles.css";

import { Button } from "@/components/ui/button";
import { VariantButtonLink } from "@/components/ui/link";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useSession } from "@/src/contexts/auth";
import { SITE_NAME_SHORT } from "@shared/config";
import { createPortal } from "react-dom";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const HomePage = () => {
    const { session } = useSession();
    // The animation keyframes in "@/app/styles.css" need to be updated according to the number of items in the list
    const showcaseItems = ["Mods", "Plugins", "Resource Packs", "Modpacks", "Shaders", "Mods"];

    return (
        <>
            {createPortal(
                <div className="relative w-full h-[150vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute w-full h-full hero_section_grid_bg top-0 left-0">
                        <div className="hero_section_fading_bg w-full h-full bg-gradient-to-b from-transparent to-background" />
                    </div>
                </div>,
                document.body.querySelector("#hero_section_bg_portal") as Element,
            )}

            <Helmet>
                <title>{SITE_NAME_SHORT}</title>
                <meta name="description" content="All your favourite Cosmic Reach mods" />
            </Helmet>

            <main className="w-full">
                <section className="full_page w-full flex flex-col items-center justify-center">
                    <BrandIcon size="16rem" className="text-accent-foreground" />
                    <div className="w-full flex flex-col items-center justify-center gap-1">
                        <h1 className="text-4xl lg:text-6xl font-medium text-foreground text-center">Cosmic Reach Mod Manager</h1>

                        <h2 className="h-12 lg:h-[4.5rem] mb-1 overflow-hidden">
                            <span className="hero_section_showcase flex flex-col items-center justify-center [--unit-height:_3rem] lg:[--unit-height:_4.5rem]">
                                {showcaseItems?.map((item, index) => {
                                    return (
                                        <strong
                                            key={`${item}${
                                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                                index
                                            }`}
                                            className="flex font-bold items-center justify-center h-12 lg:h-[4.5rem] text-4xl lg:text-6xl bg-clip-text bg-accent-background text-transparent bg-cover bg-gradient-to-b from-rose-200 to-accent-background via-accent-background leading-loose"
                                            // @ts-ignore
                                            style={{ "--index": index + 1 }}
                                        >
                                            {item}
                                        </strong>
                                    );
                                })}
                            </span>
                        </h2>

                        <div className="w-full max-w-xl flex flex-col items-center justify-center">
                            <h2 className="w-full text-center text-lg lg:text-xl">
                                The best place for your&nbsp;
                                <a
                                    href="https://finalforeach.itch.io/cosmic-reach"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={"Cosmic Reach"}
                                    className="text-accent-foreground underline-offset-3 hover:underline"
                                >
                                    Cosmic Reach
                                </a>
                                &nbsp;mods. {/* </h2> */}
                                {/* <h2 className="text-lg lg:text-xl flex text-center text-foreground-muted"> */}
                                Discover, play, and create content, all in one spot.
                            </h2>
                        </div>
                    </div>

                    <div className="flex gap-4 md:gap-8 flex-wrap items-center justify-center mt-6">
                        <Link to={"/mods"}>
                            <Button size={"lg"} aria-label="Explore mods" tabIndex={-1}>
                                Explore mods
                            </Button>
                        </Link>

                        {session === undefined ? (
                            <LoadingSpinner size="sm" />
                        ) : !session?.id ? (
                            <VariantButtonLink
                                url="/signup"
                                size={"lg"}
                                className="bg-card-background hover:bg-card-background/90 dark:bg-shallow-background dark:hover:bg-shallow-background/90"
                            >
                                Sign Up
                            </VariantButtonLink>
                        ) : (
                            <VariantButtonLink
                                url="/dashboard/projects"
                                size={"lg"}
                                className="bg-card-background hover:bg-card-background/90 dark:bg-shallow-background dark:hover:bg-shallow-background/90"
                            >
                                Dashboard
                            </VariantButtonLink>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default HomePage;

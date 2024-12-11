import { cn, getProjectPagePathname, imageUrl } from "@root/utils";
import type { ProjectListItem } from "@shared/types/api";
import { CompassIcon, LayoutDashboardIcon, LogInIcon } from "lucide-react";
import { type CSSProperties, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BrandIcon, fallbackProjectIcon } from "~/components/icons";
import { ImgWrapper } from "~/components/ui/avatar";
import Link, { VariantButtonLink } from "~/components/ui/link";
import { useSession } from "~/hooks/session";
import "./styles.css";

interface Props {
    projects: ProjectListItem[];
}

export default function HomePage({ projects }: Props) {
    const session = useSession();
    const [gridBgPortal, setGridBgPortal] = useState<Element | null>(null);

    // The animation keyframes in "@/app/styles.css" need to be updated according to the number of items in the list
    const showcaseItems = ["mods", "plugins", "resource packs", "modpacks", "shaders", "mods"];

    useEffect(() => {
        setGridBgPortal(document.querySelector("#hero_section_bg_portal"));
    }, []);

    return (
        <>
            {gridBgPortal
                ? createPortal(
                      <div className="relative w-full h-[115vh] lg:max-h-[100vh] flex items-center justify-center overflow-hidden">
                          <div className="absolute w-full h-full hero_section_grid_bg top-0 left-0">
                              <div className="hero_section_fading_bg w-full h-full bg-gradient-to-b from-transparent via-transparent to-background" />
                          </div>
                      </div>,
                      gridBgPortal,
                  )
                : null}

            <main className="w-full">
                <section className="w-full flex flex-col items-center justify-center py-28">
                    <div className="p-6">
                        <BrandIcon className="text-accent-foreground" size="16rem" />
                    </div>

                    <div className="w-full flex flex-col items-center justify-center gap-1">
                        <h1 className="text-4xl lg:text-6xl font-medium text-foreground text-center">The place for Cosmic Reach</h1>

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
                            <h2 className="w-full leading-snug text-center text-lg lg:text-xl text-muted-foreground/95">
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
                                &nbsp;mods. Discover, play, and create content, all in one spot.
                            </h2>
                        </div>
                    </div>

                    <div className="flex gap-4 md:gap-8 flex-wrap items-center justify-center mt-6">
                        <VariantButtonLink size="lg" variant="default" url="/mods" className="px-6">
                            <CompassIcon className="w-btn-icon-lg h-btn-icon-lg" />
                            Explore mods
                        </VariantButtonLink>

                        {!session?.id ? (
                            <VariantButtonLink
                                url="/signup"
                                size="lg"
                                className="px-6 bg-card-background hover:bg-card-background/90 dark:bg-shallow-background dark:hover:bg-shallow-background/90"
                                prefetch="render"
                            >
                                <LogInIcon className="w-btn-icon-md h-btn-icon-md" />
                                Sign Up
                            </VariantButtonLink>
                        ) : (
                            <VariantButtonLink url="/dashboard/projects" size={"lg"} className="px-6" variant="secondary-inverted">
                                <LayoutDashboardIcon className="w-btn-icon-md h-btn-icon-md" />
                                Dashboard
                            </VariantButtonLink>
                        )}
                    </div>
                </section>

                <ShowCase projects={projects} />
            </main>
        </>
    );
}

function ShowCase({ projects }: { projects: ProjectListItem[] }) {
    if (!projects?.length) return null;

    const carousel1Items = projects.slice(0, Math.floor(projects.length / 2));
    const carousel2Items = projects.slice(Math.floor(projects.length / 2));

    return (
        <div className="w-full flex flex-col gap-6">
            <MarqueeScroll items={carousel1Items || []} />
            <MarqueeScroll items={carousel2Items || []} reverse />
        </div>
    );
}

interface MarqueeScrollProps {
    items: ProjectListItem[];
    reverse?: boolean;
}

function MarqueeScroll({ items, reverse = false }: MarqueeScrollProps) {
    const duration = 7.5 * items.length;

    return (
        <div className="marquee w-full flex items-center justify-start relative h-[5.7rem] overflow-hidden">
            <div
                className="scroll-container absolute w-fit flex items-center justify-start gap-x-6 px-3"
                style={{
                    animationDuration: `${duration}s`,
                    animationDelay: `-${duration / 2}s`,
                    animationDirection: reverse ? "reverse" : "normal",
                }}
            >
                {items.map((item) => (
                    <ShowcaseItem key={item.id} item={item} />
                ))}
            </div>

            <div
                className="scroll-container absolute w-fit flex items-center justify-start gap-x-6 px-3"
                style={{
                    animationDuration: `${duration}s`,
                    animationDelay: "0s",
                    animationDirection: reverse ? "reverse" : "normal",
                }}
            >
                {items.map((item) => (
                    <ShowcaseItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

function ShowcaseItem({ className, item, ...props }: { className?: string; item: ProjectListItem; style?: CSSProperties }) {
    return (
        <Link
            aria-label={item.name}
            to={getProjectPagePathname(item.type[0], item.slug)}
            className={cn(
                "shrink-0 border border-card-background rounded-lg w-72 h-[5.35rem] flex gap-x-3 items-start justify-start p-3",
                "bg-card-background dark:bg-transparent hover:bg-card-background/35 dark:hover:bg-card-background/35 transition-colors duration-300",
                className,
            )}
            {...props}
        >
            <ImgWrapper src={imageUrl(item.icon)} alt={item.name} fallback={fallbackProjectIcon} className="w-11 h-11" loading="lazy" />
            <div className="flex flex-col gap-1">
                <span className="max-w-52 text-lg font-bold overflow-hidden whitespace-nowrap text-ellipsis leading-tight">
                    {item.name}
                </span>
                <span className="description__showcase-item max-w-52 text-[0.87rem] text-muted-foreground overflow-hidden leading-tight text-pretty">
                    {item.summary}
                </span>
            </div>
        </Link>
    );
}

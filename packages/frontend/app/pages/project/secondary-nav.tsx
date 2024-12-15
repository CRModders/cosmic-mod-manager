import { cn } from "@root/utils";
import { ButtonLink } from "~/components/ui/link";

interface LinkItem {
    label: string;
    href: string;
}

function SecondaryNav({
    urlBase,
    className,
    links,
    onClick,
}: { urlBase: string; className?: string; links: LinkItem[]; onClick?: (e: React.MouseEvent, link: LinkItem) => void }) {
    return (
        <nav className={cn("flex items-center justify-start", className)} id="project-page-nav">
            <ul className="w-full flex gap-1 flex-wrap">
                {links.map((link) => {
                    return (
                        <li key={`${urlBase}-${link.href}`} className="flex items-center justify-center">
                            <ButtonLink
                                prefetch="render"
                                url={`${urlBase}${link.href}`}
                                className="h-10 px-4 py-0 rounded font-semibold capitalize"
                                onClick={(e) => onClick?.(e, link)}
                                preventScrollReset
                            >
                                {link.label}
                            </ButtonLink>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default SecondaryNav;

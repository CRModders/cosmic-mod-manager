import { ButtonLink } from "@app/components/ui/link";
import { cn } from "@app/components/utils";
import { Capitalize } from "@app/utils/string";

interface LinkItem {
    label: string;
    href: string;
}

interface Props {
    urlBase: string;
    className?: string;
    links: LinkItem[];
    onClick?: (e: React.MouseEvent, link: LinkItem) => void;
}

export default function SecondaryNav({ urlBase, className, links, onClick }: Props) {
    return (
        <nav className={cn("flex items-center justify-start", className)} id="project-page-nav">
            <ul className="w-full flex gap-1 flex-wrap">
                {links.map((link) => {
                    return (
                        <li key={`${urlBase}-${link.href}`} className="flex items-center justify-center">
                            <ButtonLink
                                prefetch="render"
                                url={`${urlBase}${link.href}`}
                                className="h-10 px-4 py-0 rounded font-semibold"
                                onClick={(e) => onClick?.(e, link)}
                                preventScrollReset
                            >
                                {Capitalize(link.label)}
                            </ButtonLink>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

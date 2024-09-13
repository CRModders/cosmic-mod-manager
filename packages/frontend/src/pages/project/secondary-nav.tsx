import { ButtonLink } from "@/components/ui/link";
import { cn } from "@/lib/utils";

interface LinkItem {
    label: string;
    href: string;
}

const SecondaryNav = ({ urlBase, className, links }: { urlBase: string; className?: string; links: LinkItem[] }) => {
    return (
        <nav className={cn("w-full flex items-center justify-start", className)} id="project-page-nav">
            <ul className="w-full flex gap-1 flex-wrap">
                {links.map((link) => {
                    return (
                        <li key={`${urlBase}-${link.href}`} className="flex items-center justify-center">
                            <ButtonLink url={`${urlBase}${link.href}`} className="h-10 px-4 py-0 rounded font-semibold">
                                {link.label}
                            </ButtonLink>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default SecondaryNav;

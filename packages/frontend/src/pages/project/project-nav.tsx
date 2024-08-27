import { ButtonLink } from "@/components/ui/link";
import { cn } from "@/lib/utils";

const ProjectNav = ({ baseHref, className }: { baseHref: string; className?: string }) => {
    const links = [
        {
            label: "About",
            href: `${baseHref}`,
        },
        {
            label: "Gallery",
            href: `${baseHref}/gallery`,
        },
        {
            label: "Changelog",
            href: `${baseHref}/changelog`,
        },
        {
            label: "Versions",
            href: `${baseHref}/versions`,
        },
    ];

    return (
        <nav className={cn("w-full flex items-center justify-start", className)} id="project-page-nav">
            <ul className="w-full flex gap-1">
                {links.map((link) => {
                    return (
                        <li key={link.href} className="flex items-center justify-center">
                            <ButtonLink key={link.href} url={link.href} className="h-9 text-sm px-4 py-0 rounded font-semibold">
                                {link.label}
                            </ButtonLink>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default ProjectNav;

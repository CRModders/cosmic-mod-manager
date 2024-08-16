import { ButtonLink } from "@/components/ui/link";
import { SettingsIcon } from "lucide-react";

const ProjectNav = ({ baseHref, isAProjectMember }: { baseHref: string; isAProjectMember: boolean }) => {
    const links = [
        {
            label: "Description",
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
        <nav className="w-full flex items-center justify-start" id="project-page-nav">
            <ul className="w-fit grow flex flex-wrap gap-x-2 gap-y-1.5">
                {links.map((link) => {
                    return (
                        <li key={link.href} className="flex items-center justify-center">
                            <ButtonLink key={link.href} url={link.href} className="h-9 px-3">
                                {link.label}
                            </ButtonLink>
                        </li>
                    );
                })}
                {isAProjectMember === true && (
                    <ButtonLink url={`${baseHref}/settings`} className="h-9 px-3 w-fit">
                        <SettingsIcon className="w-btn-icon h-btn-icon" />
                        Settings
                    </ButtonLink>
                )}
            </ul>
        </nav>
    );
};

export default ProjectNav;

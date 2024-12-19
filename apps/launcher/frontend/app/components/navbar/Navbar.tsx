import { ImgWrapper } from "@app/components/ui/avatar";
import { Button } from "@app/components/ui/button";
import { HomeIcon, LibraryIcon, PlusIcon, SearchIcon, SettingsIcon } from "lucide-react";
import { ButtonLink } from "~/components/ui/link";

export default function Navbar() {
    return (
        <header className="bg-card-background p-3 grid grid-cols-1 grid-rows-[auto_1fr_auto] place-items-center">
            <div className="grid grid-cols-1 gap-4 place-items-center">
                <ImgWrapper
                    className="w-12 h-12 rounded-md"
                    src="https://i.pinimg.com/736x/54/f4/b5/54f4b55a59ff9ddf2a2655c7f35e4356.jpg"
                    alt="Avatar"
                />
                <nav className="grid grid-cols-1 gap-2">
                    {links.map((link) => {
                        return (
                            <Navlink key={link.href} href={link.href} title={link.label}>
                                {link.icon}
                            </Navlink>
                        );
                    })}
                </nav>
            </div>

            <span />

            <div className="grid grid-cols-1 gap-2">
                <Button
                    size="icon"
                    variant="secondary"
                    className="!w-12 !h-12 px-0 py-0 flex items-center justify-center"
                    title="Create instance"
                >
                    <PlusIcon className="w-6 h-6" />
                </Button>

                <Navlink href={"/settings"} title="Settings">
                    <SettingsIcon className="w-6 h-6" />
                </Navlink>
            </div>
        </header>
    );
}

function Navlink(props: { href: string; children: React.ReactNode; title: string }) {
    return (
        <ButtonLink url={props.href} className="h-12 w-12 px-0 py-0 flex items-center justify-center" title={props.title}>
            {props.children}
        </ButtonLink>
    );
}

const links = [
    {
        href: "/",
        icon: <HomeIcon className="w-6 h-6" />,
        label: "Home",
    },
    {
        href: "/search",
        icon: <SearchIcon className="w-6 h-6" />,
        label: "Browse",
    },
    {
        href: "/library",
        icon: <LibraryIcon className="w-6 h-6" />,
        label: "Library",
    },
];

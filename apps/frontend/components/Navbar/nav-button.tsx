import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AuthContext } from "@/src/providers/auth-provider";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { LogoutIcon } from "../icons";
import { Button } from "../ui/button";
import { CubeLoader } from "../ui/spinner";
import ProfileDropdown, { ProfileDropdownLink } from "./profile-dropdown";

export const LoginButton = ({
    btnClassName,
    btnVariant = "outline",
}: {
    btnClassName?: string;
    btnVariant?: "destructive" | "outline" | "secondary" | "ghost" | "link";
}) => {
    return (
        <Button className={cn("px-6", btnClassName)} size="lg" variant={btnVariant} aria-label="Login">
            Log In
        </Button>
    );
};

const NavButton = () => {
    const { session, logout: _logout } = useContext(AuthContext);

    if (session === undefined) {
        return <CubeLoader size="sm" />;
    }

    if (!session?.user_id) {
        return (
            <Link to={"/login"}>
                <LoginButton />
            </Link>
        );
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size="lg"
                    variant="ghost"
                    aria-label="Profile icon"
                    className="p-0 m-0 h-fit rounded-full w-fit"
                >
                    <div className="flex items-center justify-center navItemHeight aspect-square p-1 hover:bg-background rounded-full">
                        {session?.avatar_image ? (
                            <img
                                src={session?.avatar_image}
                                alt={`${session?.user_name} `}
                                className="w-full aspect-square rounded-full bg-bg-hover"
                            />
                        ) : (
                            <span>{session?.name[0]}</span>
                        )}
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-md min-w-72 mx-[auto] mr-4" align="center">
                <ProfileDropdown session={session} />
            </PopoverContent>
        </Popover>
    );
};

export default NavButton;

type Props = {
    className?: string;
    labelClassName?: string;
};

export const SignOutBtn = ({ ...props }: Props) => {
    const [loading, setLoading] = useState(false);
    const { logout } = useContext(AuthContext);

    const handleClick = async () => {
        if (loading) return;
        setLoading(true);
        await logout();
    };

    return (
        <div className="group w-full flex items-center justify-center rounded-lg bg_stagger_animation">
            <ProfileDropdownLink
                label="Sign Out"
                icon={!loading ? <LogoutIcon className="w-5 h-5" /> : <CubeLoader size="sm" />}
                disabled={loading}
                onClick={handleClick}
                {...props}
            />
        </div>
    );
};

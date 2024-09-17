import { fallbackUserIcon } from "@/components/icons";
import { ImgWrapper } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CopyBtn from "@/components/ui/copy-btn";
import { ButtonLink } from "@/components/ui/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/spinner";
import { cn, imageUrl } from "@/lib/utils";
import { AuthContext } from "@/src/contexts/auth";
import type { LoggedInUserData } from "@shared/types";
import { LayoutDashboardIcon, LogInIcon, LogOutIcon, Settings2Icon, UserIcon } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

export const LoginButton = ({
    className,
    onClick,
}: {
    className?: string;
    onClick?: () => void;
}) => {
    return (
        <Button
            className={cn(
                "bg-card-background hover:bg-card-background/90 dark:bg-shallow-background dark:hover:bg-shallow-background/90",
                className,
            )}
            variant={"secondary"}
            // size={"sm"}
            aria-label="Login"
            tabIndex={-1}
            onClick={onClick}
        >
            <LogInIcon className="w-btn-icon h-btn-icon" />
            Log In
        </Button>
    );
};

const NavButton = ({ toggleNavMenu }: { toggleNavMenu: (newState?: boolean) => void }) => {
    const { session } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    if (session === undefined) {
        return <LoadingSpinner size="sm" />;
    }

    if (!session?.id) {
        return (
            <Link to={"/login"}>
                <LoginButton
                    onClick={() => {
                        toggleNavMenu(false);
                    }}
                />
            </Link>
        );
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    size="lg"
                    variant="ghost"
                    aria-label="Profile icon"
                    className="p-0 m-0 h-fit rounded-full w-fit hover:bg-transparent dark:hover:bg-transparent no_neumorphic_shadow"
                >
                    <ImgWrapper
                        src={imageUrl(session.avatarUrl)}
                        alt={session?.userName}
                        fallback={fallbackUserIcon}
                        className="h-nav-item p-0.5 rounded-full"
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-md min-w-72 mx-[auto] mr-4" align="end">
                <ProfileDropDown session={session} isPopoverOpen={isOpen} />
            </PopoverContent>
        </Popover>
    );
};

export default NavButton;

type Props = {
    className?: string;
    disabled?: boolean;
};

export const SignOutBtn = ({ className, disabled = false }: Props) => {
    const [loading, setLoading] = useState(false);
    const { logout } = useContext(AuthContext);

    const handleClick = async () => {
        if (loading || disabled) return;
        setLoading(true);
        await logout();
    };

    return (
        <ButtonLink
            url="#"
            activityIndicator={false}
            onClick={handleClick}
            tabIndex={0}
            className={cn("h-nav-item text-danger-foreground items-center justify-start", className)}
        >
            {loading ? <LoadingSpinner size="xs" /> : <LogOutIcon className="w-btn-icon h-btn-icon" />}
            Sign out
        </ButtonLink>
    );
};

const ProfileDropDown = ({ session, isPopoverOpen }: { session: LoggedInUserData; isPopoverOpen: boolean }) => {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-3">
            <div className="w-full flex items-center justify-center gap-2">
                <ImgWrapper
                    src={imageUrl(session?.avatarUrl)}
                    alt={session.userName}
                    fallback={fallbackUserIcon}
                    className="h-14 rounded-full"
                />

                <div className="w-full flex flex-col items-start justify-center overflow-x-auto">
                    <h2 className="text-lg leading-none font-semibold">{session.name}</h2>
                    <div className="flex items-center justify-start gap-1">
                        <p className="leading-none">
                            <span className="leading-none select-none">@</span>
                            {session.userName}
                        </p>
                        <CopyBtn text={session.userName} id={session.userName} />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="w-full flex flex-col items-center justify-center gap-1">
                <ButtonLink url={`/user/${session.userName}`} exactTailMatch={false}>
                    <UserIcon className="w-btn-icon h-btn-icon" />
                    Your profile
                </ButtonLink>
                <ButtonLink url="/dashboard" exactTailMatch={false}>
                    <LayoutDashboardIcon className="w-btn-icon h-btn-icon" />
                    Dashboard
                </ButtonLink>
                <ButtonLink url="/settings" exactTailMatch={false}>
                    <Settings2Icon className="w-btn-icon h-btn-icon" />
                    Settings
                </ButtonLink>
            </div>

            <Separator />

            <SignOutBtn disabled={!isPopoverOpen} />
        </div>
    );
};

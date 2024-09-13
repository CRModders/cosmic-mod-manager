import Redirect from "@/components/ui/redirect";
import { useSession } from "@/src/contexts/auth";

export const RedirectIfLoggedIn = ({ children, redirectTo }: { children?: React.ReactNode; redirectTo: string }) => {
    const { session } = useSession();

    if (session?.id) return <Redirect redirectTo={redirectTo} />;
    return children;
};

export const RedirectIfNotLoggedIn = ({ children, redirectTo }: { children?: React.ReactNode; redirectTo: string }) => {
    const { session } = useSession();

    if (session !== undefined && !session?.id) return <Redirect redirectTo={redirectTo} />;
    return children;
};

export const RedirectTo = ({ redirectTo }: { redirectTo: string }) => {
    return <Redirect redirectTo={redirectTo} />;
};

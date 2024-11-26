import { Link } from "@remix-run/react";

const SessionsPageLink = () => {
    return (
        <div className="w-full flex items-center justify-start gap-1 text-sm">
            Didn't request the email?
            <Link to="/settings/sessions" className="text-link-foreground hover:text-link-hover-foreground">
                Check loggedIn sessions
            </Link>
        </div>
    );
};

export default SessionsPageLink;

import { Link } from "react-router-dom";

const SessionsPageLink = () => {
    return (
        <div className="w-full flex items-center justify-start gap-1 text-sm">
            Didn't request the email?
            <Link
                to="/settings/sessions"
                className="text-blue-600 dark:text-blue-400 hover:bg-blue-600/10 dark:hover:bg-blue-400/10 px-1.5 py-0.5"
            >
                Check loggedIn sessions
            </Link>
        </div>
    );
};

export default SessionsPageLink;

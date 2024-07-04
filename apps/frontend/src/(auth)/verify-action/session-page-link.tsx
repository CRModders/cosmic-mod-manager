import { Link } from "react-router-dom";

const SecurityLink = () => {
    return (
        <p className="flex flex-wrap items-center justify-start text-sm text-foreground-muted">
            Didn't request the email?&nbsp;
            <Link
                to={"/settings/sessions"}
                aria-label="Check logged in sessions"
                className="text-blue-500 dark:text-blue-400t p-1 rounded hover:bg-blue-500/10 dark:hover:bg-blue-400/10"
            >
                Check logged in sessions
            </Link>
        </p>
    );
};

export default SecurityLink;

import Link from "~/components/ui/link";

const SessionsPageLink = () => {
    return (
        <div className="w-full flex items-center justify-start gap-1 text-sm">
            Didn't request the email?
            <Link to="/settings/sessions" className="text_link">
                Check loggedIn sessions
            </Link>
        </div>
    );
};

export default SessionsPageLink;

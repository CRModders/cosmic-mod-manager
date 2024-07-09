import { KeyIcon, TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AddPasswordForm from "./add-password";
import RemovePasswordForm from "./remove-password";

type Props = {
    email: string | null;
    hasAPassword?: boolean | undefined;
    fetchPageData: () => Promise<void>;
};

const PasswordSection = ({ email, hasAPassword, fetchPageData }: Props) => {
    if (!hasAPassword) {
        return (
            <div className="w-full flex flex-wrap items-end justify-between gap-2">
                <div className="flex flex-col items-start justify-center">
                    <p className="text-lg font-semibold text-foreground">Password</p>
                    <p className="text-base text-foreground-muted">Add a password to use credentials login</p>
                </div>
                <AddPasswordForm email={email || ""} />
            </div>
        );
    }

    return (
        <div className="w-full flex flex-wrap items-end justify-between gap-2">
            <div className="flex flex-col items-start justify-center">
                <p className="text-lg font-semibold text-foreground">Password</p>
                <p className="text-base text-foreground-muted">Change your account password</p>
            </div>

            <div className="flex flex-wrap gap-2">
                <Link
                    aria-label="Change password"
                    to={"/change-password"}
                    className="flex items-center justify-center rounded-lg"
                >
                    <Button
                        className="flex items-center justify-center gap-2"
                        variant="secondary"
                        aria-label="Change password"
                        tabIndex={-1}
                    >
                        <KeyIcon size="1rem" className="text-foreground" />
                        Change password
                    </Button>
                </Link>
                <RemovePasswordForm email={email || ""} fetchPageData={fetchPageData}>
                    <Button className="gap-2 text-danger-text" variant={"secondary"} aria-label="Remove password">
                        <TrashIcon size="1rem" />
                        Remove password
                    </Button>
                </RemovePasswordForm>
            </div>
        </div>
    );
};

export default PasswordSection;

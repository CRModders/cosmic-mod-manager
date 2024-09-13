import type { LoggedInUserData } from "@shared/types";
import AddPasswordForm from "./add-password";
import RemovePasswordForm from "./remove-password";
import { KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Props {
    session: LoggedInUserData;
}

const ManagePasswords = ({ session }: Props) => {
    if (!session?.hasAPassword) {
        return <AddPasswordForm />;
    }

    return (
        <div className="flex flex-wrap gap-panel-cards">
            <Link to="/change-password">
                <Button variant={"secondary"} tabIndex={-1}>
                    <KeyRound className="w-btn-icon h-btn-icon" />
                    Change password
                </Button>
            </Link>
            <RemovePasswordForm />
        </div>
    );
};

export default ManagePasswords;

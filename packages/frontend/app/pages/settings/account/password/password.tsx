import type { LoggedInUserData } from "@shared/types";
import { KeyRound } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "~/components/ui/link";
import AddPasswordForm from "./add-password";
import RemovePasswordForm from "./remove-password";

interface Props {
    session: LoggedInUserData;
}

export default function ManagePassword({ session }: Props) {
    if (!session?.hasAPassword) {
        return <AddPasswordForm email={session.email} />;
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
}

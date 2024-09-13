import { FormErrorMessage } from "@/components/ui/form-message";
import { FullPageSpinner } from "@/components/ui/spinner";
import useFetch from "@/src/hooks/fetch";
import { getConfirmActionTypeFromStringName } from "@shared/lib/utils/convertors";
import { ConfirmationType } from "@shared/types";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ChangePasswordCard from "./change-password";
import ConfirmNewPasswordCard from "./confirm-new-password";
import DeleteAccountConfirmationCard from "./delete-account";

const ConfirmActionPage = () => {
    const [searchParams] = useSearchParams();
    const [actionType, setActionType] = useState<ConfirmationType | null | undefined>(undefined);
    const code = searchParams.get("code");

    const getActionType = async () => {
        if (!code) return setActionType(null);

        const response = await useFetch("/api/user/get-confirm-action-type", {
            method: "POST",
            body: JSON.stringify({ code }),
        });
        const data = await response.json();
        setActionType(getConfirmActionTypeFromStringName(data?.actionType || ""));
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        getActionType();
    }, []);

    return (
        <div className="w-full full_page flex flex-col items-center justify-center px-4">
            {actionType === undefined ? (
                <FullPageSpinner />
            ) : !code || actionType === null ? (
                <div className="w-full max-w-md flex flex-col items-center justify-center gap-6">
                    <FormErrorMessage text={"Invalid or expired code"} />
                    <Link to="/" className="hover:underline underline-offset-2 font-semibold">
                        Home
                    </Link>
                </div>
            ) : (
                <ActionCard actionType={actionType} code={code} />
            )}
        </div>
    );
};

const ActionCard = ({ actionType, code }: { actionType: ConfirmationType; code: string }) => {
    switch (actionType) {
        case ConfirmationType.CONFIRM_NEW_PASSWORD:
            return <ConfirmNewPasswordCard code={code} />;
        case ConfirmationType.CHANGE_ACCOUNT_PASSWORD:
            return <ChangePasswordCard code={code} />;
        case ConfirmationType.DELETE_USER_ACCOUNT:
            return <DeleteAccountConfirmationCard code={code} />;
        default:
            return (
                <div className="w-full max-w-md flex flex-col items-center justify-center gap-6">
                    <FormErrorMessage text={"Invalid or expired code"} />
                    <Link to="/" className="hover:underline underline-offset-2 font-semibold">
                        Home
                    </Link>
                </div>
            );
    }
};

export default ConfirmActionPage;

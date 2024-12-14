import { ConfirmationType } from "@shared/types";
import { FormErrorMessage } from "~/components/ui/form-message";
import Link from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import ChangePasswordCard from "./change-password";
import ConfirmNewPasswordCard from "./confirm-new-password";
import DeleteAccountConfirmationCard from "./delete-account";

interface Props {
    actionType: ConfirmationType | null;
    code: string | null;
}

export default function ConfirmActionPage({ actionType, code }: Props) {
    const { t } = useTranslation();

    return (
        <main className="w-full full_page flex flex-col items-center justify-center px-4">
            {!code || actionType === null ? (
                <div className="w-full max-w-md flex flex-col items-center justify-center gap-6">
                    <FormErrorMessage text={t.auth.invalidCode} />
                    <Link to="/" className="hover:underline underline-offset-2 font-semibold">
                        {t.common.home}
                    </Link>
                </div>
            ) : (
                <ActionCard actionType={actionType} code={code} />
            )}
        </main>
    );
}

function ActionCard({ actionType, code }: { actionType: ConfirmationType; code: string }) {
    const { t } = useTranslation();

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
                    <FormErrorMessage text={t.auth.invalidCode} />
                    <Link to="/" className="hover:underline underline-offset-2 font-semibold">
                        {t.common.home}
                    </Link>
                </div>
            );
    }
}

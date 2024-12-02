import { useSearchParams } from "@remix-run/react";
import clientFetch from "@root/utils/client-fetch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FormErrorMessage, FormSuccessMessage } from "~/components/ui/form-message";
import { LoadingSpinner } from "~/components/ui/spinner";

export default function RevokeSessionPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [searchParams] = useSearchParams();

    async function RevokeSession(code: string) {
        try {
            setIsLoading(true);

            const response = await clientFetch(`/api/auth/sessions/${code}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || "Error");
            }
            setSuccessMessage(result?.message || "Success");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const code = searchParams.get("code");
        if (code) {
            RevokeSession(code);
        }
    }, [searchParams]);

    return (
        <main className="w-full full_page flex items-center justify-center">
            <div className="w-full max-w-md flex items-center justify-center">
                {isLoading ? (
                    <LoadingSpinner />
                ) : successMessage ? (
                    <FormSuccessMessage text={successMessage} className="w-fit" />
                ) : (
                    <FormErrorMessage text="Error" className="w-fit" />
                )}
            </div>
        </main>
    );
}

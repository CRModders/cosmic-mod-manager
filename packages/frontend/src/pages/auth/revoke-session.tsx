import { FormErrorMessage, FormSuccessMessage } from "@/components/ui/form-message";
import { LoadingSpinner } from "@/components/ui/spinner";
import useFetch from "@/src/hooks/fetch";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const RevokeSessionPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [searchParams] = useSearchParams();

    const RevokeSession = async (code: string) => {
        try {
            setIsLoading(true);

            const response = await useFetch(`/api/auth/sessions/${code}`, {
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
    };

    useEffect(() => {
        const code = searchParams.get("code");
        if (code) {
            RevokeSession(code);
        }
    }, [searchParams]);

    return (
        <div className="w-full full_page flex items-center justify-center">
            <div className="w-full max-w-md flex items-center justify-center">
                {isLoading ? (
                    <LoadingSpinner />
                ) : successMessage ? (
                    <FormSuccessMessage text={successMessage} className="w-fit" />
                ) : (
                    <FormErrorMessage text="Error" className="w-fit" />
                )}
            </div>
        </div>
    );
};

export const Component = RevokeSessionPage;

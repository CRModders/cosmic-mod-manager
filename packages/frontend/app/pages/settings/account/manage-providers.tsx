import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import clientFetch from "@root/utils/client-fetch";
import { Capitalize } from "@shared/lib/utils";
import { getAuthProviderFromString } from "@shared/lib/utils/convertors";
import { AuthActionIntent, type AuthProvider, type LinkedProvidersListData } from "@shared/types";
import { Link2Icon, SettingsIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import RefreshPage from "~/components/refresh-page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { LoadingSpinner } from "~/components/ui/spinner";
import { authProvidersList } from "~/pages/auth/oauth-providers";

export default function ManageAuthProviders({ linkedAuthProviders }: { linkedAuthProviders: LinkedProvidersListData[] }) {
    const [isLoading, setIsLoading] = useState<{ value: boolean; provider: AuthProvider | null }>({ value: false, provider: null });

    const navigate = useNavigate();
    const location = useLocation();

    const redirectToOauthPage = async (provider: AuthProvider) => {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, provider: provider });

            const response = await clientFetch(`/api/auth/${AuthActionIntent.LINK}/${provider}`);
            const result = await response.json();

            if (!response.ok || !result?.url) {
                setIsLoading({ value: false, provider: null });
                return toast.error(result?.message || "Error");
            }

            toast.success("Redirecting...");
            window.location.href = result.url;
        } catch (err) {
            console.error(err);
            setIsLoading({ value: false, provider: null });
        }
    };

    const removeAuthProvider = async (provider: AuthProvider) => {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, provider: provider });

            const response = await clientFetch(`/api/auth/${AuthActionIntent.LINK}/${provider}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || "Error");
            }

            RefreshPage(navigate, location);
            toast.success(result?.message || "Success");
        } finally {
            setIsLoading({ value: false, provider: null });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"secondary"}>
                    <SettingsIcon className="w-btn-icon h-btn-icon" />
                    Manage providers
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Linked auth providers</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>Manage login auth provider for you account</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <DialogBody>
                    <Accordion type="single" collapsible className="w-full">
                        {authProvidersList.map((authProvider) => {
                            let additionalProviderDetails = null;
                            for (const linkedProvider of linkedAuthProviders) {
                                if (getAuthProviderFromString(linkedProvider.providerName) === authProvider.name) {
                                    additionalProviderDetails = linkedProvider;
                                    break;
                                }
                            }

                            return (
                                <AccordionItem key={authProvider.name} value={authProvider.name} className="border-transparent">
                                    <AccordionTrigger className="text-base">
                                        <div className="flex items-center justify-start gap-2">
                                            <i className="w-6 flex items-center justify-start">{authProvider.icon}</i>
                                            {Capitalize(authProvider.name)}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="w-full flex items-center justify-between">
                                        <p className="text-muted-foreground">
                                            {additionalProviderDetails ? (
                                                <span className="font-medium text-foreground">
                                                    {additionalProviderDetails.providerAccountEmail}
                                                </span>
                                            ) : (
                                                <>Link {Capitalize(authProvider.name)} to your account</>
                                            )}
                                        </p>

                                        {additionalProviderDetails ? (
                                            <Button
                                                variant={"secondary-destructive"}
                                                disabled={isLoading.value}
                                                onClick={() => removeAuthProvider(getAuthProviderFromString(authProvider.name))}
                                            >
                                                {isLoading.provider === getAuthProviderFromString(authProvider.name) ? (
                                                    <LoadingSpinner size="xs" />
                                                ) : (
                                                    <Trash2Icon className="w-btn-icon h-btn-icon" />
                                                )}
                                                Remove
                                            </Button>
                                        ) : (
                                            <Button
                                                variant={"secondary"}
                                                onClick={() => redirectToOauthPage(getAuthProviderFromString(authProvider.name))}
                                                disabled={isLoading.value}
                                            >
                                                {isLoading.provider === getAuthProviderFromString(authProvider.name) ? (
                                                    <LoadingSpinner size="xs" />
                                                ) : (
                                                    <Link2Icon className="w-btn-icon h-btn-icon" />
                                                )}
                                                Link
                                            </Button>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

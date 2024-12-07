import clientFetch from "@root/utils/client-fetch";
import { disableInteractions, enableInteractions } from "@root/utils/dom";
import { AuthActionIntent, AuthProvider } from "@shared/types";
import React from "react";
import { toast } from "sonner";
import { DiscordIcon, GithubIcon, GitlabIcon, GoogleIcon } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { LoadingSpinner } from "~/components/ui/spinner";

export const ConfiguredAuthProviders = [AuthProvider.GITHUB, AuthProvider.DISCORD, AuthProvider.GOOGLE, AuthProvider.GITLAB];

export const authProvidersList = [
    {
        name: AuthProvider.GITHUB,
        icon: <GithubIcon size="1.3rem" className="text-foreground" />,
    },
    {
        name: AuthProvider.DISCORD,
        icon: <DiscordIcon size="1.4rem" className="text-foreground" />,
    },
    {
        name: AuthProvider.GOOGLE,
        icon: <GoogleIcon size="1.4rem" className="text-foreground" />,
    },
    {
        name: AuthProvider.GITLAB,
        icon: <GitlabIcon size="1.5rem" className="text-foreground" />,
    },
];

export default function OAuthProvidersWidget({
    actionIntent = AuthActionIntent.SIGN_IN,
    disabled = false,
    isLoading,
    setIsLoading,
}: {
    actionIntent: AuthActionIntent;
    disabled?: boolean;
    isLoading: {
        value: boolean;
        provider: AuthProvider | null;
    };
    setIsLoading: React.Dispatch<
        React.SetStateAction<{
            value: boolean;
            provider: AuthProvider | null;
        }>
    >;
}) {
    async function redirectToOauthPage(provider: AuthProvider) {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, provider: provider });
            disableInteractions();

            const response = await clientFetch(`/api/auth/${actionIntent}/${provider}`);
            const result = await response.json();

            if (!response.ok || !result?.url) {
                enableInteractions();
                setIsLoading({ value: false, provider: null });
                return toast.error(result?.message || "Error");
            }

            toast.success("Redirecting...");
            window.location.href = result.url;
        } catch (err) {
            console.error(err);
            setIsLoading({ value: false, provider: null });
            enableInteractions();
        }
    }

    return (
        <>
            {authProvidersList?.map((provider) => {
                return (
                    <React.Fragment key={provider.name}>
                        <Button
                            onClick={() => redirectToOauthPage(provider.name)}
                            aria-label={`Continue using ${provider.name}`}
                            className="w-full font-medium capitalize"
                            variant="secondary"
                            disabled={isLoading.value || disabled}
                        >
                            <i className="min-w-6 flex items-center justify-start">
                                {isLoading.provider === provider.name ? <LoadingSpinner size="xs" /> : provider.icon}
                            </i>
                            {provider.name}
                        </Button>
                    </React.Fragment>
                );
            })}
        </>
    );
}

import { DiscordIcon, GithubIcon, GitlabIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/spinner";
import useFetch from "@/src/hooks/fetch";
import { AuthActionIntent, AuthProviders } from "@shared/types";
import React from "react";
import { toast } from "sonner";

export const ConfiguredAuthProviders = [AuthProviders.GITHUB, AuthProviders.DISCORD, AuthProviders.GOOGLE, AuthProviders.GITLAB];

export const authProvidersList = [
    {
        name: AuthProviders.GITHUB,
        icon: <GithubIcon size="1.3rem" className="text-foreground" />,
    },
    {
        name: AuthProviders.DISCORD,
        icon: <DiscordIcon size="1.4rem" className="text-foreground" />,
    },
    {
        name: AuthProviders.GOOGLE,
        icon: <GoogleIcon size="1.4rem" className="text-foreground" />,
    },
    {
        name: AuthProviders.GITLAB,
        icon: <GitlabIcon size="1.5rem" className="text-foreground" />,
    },
];

const OAuthProvidersWidget = ({
    actionIntent = AuthActionIntent.SIGN_IN,
    disabled = false,
    isLoading,
    setIsLoading,
}: {
    actionIntent: AuthActionIntent;
    disabled?: boolean;
    isLoading: {
        value: boolean;
        provider: AuthProviders | null;
    };
    setIsLoading: React.Dispatch<
        React.SetStateAction<{
            value: boolean;
            provider: AuthProviders | null;
        }>
    >;
}) => {
    const redirectToOauthPage = async (provider: AuthProviders) => {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, provider: provider });

            const response = await useFetch(`/api/auth/${actionIntent}/get-oauth-url/${provider}`);
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
};

export default OAuthProvidersWidget;

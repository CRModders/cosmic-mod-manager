import { DiscordIcon, GithubIcon, GitlabIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import { AuthProvidersEnum } from "@root/types";
import React, { useState } from "react";
import { getSignInUrl } from "./auth";

export const ConfiguredAuthProviders = [
    AuthProvidersEnum.GITHUB,
    AuthProvidersEnum.DISCORD,
    AuthProvidersEnum.GOOGLE,
    AuthProvidersEnum.GITLAB,
];

export const authProvidersList = [
    {
        name: "Github",
        icon: <GithubIcon size="1.3rem" className="text-foreground-muted" />,
    },
    {
        name: "Discord",
        icon: <DiscordIcon size="1.4rem" className="text-foreground-muted" />,
    },
    {
        name: "Google",
        icon: <GoogleIcon size="1.4rem" className="text-foreground-muted" />,
    },
    {
        name: "Gitlab",
        icon: <GitlabIcon size="1.5rem" className="text-foreground-muted" />,
    },
];

const AuthProviders = () => {
    const [loading, setLoading] = useState(false);

    return (
        <>
            {authProvidersList?.map((provider) => {
                return (
                    <React.Fragment key={provider.name}>
                        <Button
                            onClick={async () => {
                                setLoading(true);
                                const signinUrl = await getSignInUrl(provider.name.toLowerCase() as AuthProvidersEnum);
                                window.location.href = signinUrl;
                            }}
                            aria-label={`Continue using ${provider.name}`}
                            className="w-full font-[500]"
                            variant="secondary"
                        >
                            <i className="w-8 flex items-center justify-start">{provider.icon}</i>
                            {provider.name}
                        </Button>
                    </React.Fragment>
                );
            })}
            {loading === true && <AbsolutePositionedSpinner />}
        </>
    );
};

export default AuthProviders;

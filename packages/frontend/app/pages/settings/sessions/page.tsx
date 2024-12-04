import { Tooltip } from "@radix-ui/react-tooltip";
import { useLocation, useNavigate } from "@remix-run/react";
import clientFetch from "@root/utils/client-fetch";
import { Capitalize } from "@shared/lib/utils";
import { AuthProvider, type LoggedInUserData } from "@shared/types";
import type { SessionListData } from "@shared/types/api";
import { KeyRoundIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import RefreshPage from "~/components/refresh-page";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import CopyBtn from "~/components/ui/copy-btn";
import { FormattedDate, TimePassedSince } from "~/components/ui/date";
import { DotSeparator } from "~/components/ui/separator";
import { LoadingSpinner } from "~/components/ui/spinner";
import { Switch } from "~/components/ui/switch";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { authProvidersList } from "~/pages/auth/oauth-providers";

interface Props {
    session: LoggedInUserData;
    loggedInSessions: SessionListData[];
}

export default function SessionsPage({ loggedInSessions, session: currSession }: Props) {
    const [isLoading, setIsLoading] = useState<{ value: boolean; sessionId: string }>({ value: false, sessionId: "" });
    const [showIp, setShowIp] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const revokeSession = async (sessionId: string) => {
        try {
            if (isLoading.value) return;
            setIsLoading({ value: true, sessionId: sessionId });

            const response = await clientFetch("/api/auth/sessions", {
                method: "DELETE",
                body: JSON.stringify({ sessionId: sessionId }),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || "Error");
            }

            toast.success(result?.message || "Success");
            RefreshPage(navigate, location);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading({ value: false, sessionId: "" });
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="gap-3">
                <div className="flex items-center justify-between gap-x-6 gap-y-2">
                    <CardTitle>Sessions</CardTitle>
                    <label className="flex gap-2 items-center justify-center text-sm text-muted-foreground">
                        Show IP Addresses
                        <Switch checked={showIp} onCheckedChange={setShowIp} />
                    </label>
                </div>
                <CardDescription>
                    These devices are currently logged into your account, you can revoke any session at any time. If you see something you
                    don't recognize, immediately revoke the session and change the password of the associated auth provider.
                </CardDescription>
            </CardHeader>
            <CardContent className="w-full flex items-center justify-center flex-col gap-form-elements relative min-h-24">
                {loggedInSessions.map((session) => {
                    return (
                        <TooltipProvider key={session.id}>
                            <div
                                key={session.id}
                                className="w-full flex flex-wrap gap-x-6 gap-y-3 items-center justify-between bg-background rounded py-3 px-4"
                            >
                                <div className="flex flex-col gap-2.5 sm:gap-1 grow">
                                    <div className="font-medium flex flex-wrap gap-x-2 items-center justify-start">
                                        <span>{session.browser}</span>
                                        <DotSeparator />
                                        <span>{session.os}</span>
                                        <DotSeparator />
                                        <div className="flex gap-2 items-center justify-center">
                                            {showIp ? (
                                                <span>{session.ip}</span>
                                            ) : (
                                                <span className="text-extra-muted-foreground" title={session.ip || ""}>
                                                    [IP hidden]
                                                </span>
                                            )}
                                            <CopyBtn text={session.ip || ""} id={`session-ip-${session.id}`} />
                                        </div>
                                    </div>

                                    <div className="w-full flex flex-wrap gap-x-2 items-center justify-start text-muted-foreground">
                                        {session.city || session.country ? (
                                            <>
                                                <span>
                                                    {session.city || ""}
                                                    {session.city && session.country && " - "}
                                                    {session.country || ""}
                                                </span>
                                                <DotSeparator />
                                            </>
                                        ) : null}

                                        <Tooltip>
                                            <TooltipTrigger className="cursor-text">
                                                <span>
                                                    Last accessed <TimePassedSince date={session.dateLastActive} />
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-shallower-background dark:bg-shallow-background">
                                                <FormattedDate date={session.dateLastActive} />
                                            </TooltipContent>
                                        </Tooltip>

                                        <DotSeparator />

                                        <Tooltip>
                                            <TooltipTrigger className="cursor-text">
                                                <span>
                                                    Created <TimePassedSince date={session.dateCreated} />
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-shallower-background dark:bg-shallow-background">
                                                <FormattedDate date={session.dateCreated} />
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>

                                    <div className="flex items-center justify-start mt-1">
                                        <Tooltip>
                                            <TooltipTrigger className="cursor-default flex gap-2 items-center justify-start text-muted-foreground">
                                                {session?.providerName !== AuthProvider.CREDENTIAL ? (
                                                    authProvidersList?.map((authProvider) => {
                                                        if (authProvider?.name.toLowerCase() === session?.providerName) {
                                                            return (
                                                                <React.Fragment key={authProvider.name}>
                                                                    {authProvider?.icon}
                                                                </React.Fragment>
                                                            );
                                                        }
                                                        return <React.Fragment key={authProvider.name}>{null}</React.Fragment>;
                                                    })
                                                ) : (
                                                    <KeyRoundIcon className="w-4 h-4" />
                                                )}
                                                <span className="capitalize">{session?.providerName}</span>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-shallower-background dark:bg-shallow-background">
                                                Session created using {Capitalize(session.providerName)} provider
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                                <div>
                                    {session.id === currSession?.sessionId ? (
                                        <span className="text-muted-foreground italic">Current session</span>
                                    ) : (
                                        <Button
                                            variant={"secondary-inverted"}
                                            className=""
                                            disabled={isLoading.value}
                                            onClick={() => {
                                                revokeSession(session.id);
                                            }}
                                        >
                                            {isLoading.value && isLoading.sessionId === session.id ? (
                                                <LoadingSpinner size="xs" />
                                            ) : (
                                                <XIcon className="w-btn-icon h-btn-icon" />
                                            )}
                                            Revoke session
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </TooltipProvider>
                    );
                })}
            </CardContent>
        </Card>
    );
}

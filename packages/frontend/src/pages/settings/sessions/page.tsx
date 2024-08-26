import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CopyBtn from "@/components/ui/copy-btn";
import { DotSeparator } from "@/components/ui/separator";
import { AbsolutePositionedSpinner, LoadingSpinner } from "@/components/ui/spinner";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate, timeSince } from "@/lib/utils";
import { useSession } from "@/src/contexts/auth";
import useFetch from "@/src/hooks/fetch";
import { Tooltip } from "@radix-ui/react-tooltip";
import { Capitalize } from "@shared/lib/utils";
import { AuthProviders } from "@shared/types";
import type { SessionListData } from "@shared/types/api";
import { useQuery } from "@tanstack/react-query";
import { KeyRoundIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "sonner";
import { authProvidersList } from "../../auth/oauth-providers";

const getLoggedInSessions = async () => {
    try {
        const response = await useFetch("/api/user/get-all-sessions");
        const sessions: SessionListData[] = (await response.json())?.sessions || [];
        return sessions;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const SessionsPage = () => {
    const [isLoading, setIsLoading] = useState<{ value: boolean; sessionId: string }>({ value: false, sessionId: "" });
    const { session: currSession } = useSession();
    const loggedInSessions = useQuery({ queryKey: ["logged-in-sessions"], queryFn: getLoggedInSessions });

    const revokeSession = async (sessionId: string) => {
        try {
            if (isLoading.value) return;
            setIsLoading({ value: true, sessionId: sessionId });

            const response = await useFetch("/api/auth/session/logout", {
                method: "POST",
                body: JSON.stringify({ sessionId }),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || "Error");
            }

            await loggedInSessions.refetch();
            toast.success(result?.message || "Success");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading({ value: false, sessionId: "" });
        }
    };

    if (!currSession?.id) return null;

    return (
        <>
            <Helmet>
                <title>Sessions | CRMM</title>
                <meta name="description" content="All devices where you are logged in." />
            </Helmet>

            <Card className="w-full">
                <CardHeader className="gap-2">
                    <CardTitle>Sessions</CardTitle>
                    <CardDescription>
                        These devices are currently logged into your account, you can revoke any session at any time. If you see something
                        you don't recognize, immediately revoke the session and change the password of the associated auth provider.
                    </CardDescription>
                </CardHeader>
                <CardContent className="w-full flex items-center justify-center flex-col gap-form-elements relative min-h-24">
                    {loggedInSessions.data?.length
                        ? loggedInSessions.data.map((session) => {
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
                                                    <span>{session.ip}</span>
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
                                                        <span>Last accessed {timeSince(new Date(session.dateLastActive))}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-shallower-background dark:bg-shallow-background">
                                                        {formatDate(new Date(session.dateLastActive))}
                                                    </TooltipContent>
                                                </Tooltip>

                                                <DotSeparator />

                                                <Tooltip>
                                                    <TooltipTrigger className="cursor-text">
                                                        <span>Created {timeSince(new Date(session.dateCreated))}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-shallower-background dark:bg-shallow-background">
                                                        {formatDate(new Date(session.dateCreated))}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>

                                            <div className="flex items-center justify-start mt-1">
                                                <Tooltip>
                                                    <TooltipTrigger className="cursor-default flex gap-2 items-center justify-start text-muted-foreground">
                                                        {session?.providerName !== AuthProviders.CREDENTIAL ? (
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
                                                    variant={"secondary"}
                                                    className="bg-card-background/70 hover:bg-card-background dark:bg-shallow-background dark:hover:bg-shallower-background/80"
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
                        })
                        : null}

                    {loggedInSessions.isFetching ? <AbsolutePositionedSpinner /> : null}
                </CardContent>
            </Card>
        </>
    );
};

export default SessionsPage;

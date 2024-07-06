import CopyBtn from "@/components/copy-btn";
import { KeyIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AbsolutePositionedSpinner, LoadingSpinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { authProvidersList } from "@/src/(auth)/oauth-providers";
import useFetch from "@/src/hooks/fetch";
import { AuthContext } from "@/src/providers/auth-provider";
import { Cross1Icon } from "@radix-ui/react-icons";
import type { AuthProvidersEnum, LocalUserSession } from "@root/types";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import SessionListPageWrapper from "./page-wrapper";
import Timestamp, { DotSeparator, TooltipWrapper } from "./timestamp";

type UserSession = {
    id: string;
    user_id: string;
    created_on: Date;
    last_used: Date;
    browser?: string;
    os?: string;
    ip_addr?: string;
    region?: string;
    country?: string;
    provider: AuthProvidersEnum;
};

const getLoggedInSessions = async () => {
    try {
        const response = await useFetch("/api/auth/session/get-logged-in-sessions");
        return (await response.json())?.data || [];
    } catch (err) {
        console.error(err);
        return [];
    }
};

const Sessions = () => {
    const [showWarning, setShowWarning] = useState<boolean>(true);
    const { session: userSession } = useContext(AuthContext);

    const loggedInSessions = useQuery<UserSession[]>({
        queryKey: ["Logged-in-user-sessions"],
        queryFn: () => getLoggedInSessions(),
    });
    const fetchLoggedInSessions = async () => {
        await loggedInSessions.refetch();
    };

    useEffect(() => {
        if (userSession === null) {
            window.location.pathname = "/login";
        }
    }, [userSession]);

    return (
        <>
            <Helmet>
                <title>Sessions | CRMM</title>
                <meta name="description" content="All devices where you are logged in." />
            </Helmet>

            <div className="w-full flex flex-col items-center justify-start pb-8 gap-4 min-h-[100vh]">
                <Card className="w-full px-5 py-4 rounded-lg">
                    <CardContent className="w-full flex flex-col items-center justify-center gap-4 m-0 p-0">
                        <SessionListPageWrapper showWarning={showWarning} setShowWarning={setShowWarning}>
                            <div className="w-full flex flex-wrap gap-4 items-center justify-between">
                                <h1 className="flex text-left text-2xl text-foreground-muted font-semibold">
                                    Sessions
                                </h1>
                            </div>
                            <div className="w-full flex flex-col items-center justify-center text-foreground-muted">
                                <p className="w-full text-left">
                                    These devices are currently logged into your account, you can revoke any session at
                                    any time. If you see something you don't recognize, immediately revoke the session
                                    and change the password of the associated auth provider.
                                </p>
                            </div>

                            <div className="w-full relative flex flex-col items-center justify-center gap-4 mt-4 min-h-24">
                                {userSession && loggedInSessions.data && (
                                    <SessionsList
                                        loggedInSessions={loggedInSessions.data}
                                        userSession={userSession}
                                        fetchLoggedInSessions={fetchLoggedInSessions}
                                    />
                                )}
                                {(userSession === undefined || loggedInSessions.isLoading === true) && (
                                    <AbsolutePositionedSpinner />
                                )}
                            </div>
                        </SessionListPageWrapper>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default Sessions;

type Props = {
    session_id: string;
    fetchLoggedInSessions: () => Promise<void>;
};

const RevokeBtn = ({ session_id, fetchLoggedInSessions }: Props) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    return (
        <Button
            variant="outline"
            aria-label="Revoke session"
            className="gap-2 hover:bg-bg-hover"
            onClick={async () => {
                if (loading) return;
                setLoading(true);

                const response = await useFetch("/api/auth/session/revoke-session", {
                    method: "POST",
                    body: JSON.stringify({ sessionId: session_id }),
                });
                const result = await response.json();
                if (result?.success === false) {
                    toast({ title: result?.message });
                }

                await fetchLoggedInSessions();
                setLoading(false);
            }}
            disabled={loading}
        >
            {loading ? <LoadingSpinner size="xs" /> : <Cross1Icon />}
            Revoke session
        </Button>
    );
};

const SessionsList = ({
    userSession,
    loggedInSessions,
    fetchLoggedInSessions,
}: { userSession: LocalUserSession; loggedInSessions: UserSession[]; fetchLoggedInSessions: () => Promise<void> }) => {
    return (
        <>
            {loggedInSessions?.map((session) => {
                return (
                    <div
                        key={session?.id}
                        className="w-full flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-body-background"
                    >
                        <div className="flex flex-col items-start justify-center gap-2 text-foreground-muted">
                            <div className="flex flex-col gap-y-2 sm:gap-0 items-center justify-center">
                                <div className="w-full flex flex-wrap items-center text-left text-foreground-muted sm:text-md font-semibold">
                                    <p>{session?.browser}</p>
                                    <DotSeparator />
                                    <p>{session?.os}</p>
                                    <DotSeparator />
                                    <div className="flex items-center justify-center gap-2">
                                        <p>{session?.ip_addr}</p>
                                        <CopyBtn
                                            text={session?.ip_addr || ""}
                                            className="hover:bg-background dark:hover:bg-background_dark p-1"
                                        />
                                    </div>
                                </div>

                                <div className="w-full flex flex-wrap items-center justify-start text-left text-base">
                                    {(session?.region || session?.country) && (
                                        <>
                                            <p>
                                                {session?.region} - {session?.country}
                                            </p>
                                            <DotSeparator />
                                        </>
                                    )}
                                    <Timestamp
                                        lastUsed={new Date(session?.last_used)}
                                        createdOn={new Date(session?.created_on)}
                                    />
                                </div>
                            </div>

                            <TooltipWrapper
                                text={`Session created using ${session?.provider} provider`}
                                className="text-sm sm:text-base flex items-center justify-start gap-2"
                            >
                                {session?.provider !== "credential" ? (
                                    authProvidersList?.map((authProvider) => {
                                        if (authProvider?.name.toLowerCase() === session?.provider) {
                                            return (
                                                <React.Fragment key={authProvider.name}>
                                                    {authProvider?.icon}
                                                </React.Fragment>
                                            );
                                        }
                                        return <React.Fragment key={authProvider.name}>{null}</React.Fragment>;
                                    })
                                ) : (
                                    <KeyIcon className="w-4 h-4" />
                                )}
                                <span className="capitalize">{session?.provider}</span>
                            </TooltipWrapper>
                        </div>

                        <div className="h-full flex items-center justify-center">
                            {userSession?.session_id && userSession?.session_id !== session.id ? (
                                <RevokeBtn session_id={session?.id} fetchLoggedInSessions={fetchLoggedInSessions} />
                            ) : (
                                <p className="italic dark:text-foreground-muted text-nowrap">Current session</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

import CopyBtn from "@/components/copy-btn";
import { KeyIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { authProvidersList } from "@/src/(auth)/oauth-providers";
import useFetch from "@/src/hooks/fetch";
import { AuthContext } from "@/src/providers/auth-provider";
import { Cross1Icon } from "@radix-ui/react-icons";
import type { AuthProviderType } from "@root/types";
import React, { useContext, useEffect, useState } from "react";
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
	provider: AuthProviderType;
};

const Sessions = () => {
	const [showWarning, setShowWarning] = useState<boolean>(true);
	const [loggedInSessions, setLoggedInSessions] = useState<UserSession[]>([]);
	const [loading, setLoading] = useState(false);
	const { session: userSession } = useContext(AuthContext);

	const fetchLoggedInSessions = async () => {
		if (loading) return;
		setLoading(true);

		const response = await useFetch("/api/auth/session/get-logged-in-sessions");
		const result = await response.json();
		setLoggedInSessions(result?.data || []);

		setLoading(false);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchLoggedInSessions();
	}, []);

	useEffect(() => {
		if (userSession === null) {
			window.location.pathname = "/login";
		}
	}, [userSession]);

	if (userSession === undefined || loading === true) {
		return (
			<div className="w-full min-h-[100vh] flex items-center justify-center">
				<Spinner size="2rem" />
			</div>
		);
	}
	return (
		<div className="w-full flex flex-col items-center justify-start pb-8 gap-4 min-h-[100vh]">
			<Card className="w-full px-5 py-4 rounded-lg">
				<CardContent className="w-full flex flex-col items-center justify-center gap-4 m-0 p-0">
					<SessionListPageWrapper showWarning={showWarning} setShowWarning={setShowWarning}>
						<div className="w-full flex flex-wrap gap-4 items-center justify-between">
							<h1 className="flex text-left text-2xl text-foreground-muted font-semibold">Sessions</h1>
						</div>
						<div className="w-full flex flex-col items-center justify-center text-foreground-muted">
							<p className="w-full text-left">
								These devices are currently logged into your account; you can revoke any session at any time
							</p>
							<p className="w-full text-left">
								If you see something you don't recognize, immediately revoke the session and change the password of the
								provider account which was used to create that session
							</p>
						</div>

						<div className="w-full flex flex-col items-center justify-center gap-4 mt-4">
							{loggedInSessions?.map((session) => {
								return (
									<div
										key={session?.id}
										className="w-full flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-background-shallow dark:bg-zinc-950/50"
									>
										<div className="flex flex-col items-start justify-center gap-2 text-foreground/80 dark:text-foreground_dark/80">
											<div className="flex flex-col gap-y-2 sm:gap-0 items-center justify-center">
												<div className="w-full flex flex-wrap items-center text-left text-foreground/80 dark:text-foreground_dark/90 sm:text-md font-semibold">
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
												text={`Session create using ${session?.provider} provider`}
												className="text-sm sm:text-base flex items-center justify-start gap-2"
											>
												{session?.provider !== "credential" ? (
													authProvidersList?.map((authProvider) => {
														if (authProvider?.name.toLowerCase() === session?.provider) {
															return <React.Fragment key={authProvider.name}>{authProvider?.icon}</React.Fragment>;
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
												<p className="italic text-foreground-muted text-nowrap">Current session</p>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</SessionListPageWrapper>
				</CardContent>
			</Card>
		</div>
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
			{loading ? <Spinner size="1rem" /> : <Cross1Icon />}
			Revoke session
		</Button>
	);
};

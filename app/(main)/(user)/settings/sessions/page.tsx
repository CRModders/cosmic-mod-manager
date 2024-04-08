//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import React from "react";
import { getLoggedInSessionsList } from "@/app/api/actions/auth";
import { Card, CardContent } from "@/components/ui/card";
import { dbSessionTokenCookieKeyName } from "@/config";

import { cookies } from "next/headers";
import SessionListPageWrapper from "./pageWrapper";
import authProvidersList from "@/app/(auth)/avaiableAuthProviders";

import { KeyIcon } from "@/components/Icons";
import RevokeBtn from "./revokeBtn";
import TooltipWrapper from "./TooltipWrapper";
import Timestamp, { DotSeparator } from "./Timestamp";
import CopyBtn from "@/components/copyBtn";

const SessionsPage = async () => {
	const sessionToken = cookies().get(dbSessionTokenCookieKeyName)?.value;
	const loggedInSessions = await getLoggedInSessionsList();

	return (
		<div className="w-full flex flex-col items-center justify-start pb-8 gap-4 min-h-[105dvh]">
			<Card className="w-full px-5 py-4 rounded-lg">
				<CardContent className="w-full flex flex-col items-center justify-center gap-4 m-0 p-0">
					<SessionListPageWrapper>
						<div className="w-full flex flex-wrap gap-4 items-center justify-between">
							<h1 className="flex text-left text-2xl text-foreground dark:text-foreground_dark">
								Sessions
							</h1>
						</div>
						<div className="w-full flex flex-col items-center justify-center text-foreground/80 dark:text-foreground_dark/80">
							<p className="w-full text-left">
								Here are all the devices that are currently logged in with your
								account. You can log out of each one individually.
							</p>
							<p className="w-full text-left">
								If you see an entry you don't recognize, log out of that device
								and change the password of the account which was used to create
								that session.
							</p>
						</div>

						<div className="w-full flex flex-col items-center justify-center gap-4 mt-4">
							{loggedInSessions?.map((session) => {
								return (
									<div
										key={session?.id}
										className="w-full flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-background_hover dark:bg-background_hover_dark"
									>
										<div className="flex flex-col items-start justify-center gap-2 text-foreground/80 dark:text-foreground_dark/80">
											<div className="flex flex-col gap-y-2 sm:gap-0 items-center justify-center">
												<div className="w-full flex flex-wrap items-center text-left text-foreground dark:text-foreground_dark sm:text-lg">
													<p>{session?.browser}</p>
													<DotSeparator />
													<p>{session?.os}</p>
													<DotSeparator />
													<div className="flex items-center justify-center gap-2">
														<p>{session?.ipAddr}</p>
														<CopyBtn
															text={session?.ipAddr}
															className="hover:bg-background dark:hover:bg-background_dark p-1"
														/>
													</div>
												</div>

												<div className="w-full flex flex-wrap items-center justify-start text-left">
													{(session?.region || session?.country) && (
														<>
															<p>
																{session?.region} - {session?.country}
															</p>
															<DotSeparator />
														</>
													)}
													<Timestamp
														lastUsed={session?.lastUsed}
														createdOn={session?.createdOn}
													/>
												</div>
											</div>
											<TooltipWrapper
												text={`This session was created using ${session?.provider} provider`}
												className="text-sm sm:text-base flex items-center justify-start gap-2"
											>
												{session?.provider !== "credentials" ? (
													authProvidersList?.map((authProvider) => {
														if (
															authProvider?.name.toLowerCase() ===
															session?.provider
														) {
															return (
																<React.Fragment key={authProvider.name}>
																	{authProvider?.icon}
																</React.Fragment>
															);
														}
														return (
															<React.Fragment key={authProvider.name}>
																{null}
															</React.Fragment>
														);
													})
												) : (
													<KeyIcon className="w-4 h-4" />
												)}
												<span className=" capitalize">{session?.provider}</span>
											</TooltipWrapper>
										</div>
										<div className="h-full flex items-center justify-center">
											{sessionToken !== session?.sessionToken ? (
												<RevokeBtn token={session?.sessionToken} />
											) : (
												<p className="italic text-foreground/80 dark:text-foreground_dark/80">
													Current&nbsp;session
												</p>
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

export default SessionsPage;

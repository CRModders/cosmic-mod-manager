import AvatarImg from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FullWidthSpinner } from "@/components/ui/spinner";
import { useSession } from "@/src/contexts/auth";
import useFetch from "@/src/hooks/fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import type { LinkedProvidersListData } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import { UserIcon } from "lucide-react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import DeleteAccountDialog from "./delete-account";
import EditProfileDialog from "./edit-profile";
import ManageAuthProviders from "./manage-providers";
import ManagePasswords from "./password/page";

const getLinkedAuthProviders = async (userId?: string) => {
    if (!userId) return null;
    try {
        const res = await useFetch("/api/user/get-linked-auth-providers");
        const providers: LinkedProvidersListData[] = (await res.json())?.providers || [];
        return providers;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const AccountSettingsPage = () => {
    const { session, isFetchingData, validateSession } = useSession();
    const linkedAuthProviders = useQuery({
        queryKey: ["linked-auth-providers"],
        queryFn: async () => getLinkedAuthProviders(session?.id),
    });

    const refetchLinkedAuthProviders = async () => {
        await linkedAuthProviders.refetch();
        return;
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (session?.id && !linkedAuthProviders.data?.length) linkedAuthProviders.refetch();
    }, [session, linkedAuthProviders.data]);

    if (session === null) return null;

    return (
        <>
            <Helmet>
                <title>Account settings | {SITE_NAME_SHORT}</title>
                <meta name="description" content={`Your ${SITE_NAME_SHORT} account settings`} />
            </Helmet>
            {session === undefined || linkedAuthProviders.isLoading ? (
                <FullWidthSpinner />
            ) : (
                <>
                    <Card className="w-full">
                        <CardHeader className="w-full flex flex-row items-center justify-between py-2">
                            <CardTitle className="flex w-fit">User profile</CardTitle>
                            <EditProfileDialog
                                session={session}
                                isFetchingData={isFetchingData}
                                linkedAuthProviders={linkedAuthProviders.data || []}
                                validateSession={validateSession}
                            />
                        </CardHeader>
                        <CardContent>
                            <div className="w-full flex flex-col items-center justify-center my-2">
                                <div className="w-full flex flex-wrap items-center justify-start gap-6">
                                    <AvatarImg
                                        url={session?.avatarUrl || ""}
                                        alt={session?.userName}
                                        fallback={<UserIcon className="w-1/2 h-1/2 text-muted-foreground" />}
                                        wrapperClassName="h-24"
                                    />

                                    <div className="grow max-w-full flex flex-col items-start justify-center">
                                        <h1 className="flex w-full items-center justify-start leading-tight text-xl font-semibold">
                                            {session?.name}
                                        </h1>
                                        <div className="overflow-x-auto flex w-full items-center justify-start">
                                            <p className="text-foreground py-1 leading-tight">
                                                <span aria-hidden className="text-extra-muted-foreground select-none">
                                                    @
                                                </span>
                                                {session?.userName}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Account security</CardTitle>
                        </CardHeader>
                        <CardContent className="gap-6">
                            <div className="flex flex-col items-start justify-center max-w-md w-full gap-1.5">
                                <Label className="">Email</Label>
                                <Input readOnly value={session?.email} />
                            </div>

                            <div className="w-full flex flex-wrap items-end gap-x-8 justify-between gap-2">
                                <div className="flex flex-col items-start justify-start gap-1.5 flex-shrink-0">
                                    <Label>Password</Label>
                                    {session.hasAPassword ? (
                                        <p className="text-muted-foreground">Change your account password</p>
                                    ) : (
                                        <p className="text-muted-foreground">Add a password to use credentials login</p>
                                    )}
                                </div>

                                <ManagePasswords session={session} />
                            </div>

                            <div className="w-full flex flex-wrap items-end gap-x-8 justify-between gap-2">
                                <div className="flex flex-col items-start justify-start gap-1.5">
                                    <Label>Manage authentication providers</Label>
                                    <p className="text-muted-foreground">
                                        Add or remove login methods from your account.
                                    </p>
                                </div>

                                <ManageAuthProviders
                                    linkedAuthProviders={linkedAuthProviders.data || []}
                                    refetchLinkedAuthProviders={refetchLinkedAuthProviders}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Delete account</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full flex flex-wrap items-center justify-between gap-x-12 gap-y-4">
                                <p className="text-muted-foreground max-w-xl">
                                    Once you delete your account, there is no going back. Deleting your account will
                                    remove all of your data from our servers.
                                </p>

                                <DeleteAccountDialog />
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </>
    );
};

export default AccountSettingsPage;

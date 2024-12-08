import type { LinkedProvidersListData, LoggedInUserData } from "@shared/types";
import { CardContent, CardHeader, CardTitle, SectionCard } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import DeleteAccountDialog from "./delete-account";
import ManageAuthProviders from "./manage-providers";
import ManagePassword from "./password/password";

interface Props {
    session: LoggedInUserData;
    linkedAuthProviders: LinkedProvidersListData[];
}

export default function AccountSettingsPage({ session, linkedAuthProviders }: Props) {
    return (
        <>
            <SectionCard className="w-full">
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

                        <ManagePassword session={session} />
                    </div>

                    <div className="w-full flex flex-wrap items-end gap-x-8 justify-between gap-2">
                        <div className="flex flex-col items-start justify-start gap-1.5">
                            <Label>Manage authentication providers</Label>
                            <p className="text-muted-foreground">Add or remove login methods from your account.</p>
                        </div>

                        <ManageAuthProviders linkedAuthProviders={linkedAuthProviders || []} />
                    </div>
                </CardContent>
            </SectionCard>

            <SectionCard className="w-full">
                <CardHeader>
                    <CardTitle>Delete account</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full flex flex-wrap items-center justify-between gap-x-12 gap-y-4">
                        <p className="text-muted-foreground max-w-xl">
                            Once you delete your account, there is no going back. Deleting your account will remove all of your data from
                            our servers.
                        </p>

                        <DeleteAccountDialog />
                    </div>
                </CardContent>
            </SectionCard>
        </>
    );
}

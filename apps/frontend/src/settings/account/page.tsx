import { ContentWrapperCard } from "@/components/panel-layout";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/ui/spinner";
import useFetch from "@/src/hooks/fetch";
import { AuthContext } from "@/src/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import DeleteAccountSection from "./delete-account";
import ManageProviders from "./manage-providers";
import PasswordSection from "./password";
import EditProfileDialog from "./profile-details";

const getLinkedProviders = async () => {
    try {
        const res = await useFetch("/api/user/linked-auth-providers");
        return (await res.json())?.data || [];
    } catch (err) {
        console.error(err);
        return [];
    }
};

const getToKnowIfUserHasAPAssword = async () => {
    try {
        const res = await useFetch("/api/user/has-password");
        return (await res.json())?.hasPassword || false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const AccountSettingsPage = () => {
    const { session, setNewSession } = useContext(AuthContext);

    const linkedProviders = useQuery({ queryKey: ["linked-auth-providers-list"], queryFn: () => getLinkedProviders() });
    const hasAPassword = useQuery({ queryKey: ["user-has-a-password"], queryFn: () => getToKnowIfUserHasAPAssword() });

    const fetchPageData = async () => {
        await Promise.all([linkedProviders.refetch(), hasAPassword.refetch()]);
    };

    useEffect(() => {
        if (session === null) {
            window.location.pathname = "/login";
        }
    }, [session]);

    if (session === undefined || linkedProviders.data?.length === 0 || hasAPassword.data === undefined) {
        return (
            <>
                <Helmet>
                    <title>... | CRMM</title>
                </Helmet>
                <div className="py-12 flex">
                    <LoadingSpinner size="lg" />
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>Account settings | CRMM</title>
                <meta name="description" content="All devices where you are logged in." />
            </Helmet>
            <div className="w-full flex flex-col items-center justify-start pb-8 gap-card-gap">
                <ContentWrapperCard>
                    <div className="w-full flex flex-wrap gap-4 items-center justify-between">
                        <h2 className="flex text-left text-xl font-semibold text-foreground-muted">User profile</h2>
                        <div className="flex h-full items-center justify-center">
                            <EditProfileDialog
                                name={session?.name || ""}
                                username={session?.user_name || ""}
                                currProfileProvider={session?.avatar_provider}
                                setNewSession={setNewSession}
                                linkedProviders={linkedProviders.data || []}
                            />
                        </div>
                    </div>

                    <div className="w-full flex items-center justify-start flex-wrap gap-6">
                        <div className="flex items-center justify-center aspect-square h-28 rounded-full bg-background-shallow overflow-hidden">
                            {session?.avatar_image ? (
                                <img src={session?.avatar_image} alt={`${session?.user_name} `} className="w-full" />
                            ) : (
                                <span aria-hidden role="img" className="text-3xl font-semibold text-foreground/50">
                                    {session?.name[0]}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col items-start justify-center">
                            <h1 className="text-xl font-semibold">{session?.name}</h1>
                            <p className="text-foreground">
                                <span className="text-foreground/50"> @</span>
                                {session?.user_name}
                            </p>
                        </div>
                    </div>
                </ContentWrapperCard>

                <ContentWrapperCard>
                    <div className="w-full flex flex-wrap gap-4 items-center justify-between">
                        <h2 className="flex text-left text-xl font-semibold text-foreground-muted">Account security</h2>
                    </div>

                    <div className="w-full flex flex-col items-center justify-center my-2 gap-8 sm:gap-6">
                        <div className="w-full flex flex-col items-start justify-center gap-1">
                            <p className="text-lg font-semibold text-foreground">Email</p>
                            <form
                                className="w-full flex items-center justify-start"
                                name="Email"
                                onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
                            >
                                {session?.email && (
                                    <Input
                                        type="email"
                                        placeholder="johndoe@xyz.com"
                                        className="grow min-w-48 sm:max-w-96"
                                        readOnly
                                        value={session?.email}
                                    />
                                )}
                            </form>
                        </div>

                        <PasswordSection
                            email={session?.email || ""}
                            hasAPassword={hasAPassword.data}
                            fetchPageData={fetchPageData}
                        />

                        <ManageProviders
                            linkedProviders={linkedProviders.data}
                            fetchLinkedProviders={async () => {
                                await linkedProviders.refetch();
                            }}
                        />
                    </div>
                </ContentWrapperCard>

                <ContentWrapperCard>
                    <div className="w-full flex flex-wrap gap-4 items-center justify-between">
                        <h2 className="flex text-left text-xl font-semibold text-foreground-muted">Delete account</h2>
                    </div>
                    <DeleteAccountSection />
                </ContentWrapperCard>
            </div>
        </>
    );
};

export default AccountSettingsPage;

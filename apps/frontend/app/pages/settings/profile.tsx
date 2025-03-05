import { fallbackUserIcon } from "@app/components/icons";
import RefreshPage from "@app/components/misc/refresh-page";
import { Button } from "@app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card";
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { Textarea } from "@app/components/ui/textarea";
import { SITE_NAME_SHORT } from "@app/utils/constants";
import type { z } from "@app/utils/schemas";
import { profileUpdateFormSchema } from "@app/utils/schemas/settings";
import { handleFormError } from "@app/utils/schemas/utils";
import type { LoggedInUserData } from "@app/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import IconPicker from "~/components/icon-picker";
import { VariantButtonLink, useNavigate } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import { UserProfilePath } from "~/utils/urls";

interface Props {
    session: LoggedInUserData;
}

function initForm(user: LoggedInUserData) {
    return {
        name: user.name || "",
        userName: user.userName,
        avatar: user.avatar || "",
        bio: user.bio || "",
    };
}

export function ProfileSettingsPage({ session }: Props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const initialValues = initForm(session);
    const form = useForm<z.infer<typeof profileUpdateFormSchema>>({
        resolver: zodResolver(profileUpdateFormSchema),
        defaultValues: initialValues,
    });
    form.watch();

    async function saveSettings(values: z.infer<typeof profileUpdateFormSchema>) {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", values.name || "");
            formData.append("userName", values.userName);
            formData.append("avatar", values.avatar || "");
            formData.append("bio", values.bio || "");

            const response = await clientFetch("/api/user", {
                method: "PATCH",
                body: formData,
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            RefreshPage(navigate, location);
            toast.success(result?.message || t.common.success);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.settings.profileInfo}</CardTitle>
                <CardDescription>{t.settings.profileInfoDesc(SITE_NAME_SHORT)}</CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                        className="w-full flex flex-col items-start justify-start gap-form-elements"
                    >
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <IconPicker
                                    icon={form.getValues().avatar}
                                    fieldName={field.name}
                                    onChange={field.onChange}
                                    fallbackIcon={fallbackUserIcon}
                                    originalIcon={session.avatar || ""}
                                />
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground font-bold" htmlFor="username-input">
                                        {t.form.username}
                                        <FormMessage />
                                    </FormLabel>
                                    <Input {...field} className="md:w-[32ch]" id="username-input" autoComplete="off" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground font-bold" htmlFor="displayname-input">
                                        {t.form.displayName}
                                        <FormMessage />
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        className="md:w-[32ch]"
                                        id="displayname-input"
                                        autoComplete="off"
                                        placeholder={form.getValues().userName}
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-col items-start justify-center">
                                        <FormLabel className="text-foreground font-bold" htmlFor="user-description-input">
                                            {t.settings.bio}
                                            <FormMessage />
                                        </FormLabel>
                                        <FormDescription>{t.settings.bioDesc}</FormDescription>
                                    </div>

                                    <Textarea
                                        {...field}
                                        className="resize-none md:w-[48ch] min-h-32"
                                        spellCheck="false"
                                        id="user-description-input"
                                    />
                                </FormItem>
                            )}
                        />

                        <div className="w-full flex flex-wrap items-center mt-2 gap-x-3 gap-y-2">
                            <Button
                                type="submit"
                                disabled={JSON.stringify(initialValues) === JSON.stringify(form.getValues()) || isLoading}
                                onClick={async () => {
                                    await handleFormError(async () => {
                                        const parsedValues = await profileUpdateFormSchema.parseAsync(form.getValues());
                                        saveSettings(parsedValues);
                                    }, toast.error);
                                }}
                            >
                                {isLoading ? <LoadingSpinner size="xs" /> : <SaveIcon aria-hidden className="w-btn-icon h-btn-icon" />}
                                {t.form.saveChanges}
                            </Button>

                            <VariantButtonLink url={UserProfilePath(session.userName)}>
                                <UserIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                {t.settings.visitYourProfile}
                            </VariantButtonLink>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

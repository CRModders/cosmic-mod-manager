import { zodResolver } from "@hookform/resolvers/zod";
import clientFetch from "@root/utils/client-fetch";
import { FEATURED_LICENSE_OPTIONS } from "@shared/config/license-list";
import { updateProjectLicenseFormSchema } from "@shared/schemas/project/settings/license";
import { ChevronDownIcon, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";
import MarkdownRenderBox from "~/components/layout/md-editor/render-md";
import RefreshPage from "~/components/refresh-page";
import { Button } from "~/components/ui/button";
import { Card, CardTitle } from "~/components/ui/card";
import { LabelledCheckbox } from "~/components/ui/checkbox";
import ComboBox from "~/components/ui/combobox";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";

export default function LicenseSettingsPage() {
    const { t } = useTranslation();
    const ctx = useProjectData();
    const projectData = ctx.projectData;

    const [showCustomLicenseInputFields, setShowCustomLicenseInputFields] = useState(false);
    const [doesNotHaveASpdxId, setDoesNotHaveASpdxId] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm<z.infer<typeof updateProjectLicenseFormSchema>>({
        resolver: zodResolver(updateProjectLicenseFormSchema),
        defaultValues: {
            id: projectData?.licenseId || "",
            name: projectData?.licenseName || "",
            url: projectData?.licenseUrl || "",
        },
    });

    const updateLicense = async (values: z.infer<typeof updateProjectLicenseFormSchema>) => {
        const res = await clientFetch(`/api/project/${projectData?.slug}/license`, {
            method: "PATCH",
            body: JSON.stringify(values),
        });

        const data = await res.json();

        if (!res.ok || !data?.success) {
            return toast.error(data?.message || t.common.error);
        }

        RefreshPage(navigate, location);
        return toast.success(data?.message);
    };

    const currLicenseId = form.watch("id");
    const currLicenseName = form.watch("name");
    const selectedFeaturedLicense = FEATURED_LICENSE_OPTIONS.find((license) => license.licenseId === currLicenseId);
    const isCustomLicense = showCustomLicenseInputFields || ((currLicenseId || currLicenseName) && !selectedFeaturedLicense);

    const formValues = form.getValues();
    const hasFormChanged =
        formValues.id !== (projectData?.licenseId || "") ||
        formValues.name !== (projectData?.licenseName || "") ||
        formValues.url !== (projectData?.licenseUrl || "");

    useEffect(() => {
        if (projectData?.licenseName && !projectData?.licenseId) {
            setDoesNotHaveASpdxId(true);
        }
    }, [projectData]);

    useEffect(() => {
        if (isCustomLicense && !showCustomLicenseInputFields) setShowCustomLicenseInputFields(true);
    }, [isCustomLicense]);

    const projectType = t.navbar[projectData.type[0]];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(updateLicense)} className="w-full">
                <Card className="w-full p-card-surround flex flex-col gap-4">
                    <CardTitle>{t.search.license}</CardTitle>
                    <div className="w-full flex flex-col md:flex-row items-start justify-between gap-x-6 gap-y-2">
                        <MarkdownRenderBox
                            divElem
                            text={`
${t.projectSettings.licenseDesc1(projectType)} \n
${isCustomLicense ? t.projectSettings.licenseDesc2 : ""}
`}
                        />

                        <div className="w-full md:w-[48ch] min-w-[32ch] flex flex-col items-start justify-start">
                            <FormField
                                control={form.control}
                                name="id"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>
                                                <FormMessage />
                                            </FormLabel>

                                            <ComboBox
                                                options={FEATURED_LICENSE_OPTIONS.map((license) => ({
                                                    label: license.name,
                                                    value: license.licenseId,
                                                }))}
                                                value={isCustomLicense ? "custom" : field.value || ""}
                                                setValue={(value: string) => {
                                                    if (value === "custom") {
                                                        setShowCustomLicenseInputFields(true);
                                                        field.onChange("");
                                                    } else {
                                                        field.onChange(value);
                                                        setShowCustomLicenseInputFields(false);
                                                    }
                                                    form.setValue("name", "");
                                                }}
                                            >
                                                <Button variant={"secondary"} className="w-full justify-between overflow-hidden">
                                                    {isCustomLicense
                                                        ? t.projectSettings.custom
                                                        : selectedFeaturedLicense?.name || t.projectSettings.selectLicense}
                                                    <ChevronDownIcon className="w-btn-icon h-btn-icon shrink-0" />
                                                </Button>
                                            </ComboBox>
                                        </FormItem>
                                    );
                                }}
                            />

                            {isCustomLicense ? (
                                <>
                                    <LabelledCheckbox
                                        checkBoxId="license-does-not-have-spdx-id-checkbox"
                                        checked={doesNotHaveASpdxId}
                                        onCheckedChange={(value) => {
                                            setDoesNotHaveASpdxId(value === true);
                                            if (value === true) {
                                                form.setValue("id", "");
                                            } else {
                                                form.setValue("name", "");
                                            }
                                        }}
                                    >
                                        <span className="sm:text-nowrap">{t.projectSettings.doesntHaveSpdxId}</span>
                                    </LabelledCheckbox>
                                    {doesNotHaveASpdxId && (
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        <FormMessage />
                                                    </FormLabel>
                                                    <Input {...field} placeholder={t.projectSettings.licenseName} />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {!doesNotHaveASpdxId && (
                                        <FormField
                                            control={form.control}
                                            name="id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        <FormMessage />
                                                    </FormLabel>
                                                    <Input {...field} placeholder={t.projectSettings.spdxId} />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </>
                            ) : null}

                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <FormMessage />
                                        </FormLabel>
                                        <Input {...field} placeholder={t.projectSettings.licenseUrl} />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-fit" disabled={!hasFormChanged || form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? <LoadingSpinner size="xs" /> : <SaveIcon className="w-btn-icon h-btn-icon" />}
                        {t.form.saveChanges}
                    </Button>
                </Card>
            </form>
        </Form>
    );
}

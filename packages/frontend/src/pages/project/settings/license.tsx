import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { LabelledCheckbox } from "@/components/ui/checkbox";
import ComboBox from "@/components/ui/combobox";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import { projectContext } from "@/src/contexts/curr-project";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { FEATURED_LICENSE_OPTIONS } from "@shared/config/license-list";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import { updateProjectLicenseFormSchema } from "@shared/schemas/project/settings/license";
import { ChevronDownIcon, SaveIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

const LicenseSettingsPage = () => {
    const [showCustomLicenseInputFields, setShowCustomLicenseInputFields] = useState(false);
    const [doesNotHaveASpdxId, setDoesNotHaveASpdxId] = useState(false);
    const { projectData, fetchProjectData } = useContext(projectContext);

    const form = useForm<z.infer<typeof updateProjectLicenseFormSchema>>({
        resolver: zodResolver(updateProjectLicenseFormSchema),
        defaultValues: {
            id: projectData?.licenseId || "",
            name: projectData?.licenseName || "",
            url: projectData?.licenseUrl || "",
        },
    });

    const updateLicense = async (values: z.infer<typeof updateProjectLicenseFormSchema>) => {
        const res = await useFetch(`/api/project/${projectData?.slug}/license`, {
            method: "PATCH",
            body: JSON.stringify(values),
        });

        const data = await res.json();

        if (!res.ok || !data?.success) {
            return toast.error(data?.message || "Error");
        }

        await fetchProjectData();
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

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (isCustomLicense && !showCustomLicenseInputFields) setShowCustomLicenseInputFields(true);
    }, [isCustomLicense]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(updateLicense)} className="w-full">
                <Card className="w-full p-card-surround flex flex-col gap-4">
                    <CardTitle>License</CardTitle>
                    <div className="w-full flex flex-col md:flex-row items-start justify-between gap-x-6 gap-y-2">
                        <p className="flex flex-col gap-1.5 leading-snug text-muted-foreground">
                            <span>
                                It is very important to choose a proper license for your{" "}
                                {CapitalizeAndFormatString(projectData?.type[0])?.toLowerCase()}. You may choose one from our list or
                                provide a custom license. You may also provide a custom URL to your chosen license; otherwise, the license
                                text will be displayed.
                            </span>
                            {isCustomLicense ? (
                                <span>
                                    Enter a valid{" "}
                                    <a href="https://spdx.org/licenses/" className="link_blue">
                                        SPDX license identifier
                                    </a>{" "}
                                    in the marked area. If your license does not have a SPDX identifier (for example, if you created the
                                    license yourself or if the license is Minecraft-specific), simply check the box and enter the name of
                                    the license instead.
                                </span>
                            ) : null}
                        </p>
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
                                                    {isCustomLicense ? "Custom" : selectedFeaturedLicense?.name || "Select license..."}
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
                                        <span className="sm:text-nowrap">License does not have a SPDX identifier</span>
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
                                                    <Input {...field} placeholder="License name" />
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
                                                    <Input {...field} placeholder="SPDX identifier" />
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
                                        <Input {...field} placeholder="License URL (optional)" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-fit" disabled={!hasFormChanged || form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? <LoadingSpinner size="xs" /> : <SaveIcon className="w-btn-icon h-btn-icon" />}
                        Save changes
                    </Button>
                </Card>
            </form>
        </Form>
    );
};

export default LicenseSettingsPage;

import { SaveIcon } from "@/components/icons";
import { ContentWrapperCard } from "@/components/panel-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import useFetch from "@/src/hooks/fetch";
import { Projectcontext } from "@/src/providers/project-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { LicensesList } from "@root/config/project";
import { CapitalizeAndFormatString, isValidUrl } from "@root/lib/utils";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    license: z.string().max(256, { message: "Max license name length exceeded" }).optional(),
    customLicense: z.string().max(256, { message: "Max license name length exceeded" }).optional(),
    licenseUrl: z.string().max(256).optional(),
});

const LicenseSettingsPage = () => {
    const { projectData, fetchProjectData } = useContext(Projectcontext);
    const [loading, setLoading] = useState(false);
    const [isCustomLicense, setIsCustomLicense] = useState(false);
    const [customLicenseHasSpdxId, setCustomLicenseHasSpdxId] = useState(true);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            license: "",
            customLicense: "",
            licenseUrl: "",
        },
    });

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if (loading) return;
        if (values.licenseUrl && !isValidUrl(values.licenseUrl))
            return toast({ title: "Invalid license URL", variant: "destructive" });

        setLoading(true);

        const res = await useFetch(`/api/project/${projectData?.url_slug}/update-license`, {
            method: "POST",
            body: JSON.stringify({
                license: !values.license || values.license === "CUSTOM" ? values.customLicense : values.license,
                licenseUrl: values.licenseUrl,
            }),
        });
        setLoading(false);

        const result = await res.json();

        if (!res.ok) {
            return toast({
                title: result?.message || "Something went wrong",
                variant: "destructive",
            });
        }

        await fetchProjectData();
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (projectData?.id) {
            let isCustomLicense = false;

            for (const item of LicensesList) {
                if (projectData.license === item.id) {
                    isCustomLicense = false;
                    break;
                }
                isCustomLicense = true;
            }

            if (isCustomLicense === true && projectData.license) {
                form.setValue("customLicense", projectData?.license || "");
                form.setValue("license", "CUSTOM");
                setIsCustomLicense(true);
            } else {
                form.setValue("license", projectData?.license || "");
            }
            form.setValue("licenseUrl", projectData?.licenseUrl || "");
        }
    }, [projectData]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="relative">
                <ContentWrapperCard>
                    <h2 className="text-2xl font-semibold">License</h2>
                    <div className="w-full flex flex-col xl:flex-row items-start justify-between gap-4">
                        <p className="text-foreground-muted text-pretty">
                            It is very important to choose a proper license for your{" "}
                            {CapitalizeAndFormatString(projectData?.type[0])?.toLowerCase()}. You may choose one from our list or
                            provide a custom license. You may also provide a custom URL to your chosen license; otherwise, the license
                            text will be displayed.
                        </p>

                        <div className="w-full xl:w-[36rem] flex flex-col items-start justify-center gap-4">
                            <FormField
                                control={form.control}
                                name="license"
                                render={({ field }) => (
                                    <>
                                        <FormItem className="w-full flex flex-col items-center justify-center">
                                            <FormControl>
                                                <Select
                                                    name={field.name}
                                                    disabled={field.disabled}
                                                    value={field.value}
                                                    onValueChange={(e) => {
                                                        field.onChange(e);
                                                        if (e === "CUSTOM") setIsCustomLicense(true);
                                                        else setIsCustomLicense(false);
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Unknown" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {LicensesList.map((license) => {
                                                            return (
                                                                <SelectItem value={license.id} key={license.name}>
                                                                    {license.name}
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    </>
                                )}
                            />

                            {isCustomLicense ? (
                                <div className="w-full flex flex-col items-start justify-start gap-4">
                                    <Label className="flex gap-2 items-center justify-start cursor-pointer">
                                        <Checkbox
                                            checked={customLicenseHasSpdxId}
                                            onCheckedChange={(e) => setCustomLicenseHasSpdxId(e === true)}
                                        />
                                        <span className="text-foreground-muted">License doesn't have a SPDX id</span>
                                    </Label>

                                    <FormField
                                        control={form.control}
                                        name="customLicense"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder={customLicenseHasSpdxId ? "SPDX identifier" : "License name"}
                                                        className="w-full"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ) : null}
                            <FormField
                                control={form.control}
                                name="licenseUrl"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input {...field} placeholder="License URL (optional)" className="w-full" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-end">
                        <Button
                            disabled={
                                projectData?.licenseUrl === form.getValues("licenseUrl") &&
                                ((isCustomLicense && projectData?.license === form.getValues("customLicense")) ||
                                    (!isCustomLicense && projectData?.license === form.getValues("license")))
                            }
                        >
                            <SaveIcon className="w-4 h-4" />
                            Save change
                        </Button>
                    </div>
                </ContentWrapperCard>
                {loading ? <AbsolutePositionedSpinner /> : null}
            </form>
        </Form>
    );
};

export default LicenseSettingsPage;

import { buttonVariants, Button } from "@app/components/ui/button";
import { FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import { InteractiveLabel } from "@app/components/ui/label";
import { cn } from "@app/components/utils";
import { validImgFileExtensions } from "@app/utils/schemas/utils";
import { imageUrl } from "@app/utils/url";
import { ImgWrapper } from "./ui/avatar";
import { useTranslation } from "~/locales/provider";
import { isImageFile } from "@app/utils/schemas/validation";
import { getFileType } from "@app/utils/convertors";
import { toast } from "@app/components/ui/sonner";
import { Trash2Icon, UploadIcon } from "lucide-react";

interface IconPickerProps {
    icon: File | string | undefined;
    fieldName: string;
    onChange: (file: File | undefined) => void;
    fallbackIcon: React.ReactNode;
    originalIcon: string;
    vtId?: string;
}

export default function IconPicker(props: IconPickerProps) {
    const { t } = useTranslation();

    return (
        <FormItem>
            <FormLabel className="font-bold">
                {t.form.icon}
                <FormMessage />
            </FormLabel>
            <div className="flex flex-wrap items-center justify-start gap-4">
                <input
                    hidden
                    className="hidden"
                    id="project-icon-input"
                    accept={validImgFileExtensions.join(", ")}
                    type="file"
                    value={""}
                    name={props.fieldName}
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        if (!isImageFile(await getFileType(file))) {
                            toast.error("Invalid image file type");
                            return;
                        }

                        props.onChange(file);
                    }}
                />

                <ImgWrapper
                    alt={"Icon"}
                    src={(() => {
                        const image = props.icon;
                        if (image instanceof File) return URL.createObjectURL(image);
                        if (!image) return "";

                        return imageUrl(props.originalIcon || "");
                    })()}
                    className="rounded"
                    fallback={props.fallbackIcon}
                    // Only set view transition id if the icon has not changed
                    vtId={!props.icon ? props.vtId : undefined}
                />

                <div className="flex flex-col items-start justify-center gap-2">
                    <InteractiveLabel
                        htmlFor="project-icon-input"
                        className={cn(buttonVariants({ variant: "secondary", size: "default" }), "cursor-pointer")}
                    >
                        <UploadIcon aria-hidden className="w-btn-icon h-btn-icon" />
                        {t.form.uploadIcon}
                    </InteractiveLabel>
                    {props.icon ? (
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => {
                                props.onChange(undefined);
                            }}
                        >
                            <Trash2Icon aria-hidden className="w-btn-icon h-btn-icon" />
                            {t.form.removeIcon}
                        </Button>
                    ) : null}
                </div>
            </div>
        </FormItem>
    );
}

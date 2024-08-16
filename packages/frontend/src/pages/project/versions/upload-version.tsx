import { Projectcontext } from "@/src/contexts/curr-project";
import useFetch from "@/src/hooks/fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import type { newVersionFormSchema } from "@shared/schemas/project";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { toast } from "sonner";
import type { z } from "zod";
import UploadNewVersionForm from "./version-upload-form";

const CreateNewVersionPage = () => {
    const { projectData } = useContext(Projectcontext);

    if (!projectData) return null;

    const handleSubmit = async (data: z.infer<typeof newVersionFormSchema>) => {
        if (!(data.primaryFile instanceof File)) {
            toast.error("Primary file is required");
            return;
        }

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("changelog", data.changelog || "");
        formData.append("releaseChannel", data.releaseChannel);
        formData.append("versionNumber", data.versionNumber);
        formData.append("loaders", JSON.stringify(data.loaders));
        formData.append("gameVersions", JSON.stringify(data.gameVersions));
        formData.append("dependencies", JSON.stringify(data.dependencies || []));
        formData.append("primaryFile", data.primaryFile instanceof File ? data.primaryFile : "");
        for (const additionalFile of data.additionalFiles || []) {
            formData.append("additionalFiles", additionalFile instanceof File ? additionalFile : JSON.stringify(additionalFile));
        }

        const response = await useFetch(`/api/project/${projectData.slug}/version/new`, {
            method: "POST",
            body: formData,
        });
    };

    return (
        <>
            <Helmet>
                <title>
                    {projectData?.name || ""} - Create new version | {SITE_NAME_SHORT}
                </title>
                <meta name="description" content="Dashboard" />
            </Helmet>

            <UploadNewVersionForm handleSubmit={handleSubmit} projectData={projectData} />
        </>
    );
};

export default CreateNewVersionPage;

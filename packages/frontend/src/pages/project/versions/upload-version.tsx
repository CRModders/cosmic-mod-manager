import { getProjectVersionPagePathname } from "@/lib/utils";
import { Projectcontext } from "@/src/contexts/curr-project";
import useFetch from "@/src/hooks/fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import type { newVersionFormSchema } from "@shared/schemas/project";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { z } from "zod";
import UploadNewVersionForm from "./version-upload-form";

const CreateNewVersionPage = () => {
    const { projectData, fetchAllProjectVersions, fetchFeaturedProjectVersions } = useContext(Projectcontext);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    if (!projectData) return null;

    const handleSubmit = async (data: z.infer<typeof newVersionFormSchema>) => {
        if (!(data.primaryFile instanceof File)) {
            toast.error("Primary file is required");
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("changelog", data.changelog || "");
            formData.append("featured", `${data.featured === true}`);
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
            const result = await response.json();

            if (!response.ok || !result?.success) {
                toast.error(result?.message);
                return;
            }

            if (data.featured !== true) {
                await fetchAllProjectVersions();
            } else {
                await Promise.all([fetchAllProjectVersions(), fetchFeaturedProjectVersions()]);
            }
            navigate(getProjectVersionPagePathname(projectData.type[0], projectData.slug, result?.slug));
            return;

        } catch (error) {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>
                    {projectData?.name || ""} - Create new version | {SITE_NAME_SHORT}
                </title>
                <meta name="description" content="Dashboard" />
            </Helmet>

            <UploadNewVersionForm handleSubmit={handleSubmit} projectData={projectData} isLoading={isLoading} setIsLoading={setIsLoading} />
        </>
    );
};

export default CreateNewVersionPage;

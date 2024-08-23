import { projectContext } from "@/src/contexts/curr-project";
import { SITE_NAME_SHORT } from "@shared/config/index";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

const EditVersionPage = () => {
    const { slug: projectSlug, versionSlug } = useParams();
    const { projectData, allProjectVersions } = useContext(projectContext);
    const versionData = allProjectVersions?.filter((version) => {
        if (version.slug === versionSlug) return version;
    })[0];

    if (!versionData?.id) return null;

    return (
        <>
            <Helmet>
                <title>
                    Create version - {projectData?.name || ""} | {SITE_NAME_SHORT}
                </title>
                <meta name="description" content={`Edit ${versionData.title} of ${projectData?.name}`} />
            </Helmet>
        </>
    );
};

export default EditVersionPage;

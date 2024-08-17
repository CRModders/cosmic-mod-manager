import { ContentCardTemplate } from "@/components/layout/panel";
import { Projectcontext } from "@/src/contexts/curr-project";
import { SITE_NAME_SHORT } from "@shared/config";
import { ProjectPermissions } from "@shared/types";
import { InfoIcon } from "lucide-react";
import { Suspense, lazy, useContext } from "react";
import { Helmet } from "react-helmet";

const UploadGalleryImageForm = lazy(() => import("@/src/pages/project/gallery/upload-image"));

const ProjectGallery = () => {
    const { projectData, currUsersMembership } = useContext(Projectcontext);

    return (
        <>
            <Helmet>
                <title>
                    {projectData?.name || ""} - Gallery | {SITE_NAME_SHORT}
                </title>
                <meta name="description" content="Dashboard" />
            </Helmet>

            <div className="w-full flex items-start justify-start gap-panel-cards">
                <ContentCardTemplate className="px-4 py-3 flex flex-row flex-wrap items-center justify-start gap-x-4 gap-y-2" cardClassname="p-0">

                    {currUsersMembership?.id && currUsersMembership.permissions.includes(ProjectPermissions.EDIT_DETAILS) ?
                        <Suspense>
                            <UploadGalleryImageForm />
                        </Suspense> : null
                    }
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <InfoIcon className="h-btn-icon w-btn-icon" />
                        Upload a new gallery image
                    </div>
                </ContentCardTemplate>
            </div>
        </>
    );
};

export default ProjectGallery;

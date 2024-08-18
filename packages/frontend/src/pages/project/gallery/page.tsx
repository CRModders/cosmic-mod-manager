import { ContentCardTemplate } from "@/components/layout/panel";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn, formatDate, imageUrl } from "@/lib/utils";
import { Projectcontext } from "@/src/contexts/curr-project";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { SITE_NAME_SHORT } from "@shared/config";
import { ProjectPermissions } from "@shared/types";
import type { GalleryItem } from "@shared/types/api";
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon, Edit2Icon, ExternalLinkIcon, InfoIcon, Trash2Icon, XIcon } from "lucide-react";
import { Suspense, lazy, useContext } from "react";
import { Helmet } from "react-helmet";

const UploadGalleryImageForm = lazy(() => import("@/src/pages/project/gallery/upload-image"));

const ProjectGallery = () => {
    const { projectData, currUsersMembership } = useContext(Projectcontext);

    if (!projectData) return null;
    return (
        <>
            <Helmet>
                <title>
                    {projectData?.name || ""} - Gallery | {SITE_NAME_SHORT}
                </title>
                <meta name="description" content="Dashboard" />
            </Helmet>

            <div className="w-full flex flex-col items-start justify-start gap-panel-cards">
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

                {
                    projectData.gallery?.length ? (
                        <div className="w-full grid gap-panel-cards grid-cols-3">
                            {
                                projectData.gallery.map((galleryItem) => (
                                    <GalleryItemCard galleryItem={galleryItem} key={galleryItem.id} />
                                ))
                            }
                        </div>
                    ) : null
                }
            </div>
        </>
    );
};

export default ProjectGallery;


const GalleryItemCard = ({ galleryItem }: { galleryItem: GalleryItem }) => {
    return (
        <div className="flex flex-col items-start justify-start bg-card-background rounded-lg p-2">
            <div className="flex items-center justify-center aspect-video bg-[hsla(var(--background-dark))] rounded-lg overflow-hidden">
                <ImageDialog galleryItem={galleryItem}>
                    <img src={imageUrl(galleryItem.image)} alt={galleryItem.name} className="w-full h-full object-contain cursor-pointer hover:brightness-75 transition-all duration-300" />
                </ImageDialog>
            </div>
            <div className="p-2 pb-1 flex flex-col items-start justify-start gap-0.5">
                <span className="text-lg font-bold">{galleryItem.name}</span>
                <span className="text-muted-foreground leading-tight">{galleryItem.description}</span>

                <p className="flex gap-1.5 items-center justify-center text-muted-foreground mt-3">
                    <CalendarIcon className="w-btn-icon h-btn-icon" />
                    {formatDate(new Date(galleryItem.dateCreated), "${month} ${day}, ${year}")}
                </p>

                <div className="w-full flex items-center justify-start gap-2 mt-1">
                    <Button variant={"secondary"} size={"sm"}>
                        <Edit2Icon className="w-btn-icon h-btn-icon" />
                        Edit
                    </Button>

                    <Button variant={"secondary"} size={"sm"}>
                        <Trash2Icon className="w-btn-icon h-btn-icon" />
                        Remove
                    </Button>
                </div>
            </div>
        </div>
    )
};

const ImageDialog = ({ children, galleryItem }: { children: React.ReactNode; galleryItem: GalleryItem }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="bg-transparent border-none max-w-full w-fit p-0">
                <div className="w-fit h-[calc(100dvh_-_2rem)] flex flex-col items-center justify-center relative">
                    <img src={imageUrl(galleryItem.image)} alt={galleryItem.name} className="rounded-lg max-w-[calc(100vw_-_6rem)] max-h-[calc(100vh_-_4rem)] object-contain" />

                    <div className="max-w-full flex flex-col items-center justify-center group p-16 pt-32 pb-4 rounded w-fit absolute left-[50%] bottom-[0.5rem] translate-x-[-50%]">
                        <div className="max-w-full w-max flex flex-col items-center justify-center transition-all duration-300 opacity-0 scale-75 translate-y-[1rem] group-hover:translate-y-[-1rem] group-hover:scale-100 group-hover:opacity-100 text-[hsla(var(--foreground-dark))]">
                            <span className="drop-shadow-[1px_1px_10px_hsla(var(--background-dark))] font-bold text-lg">{galleryItem.name}</span>
                            <span className="drop-shadow-[1px_1px_10px_hsla(var(--background-dark))]">{galleryItem.description}</span>
                        </div>

                        <div className="flex items-center justify-start gap-2 p-2.5 px-3 rounded-xl bg-card-background opacity-45 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 origin-bottom">
                            <DialogClose asChild>
                                <Button className="rounded-full" size={"icon"} variant={"secondary"}>
                                    <XIcon className="w-btn-icon-md h-btn-icon-md" />
                                </Button>
                            </DialogClose>

                            <a href={imageUrl(galleryItem.image)} aria-label={galleryItem.name}
                                className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "rounded-full")}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <VisuallyHidden>{galleryItem.name}</VisuallyHidden>
                                <ExternalLinkIcon className="w-btn-icon h-btn-icon" />
                            </a>

                            <Button variant={"secondary"} size={"icon"} className="rounded-full">
                                <ArrowLeftIcon className="w-btn-icon h-btn-icon" />
                            </Button>

                            <Button variant={"secondary"} size={"icon"} className="rounded-full">
                                <ArrowRightIcon className="w-btn-icon h-btn-icon" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
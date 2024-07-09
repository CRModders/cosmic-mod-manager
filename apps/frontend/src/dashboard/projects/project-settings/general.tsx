import { SaveIcon, TrashIcon, UploadIcon } from "@/components/icons";
import { ContentWrapperCard } from "@/components/panel-layout";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input, InputWithInlineLabel } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast, useToast } from "@/components/ui/use-toast";
import useFetch from "@/src/hooks/fetch";
import { Projectcontext } from "@/src/providers/project-context";
import { Cross2Icon, CubeIcon } from "@radix-ui/react-icons";
import { maxProjectSummaryLength } from "@root/config";
import { CapitalizeAndFormatString, GetProjectVisibility, createURLSafeSlug } from "@root/lib/utils";
import { ProjectVisibility } from "@root/types";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const GeneralProjectSettings = () => {
    const { projectData, fetchProjectData } = useContext(Projectcontext);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Form states
    const [projectName, setProjectName] = useState("");
    const [projectUrl, setProjectUrl] = useState("");
    const [projectSummary, setProjectSummary] = useState("");
    const [visibility, setProjectVisibility] = useState<ProjectVisibility | "">("");

    const saveProjectData = async () => {
        setLoading(true);

        const response = await useFetch(`/api/project/${projectData?.url_slug}/update`, {
            method: "POST",
            body: JSON.stringify({
                name: projectName,
                url_slug: projectUrl,
                summary: projectSummary,
                visibility: visibility,
            }),
        });
        setLoading(false);
        const result = await response.json();
        toast({
            title: result?.message,
        });

        if (!response.ok) {
            return;
        }

        await fetchProjectData(result?.data?.url_slug);
    };

    useEffect(() => {
        if (projectData?.id) {
            setProjectName(projectData?.name);
            setProjectUrl(projectData?.url_slug);
            setProjectSummary(projectData?.summary);
            setProjectVisibility(GetProjectVisibility(projectData?.visibility));
        }
    }, [projectData]);

    return (
        <div className="w-full flex flex-col relative items-center justify-center gap-card-gap">
            {projectData === undefined ? null : (
                <>
                    <Helmet>
                        <title>Settings - {projectData?.name} | CRMM</title>
                        <meta name="description" content="Your projects on crmm." />
                    </Helmet>

                    <ContentWrapperCard className="w-full flex flex-col items-start justify-center gap-6">
                        <h1 className="w-full flex items-center justify-start font-semibold text-2xl text-foreground">
                            Project information
                        </h1>

                        <div className="flex flex-col">
                            <p className="text-xl font-semibold text-foreground p-1">Icon</p>
                            <div className="flex gap-4">
                                <span className="p-2 flex items-center justify-center rounded-lg bg-background-shallow">
                                    <CubeIcon className="w-20 h-20 text-foreground-muted" />
                                </span>
                                <div className="flex flex-col items-start justify-center gap-2">
                                    <Button variant={"secondary"} className="gap-2">
                                        <UploadIcon className="w-4 h-4" />
                                        Upload icon
                                    </Button>
                                    <Button variant={"secondary"} className="gap-2">
                                        <TrashIcon className="w-4 h-4" />
                                        Remove icon
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex flex-col items-start justify-center gap-1">
                            <Label htmlFor="settings-project-name-input" className="font-semibold text-lg">
                                Name
                            </Label>
                            <Input
                                type="text"
                                className="w-full md:w-[32ch] text-base"
                                id="settings-project-name-input"
                                value={projectName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setProjectName(e.target.value);
                                }}
                            />
                        </div>

                        <div className="w-full md:w-fit flex flex-col items-start justify-start gap-1">
                            <Label htmlFor="settings-project-url-input" className="font-semibold text-lg">
                                URL
                            </Label>

                            <InputWithInlineLabel
                                label={`/${createURLSafeSlug(projectData?.type[0] || "").value}/`}
                                wrapperClassName="place-items-baseline"
                                id="settings-project-url-input"
                                value={projectUrl}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setProjectUrl(createURLSafeSlug(e.target.value).value);
                                }}
                            />
                        </div>
                        <div className="w-full flex flex-col items-start justify-center gap-1">
                            <Label htmlFor="settings-summary-textarea" className="font-semibold text-lg">
                                Summary
                            </Label>
                            <Textarea
                                placeholder="Enter project summary..."
                                cols={8}
                                maxLength={maxProjectSummaryLength}
                                className="resize-none w-full md:w-[48ch] h-28 text-base dark:text-foreground-muted"
                                id="settings-summary-textarea"
                                value={projectSummary}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    setProjectSummary(e.target.value);
                                }}
                            />
                        </div>

                        <div className="w-full flex flex-col gap-1">
                            <p className="font-semibold text-lg">Visibility</p>
                            <div className="w-full flex flex-wrap lg:flex-nowrap gap-6 items-center justify-between">
                                <div>
                                    <p className=" text-foreground-muted">
                                        Listed and archived projects are visible in search. Unlisted projects are
                                        published, but not visible in search or on user profiles. Private projects are
                                        only accessible by members of the project.
                                    </p>
                                </div>

                                <Select
                                    value={visibility}
                                    onValueChange={(value: string) => {
                                        setProjectVisibility(value as ProjectVisibility);
                                    }}
                                >
                                    <SelectTrigger className="w-fit max-w-full min-w-[24ch]">
                                        <SelectValue placeholder="Visibility" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ProjectVisibility.PRIVATE}>
                                            {CapitalizeAndFormatString(ProjectVisibility.PRIVATE)}
                                        </SelectItem>
                                        <SelectItem value={ProjectVisibility.PUBLIC}>
                                            {CapitalizeAndFormatString(ProjectVisibility.PUBLIC)}
                                        </SelectItem>
                                        <SelectItem value={ProjectVisibility.ARCHIVED}>
                                            {CapitalizeAndFormatString(ProjectVisibility.ARCHIVED)}
                                        </SelectItem>
                                        <SelectItem value={ProjectVisibility.UNLISTED}>
                                            {CapitalizeAndFormatString(ProjectVisibility.UNLISTED)}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="w-full flex items-center justify-end mt-4 mb-2">
                            <Button
                                className="gap-2"
                                disabled={
                                    projectName === projectData?.name &&
                                    projectUrl === projectData?.url_slug &&
                                    projectSummary === projectData?.summary &&
                                    visibility === GetProjectVisibility(projectData?.visibility)
                                }
                                onClick={saveProjectData}
                            >
                                <SaveIcon size="1rem" />
                                Save changes
                            </Button>
                        </div>
                    </ContentWrapperCard>
                    <DeleteProjectCard
                        projectName={projectData?.name || ""}
                        projectUrlSlug={projectData?.url_slug || ""}
                    />
                </>
            )}
            {loading ? <AbsolutePositionedSpinner /> : null}
        </div>
    );
};

export default GeneralProjectSettings;

const DeleteProjectCard = ({ projectName, projectUrlSlug }: { projectName: string; projectUrlSlug: string }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [inputValue, setinputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const deleteProject = async () => {
        setLoading(true);

        const response = await useFetch(`/api/project/${projectUrlSlug}/delete`);
        setLoading(false);
        const result = await response.json();
        if (!response.ok) {
            return toast({ title: result?.message, variant: "destructive" });
        }
        toast({ title: result?.message });
        navigate("/dashboard/projects");
    };

    return (
        <ContentWrapperCard className="items-start gap-2">
            <h2 className="font-semibold text-foreground text-2xl">Delete project</h2>
            <p className="text-foreground-muted">
                Removes your project from our servers and search. Clicking on this will delete your project, so be extra
                careful!
            </p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <div className="w-full flex items-center justify-end">
                    <DialogTrigger asChild>
                        <Button className="gap-2" variant={"destructive"}>
                            <TrashIcon size="1.15rem" />
                            Delete project
                        </Button>
                    </DialogTrigger>
                </div>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this project?</DialogTitle>
                    </DialogHeader>
                    <p className="text-foreground-muted">
                        If you proceed, all versions and any attached data will be removed from our servers. This may
                        break other projects, so be careful.
                    </p>

                    <div className="w-full flex flex-col items-start justify-center gap-1">
                        <p className="text-foreground font-semibold">
                            To verify, type{" "}
                            <span className="font-medium italic text-foreground-muted">{projectName}</span> below:
                        </p>
                        <Input
                            type="text"
                            value={inputValue}
                            onChange={(e) => {
                                setinputValue(e.target.value);
                            }}
                        />
                    </div>
                    <DialogFooter className="w-full flex flex-row flex-wrap-reverse items-center justify-end gap-2">
                        <DialogClose asChild>
                            <Button className="gap-2" variant={"secondary"}>
                                <Cross2Icon />
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button
                            onClick={deleteProject}
                            variant={"destructive"}
                            className="gap-2"
                            disabled={projectName !== inputValue || loading}
                        >
                            <TrashIcon size="1.15rem" />
                            Delete project
                        </Button>
                    </DialogFooter>

                    {loading && <AbsolutePositionedSpinner />}
                </DialogContent>
            </Dialog>
        </ContentWrapperCard>
    );
};

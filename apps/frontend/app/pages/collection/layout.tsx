import { CubeIcon, fallbackProjectIcon, fallbackUserIcon } from "@app/components/icons";
import type { Collection, CollectionOwner, ProjectListItem } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { Outlet, useLocation } from "react-router";
import { PageHeader } from "~/components/page-header";
import { useNavigate, VariantButtonLink } from "~/components/ui/link";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { CalendarIcon, ClipboardCopyIcon, EarthIcon, EditIcon, HeartIcon, LockIcon, Trash2Icon } from "lucide-react";
import { Prefetch } from "@app/components/ui/link";
import { CollectionPagePath, UserProfilePath } from "~/utils/urls";
import SecondaryNav from "../project/secondary-nav";
import { getProjectTypesFromNames } from "@app/utils/convertors";
import { ContentCardTemplate } from "@app/components/misc/panel";
import { ProjectMember } from "../project/layout";
import "./style.css";
import { TimePassedSince } from "~/components/ui/date";
import { CollectionVisibility } from "@app/utils/types";
import { MicrodataItemProps } from "@app/components/microdata";
import { Button } from "@app/components/ui/button";
import { PopoverClose } from "@app/components/ui/popover";
import { useState } from "react";
import EditCollection from "./edit-collection";
import ConfirmDialog from "~/components/confirm-dialog";
import clientFetch from "~/utils/client-fetch";
import { toast } from "@app/components/ui/sonner";
import RefreshPage from "@app/components/misc/refresh-page";

interface Props {
    collection: Collection;
    projects: ProjectListItem[];
    owner: CollectionOwner;
}

export default function CollectionPageLayout(props: Props) {
    const { t } = useTranslation();
    const session = useSession();
    const navigate = useNavigate();

    const [editMode, setEditMode] = useState(false);
    const [markedProjects, setMarkedProjects] = useState<string[]>([]);

    function addMarkedProject(projectId: string) {
        setMarkedProjects((prev) => [...prev, projectId]);
    }

    function removeMarkedProject(projectId: string) {
        setMarkedProjects((prev) => prev.filter((id) => id !== projectId));
    }

    const ProjectsCount = t.count.projects(props.collection.projects.length);
    const aggregatedProjectTypes = new Set<string>();
    for (const project of props.projects || []) {
        for (const type of project.type) {
            aggregatedProjectTypes.add(type);
        }
    }
    const projectTypesList = Array.from(aggregatedProjectTypes);

    async function DeleteCollection() {
        const res = await clientFetch(`/api/collections/${props.collection.id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            toast.error("Error deleting collection");
            return;
        }

        const data = await res.json();
        toast.message(data.message);
        RefreshPage(navigate, "/dashboard/collections");
    }

    const isFollowsCollection = props.collection.id === "follows";
    const icon =
        props.collection.id === "follows" ? (
            <HeartIcon aria-hidden className="w-[65%] h-[65%] text-accent-background fill-current" />
        ) : (
            imageUrl(props.collection.icon)
        );

    return (
        <main className="collection-page-layout pb-12 gap-panel-cards">
            <PageHeader
                vtId={props.collection.id}
                icon={icon}
                title={props.collection.name}
                fallbackIcon={fallbackProjectIcon}
                description={props.collection.description || ""}
                titleBadge={
                    <div className="ms-2 flex items-center justify-center gap-1.5 font-bold text-extra-muted-foreground">
                        <CubeIcon aria-hidden className="w-btn-icon h-btn-icon" />
                        {t.dashboard.collection}
                    </div>
                }
                actionBtns={
                    props.collection.userId === session?.id && !isFollowsCollection ? (
                        <EditCollection collection={props.collection} />
                    ) : null
                }
                threeDotMenu={
                    <>
                        <PopoverClose asChild>
                            <Button
                                className="w-full"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(props.collection.id);
                                }}
                            >
                                <ClipboardCopyIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                {t.common.copyId}
                                <span itemProp={MicrodataItemProps.itemid} className="sr-only">
                                    {props.collection.id}
                                </span>
                            </Button>
                        </PopoverClose>

                        {!isFollowsCollection ? (
                            <ConfirmDialog
                                title={t.collection.deleteCollection}
                                description={t.collection.sureToDeleteCollection}
                                confirmText={t.form.delete}
                                confirmBtnVariant="destructive"
                                onConfirm={DeleteCollection}
                            >
                                <Button variant="ghost-destructive">
                                    <Trash2Icon aria-hidden className="w-btn-icon h-btn-icon" />
                                    {t.form.delete}
                                </Button>
                            </ConfirmDialog>
                        ) : null}
                    </>
                }
            >
                <div className="flex items-center gap-2 border-0 border-e border-card-background dark:border-shallow-background pe-4">
                    <CubeIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                    <span className="font-semibold">{ProjectsCount.join(" ")}</span>
                </div>

                <div className="flex items-center gap-2 border-0 border-e border-card-background dark:border-shallow-background pe-4">
                    {props.collection.visibility === CollectionVisibility.PRIVATE ? (
                        <LockIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                    ) : (
                        <EarthIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                    )}

                    <span className="font-semibold">
                        {
                            t.projectSettings[
                                props.collection.visibility === CollectionVisibility.PRIVATE ? "private" : "public"
                            ]
                        }
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <CalendarIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                    <span className="font-semibold">
                        {t.settings.created(TimePassedSince({ date: props.collection.dateCreated }))}
                    </span>
                </div>
            </PageHeader>

            <div
                className="h-fit grid grid-cols-1 gap-panel-cards"
                style={{
                    gridArea: "content",
                }}
            >
                {projectTypesList?.length > 1 && props.projects.length > 1 ? (
                    <SecondaryNav
                        className="bg-card-background rounded-lg px-3 py-2"
                        urlBase={CollectionPagePath(props.collection.id)}
                        links={[
                            { label: t.common.all, href: "" },
                            ...getProjectTypesFromNames(projectTypesList).map((type) => ({
                                label: t.navbar[`${type}s`],
                                href: `/${type}s`,
                            })),
                        ]}
                    />
                ) : null}

                {/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
                <div className="w-full flex flex-col gap-panel-cards" role="list">
                    <Outlet
                        context={
                            {
                                ...props,
                                editMode: true,
                                markedProjects,
                                addMarkedProject,
                                removeMarkedProject,
                            } satisfies CollectionOutletData
                        }
                    />
                </div>
            </div>

            <PageSidebar owner={props.owner} />
        </main>
    );
}

export interface CollectionOutletData extends Props {
    editMode: boolean;
    markedProjects: string[];
    addMarkedProject: (projectId: string) => void;
    removeMarkedProject: (projectId: string) => void;
}

function PageSidebar(props: { owner: CollectionOwner }) {
    const { t } = useTranslation();

    return (
        <div style={{ gridArea: "sidebar" }} className="w-full flex flex-col gap-panel-cards">
            <ContentCardTemplate title={t.collection.curatedBy} titleClassName="text-lg">
                <ProjectMember
                    vtId={props.owner.id}
                    isOwner={false}
                    userName={props.owner.userName}
                    roleName={t.projectSettings.owner}
                    avatarImageUrl={imageUrl(props.owner.avatar)}
                    url={UserProfilePath(props.owner.userName)}
                    fallbackIcon={fallbackUserIcon}
                />
            </ContentCardTemplate>
        </div>
    );
}

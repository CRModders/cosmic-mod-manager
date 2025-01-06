import { fallbackProjectIcon, fallbackUserIcon } from "@app/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import { cn } from "@app/components/utils";
import type { ProjectType } from "@app/utils/types";
import type { ModerationProjectItem } from "@app/utils/types/api/moderation";
import { imageUrl } from "@app/utils/url";
import { AlertTriangleIcon, EyeIcon, TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { ImgWrapper } from "~/components/ui/avatar";
import { TimePassedSince } from "~/components/ui/date";
import Link, { VariantButtonLink } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import { OrgPagePath, ProjectPagePath, UserProfilePath } from "~/utils/urls";

const TIME_24H = 86400000;
const TIME_48H = TIME_24H * 2;

export default function ReviewProjects({ projects }: { projects: ModerationProjectItem[] }) {
    const { t } = useTranslation();
    const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
    const [showing, setShowing] = useState<"all" | ProjectType>("all");

    const _tempSet = new Set<string>();
    for (const project of projects) {
        for (const type of project.type) {
            _tempSet.add(type);
        }
    }
    const filterableTypes = Array.from(_tempSet);
    let filteredProjects: ModerationProjectItem[] = [];
    if (showing === "all") filteredProjects = projects;
    else {
        for (const project of projects) {
            if (project.type.includes(showing)) filteredProjects.push(project);
        }
    }

    const projectsOver24Hours = filteredProjects.filter((project) => {
        const _timePassed = TimePassed_ms(project.dateQueued);
        if (_timePassed >= TIME_24H && _timePassed < TIME_48H) return true;
        return false;
    });
    const projectsOver48Hours = filteredProjects.filter((project) => TimePassed_ms(project.dateQueued) >= TIME_48H);

    // TODO: Add filters

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.moderation.review}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground grid grid-cols-1">
                <span>{t.moderation.projectsInQueue(projects.length)}</span>
                {projectsOver24Hours.length > 0 ? (
                    <span className="text-warning-foreground font-medium">
                        <TriangleAlertIcon aria-hidden className="inline w-3.5 h-3.5" />{" "}
                        {t.moderation.projectsQueuedFor(projectsOver24Hours.length, 24)}
                    </span>
                ) : null}
                {projectsOver48Hours.length > 0 ? (
                    <span className="font-bold text-danger-foreground">
                        <TriangleAlertIcon aria-hidden className="inline w-4 h-4" />{" "}
                        {t.moderation.projectsQueuedFor(projectsOver48Hours.length, 48)}
                    </span>
                ) : null}

                <div className="grid grid-cols-1 gap-panel-cards mt-3">
                    {filteredProjects.map((project) => (
                        <ModerationItem key={project.id} project={project} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function ModerationItem({ project }: { project: ModerationProjectItem }) {
    const { t } = useTranslation();
    const type = project.type[0] as ProjectType;
    const isOver48Hrs = TimePassed_ms(project.dateQueued) > TIME_48H;
    const isOver24Hrs = TimePassed_ms(project.dateQueued) > TIME_24H && !isOver48Hrs;

    return (
        <div className="p-card-surround bg-background rounded-lg flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <div className="flex flex-col items-between justify-center flex-wrap gap-y-4">
                <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1">
                    <Link
                        to={ProjectPagePath(project.type[0], project.slug)}
                        className="flex items-center justify-start gap-x-2 hover:brightness-110"
                    >
                        <ImgWrapper
                            src={imageUrl(project.icon)}
                            alt={project.name}
                            vtId={project.id}
                            className="w-10 h-10"
                            fallback={fallbackProjectIcon}
                        />
                        <span className="leading-none font-bold">{project.name}</span>
                    </Link>
                    by
                    <Link
                        to={project.author.isOrg ? OrgPagePath(project.author.slug) : UserProfilePath(project.author.slug)}
                        className="hover:brightness-110 flex items-center justify-start gap-x-1.5"
                    >
                        <ImgWrapper
                            src={imageUrl(project.author.icon)}
                            alt={project.author.name}
                            className="w-5 h-5 rounded-full"
                            fallback={fallbackUserIcon}
                        />
                        <span className="underline">{project.author.name}</span>
                    </Link>
                    <span>is requesting to be {project.requestedStatus}</span>
                </div>

                <span
                    className={cn(
                        "flex items-center justify-start gap-x-1.5",
                        isOver24Hrs && "text-warning-foreground",
                        isOver48Hrs && "text-danger-foreground",
                    )}
                >
                    {isOver24Hrs || (isOver48Hrs && <AlertTriangleIcon aria-hidden className="h-4 w-4 inline" />)}
                    {t.moderation.submitted(TimePassedSince({ date: project.dateQueued }))}
                </span>
            </div>

            <VariantButtonLink url={ProjectPagePath(project.type[0], project.slug)} size="sm">
                <EyeIcon aria-hidden className="w-btn-icon h-btn-icon" /> {t.moderation.viewProject}
            </VariantButtonLink>
        </div>
    );
}

function TimePassed_ms(date: string | Date) {
    try {
        return Date.now() - new Date(date).getTime();
    } catch (error) {
        return 0;
    }
}

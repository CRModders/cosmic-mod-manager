import MarkdownRenderBox from "~/components/md-renderer";
import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";

export default function ProjectPage() {
    const { t } = useTranslation();
    const ctx = useProjectData();

    if (!ctx.projectData.description) {
        return <span className="text-muted-foreground italic text-center">{t.project.noProjectDesc}</span>;
    }

    return (
        <div className="bg-card-background p-card-surround rounded-lg">
            <MarkdownRenderBox text={ctx.projectData.description || ""} />
        </div>
    );
}

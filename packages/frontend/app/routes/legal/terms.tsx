import MarkdownRenderBox from "~/components/layout/md-editor/render-md";

export default function TermsOfUse() {
    return (
        <MarkdownRenderBox
            className="bg-card-background p-6 pt-0 rounded-lg"
            text={`
# Terms of Use
            `}
        />
    );
}

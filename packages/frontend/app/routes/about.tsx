import MarkdownRenderBox from "~/components/layout/md-editor/render-md";

export default function AboutPage() {
    return (
        <MarkdownRenderBox
            className="max-w-[72ch] mx-auto bg-card-background p-6 pt-0 rounded-lg"
            text={`
# About

*Nothing here :P*
            `}
        />
    );
}

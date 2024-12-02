import MarkdownRenderBox from "~/components/layout/md-editor/render-md";

export default function AboutPage() {
    return (
        <main className="w-full grid grid-cols-1">
            <MarkdownRenderBox
                className="max-w-[72ch] bright-heading mx-auto bg-card-background p-6 pt-0 rounded-lg"
                text={`
# About

*Nothing here :P*
            `}
            />
        </main>
    );
}

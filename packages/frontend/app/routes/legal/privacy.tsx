import MarkdownRenderBox from "~/components/layout/md-editor/render-md";

export default function PrivacyPolicy() {
    return (
        <MarkdownRenderBox
            className="bg-card-background p-6 pt-0 rounded-lg"
            text={`
# Privacy Policy
            `}
        />
    );
}

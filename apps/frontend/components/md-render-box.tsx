import "@/components/highlightjs.css";
import renderHighlightedString from "./render-md";

const MarkdownRenderBox = ({ text }: { text: string }) => {
    return (
        <div
            className="w-full markdown-body"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{ __html: renderHighlightedString(text) }}
        />
    );
};

export default MarkdownRenderBox;

import { MarkdownRenderBox as DefaultRenderer } from "@app/components/md-editor/render-md";
import type React from "react";
import { FormatUrl_WithHintLocale } from "~/utils/urls";

type Props = Omit<React.ComponentProps<typeof DefaultRenderer>, "urlModifier">;

export default function MarkdownRenderBox(props: Props) {
    return <DefaultRenderer {...props} urlModifier={FormatUrl_WithHintLocale} />;
}

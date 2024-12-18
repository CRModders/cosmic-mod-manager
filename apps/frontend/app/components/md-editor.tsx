import DefaultMarkdownEditor from "@app/components/md-editor/md-editor";
import { useTranslation } from "~/locales/provider";

type Props = Omit<React.ComponentProps<typeof DefaultMarkdownEditor>, "t">;

export default function MarkdownEditor(props: Props) {
    const { t } = useTranslation();

    const obj = { ...t.editor, url: t.form.url, cancel: t.form.cancel };

    return <DefaultMarkdownEditor {...props} t={obj} />;
}

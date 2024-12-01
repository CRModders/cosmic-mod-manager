import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { SITE_NAME_SHORT } from "@shared/config";
import MarkdownRenderBox from "~/components/layout/md-editor/render-md";
import { descriptionSuffix } from "./layout";

const title = "Copyright Policy";

export default function CopyrightPolicy() {
    return (
        <MarkdownRenderBox
            className="bg-card-background p-6 pt-0 rounded-lg"
            text={`
# ${title}
            `}
        />
    );
}

export function meta() {
    return MetaTags({
        title: title,
        description: `The ${title} of ${SITE_NAME_SHORT}, ${descriptionSuffix}.`,
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: `${Config.FRONTEND_URL}/legal/copyright`,
        suffixTitle: true,
    });
}

import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { SITE_NAME_SHORT } from "@shared/config";
import MarkdownRenderBox from "~/components/layout/md-editor/render-md";
import { descriptionSuffix } from "./layout";

const title = "Privacy Policy";

export default function PrivacyPolicy() {
    return (
        <MarkdownRenderBox
            className="bg-card-background bright-heading p-6 pt-0 rounded-lg"
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
        url: `${Config.FRONTEND_URL}/legal/privacy`,
        suffixTitle: true,
    });
}

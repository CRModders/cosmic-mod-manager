import { SITE_NAME_SHORT } from "@app/utils/constants";
import MarkdownRenderBox from "~/components/md-renderer";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { PageUrl } from "~/utils/urls";
import { descriptionSuffix } from "./layout";

const title = "Copyright Policy";

export default function CopyrightPolicy() {
    const { t } = useTranslation();

    return (
        <MarkdownRenderBox
            className="bg-card-background bright-heading p-6 rounded-lg"
            text={t.legal.copyrightPolicy({
                title: t.legal.copyrightPolicyTitle,
                adminEmail: Config.ADMIN_EMAIL
            })}
        />
    );
}

export function meta() {
    return MetaTags({
        title: title,
        description: `The ${title} of ${SITE_NAME_SHORT}, ${descriptionSuffix}.`,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}${PageUrl("legal/copyright")}`,
        suffixTitle: true,
    });
}

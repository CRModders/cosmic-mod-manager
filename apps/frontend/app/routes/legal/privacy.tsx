import { SITE_NAME_SHORT } from "@app/utils/constants";
import MarkdownRenderBox from "~/components/md-renderer";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { PageUrl } from "~/utils/urls";
import { descriptionSuffix } from "./layout";

const title = "Privacy Policy";

export default function PrivacyPolicy() {
    const { t } = useTranslation();

    return (
        <MarkdownRenderBox
            className="bg-card-background bright-heading p-6 rounded-lg"
            text={t.legal.privacyPolicy({
                title: t.legal.privacyPolicyTitle
                supportEmail: Config.SUPPORT_EMAIL
            })}
        />
    );
}

export function meta() {
    return MetaTags({
        title: title,
        description: `The ${title} of ${SITE_NAME_SHORT}, ${descriptionSuffix}.`,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}${PageUrl("legal/privacy")}`,
        suffixTitle: true,
    });
}

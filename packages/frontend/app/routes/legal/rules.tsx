import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { PageUrl } from "@root/utils/urls";
import { SITE_NAME_SHORT } from "@shared/config";
import MarkdownRenderBox from "~/components/layout/md-editor/render-md";
import { useTranslation } from "~/locales/provider";
import { descriptionSuffix } from "./layout";

const title = "Content Rules";

export default function ContentRules() {
    const { t } = useTranslation();

    return (
        <MarkdownRenderBox
            className="bg-card-background bright-heading p-6 pt-0 rounded-lg"
            text={t.legal.rules({
                title: t.legal.rulesTitle,
                supportEmail: "support@crmm.tech",
                privacyPageUrl: PageUrl("legal/privacy"),
                termsPageUrl: PageUrl("legal/terms"),
            })}
        />
    );
}

export function meta() {
    return MetaTags({
        title: title,
        description: `The ${title} of ${SITE_NAME_SHORT}, ${descriptionSuffix}.`,
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: `${Config.FRONTEND_URL}${PageUrl("legal/rules")}`,
        suffixTitle: true,
    });
}

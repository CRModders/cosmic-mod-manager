import MarkdownRenderBox from "~/components/md-renderer";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { FormatUrl_WithHintLocale } from "~/utils/urls";
import { descriptionSuffix } from "./layout";

const title = "Content Rules";

export default function ContentRules() {
    const { t } = useTranslation();

    return (
        <MarkdownRenderBox
            className="bg-card-background bright-heading p-6 rounded-lg"
            text={t.legal.contentRules({
                title: t.legal.rulesTitle,
                supportEmail: "support@crmm.tech",
                privacyPageUrl: FormatUrl_WithHintLocale("legal/privacy"),
                termsPageUrl: FormatUrl_WithHintLocale("legal/terms"),
                siteName_Short: Config.SITE_NAME_SHORT,
            })}
        />
    );
}

export function meta() {
    return MetaTags({
        title: title,
        description: `The ${title} of ${Config.SITE_NAME_SHORT}, ${descriptionSuffix}.`,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}${FormatUrl_WithHintLocale("legal/rules")}`,
        suffixTitle: true,
    });
}

import { SITE_NAME_LONG, SITE_NAME_SHORT } from "@app/utils/constants";
import { useProjectType } from "~/hooks/project";
import { SearchResultsPage } from "~/pages/search/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { PageUrl } from "~/utils/urls";

export default SearchResultsPage;

export function meta() {
    const type = `${useProjectType()}s`;

    return MetaTags({
        title: `Search ${type}`,
        description: `Search and download your favorite cosmic reach ${type} with ease here on ${SITE_NAME_SHORT} (${SITE_NAME_LONG}).`,
        url: `${Config.FRONTEND_URL}${PageUrl(type)}`,
        image: Config.SITE_ICON,
        suffixTitle: true,
    });
}

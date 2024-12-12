import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { PageUrl } from "@root/utils/urls";
import { SITE_NAME_LONG, SITE_NAME_SHORT } from "@shared/config";
import { useProjectType } from "~/hooks/project";
import { SearchResultsPage } from "~/pages/search/page";

export default SearchResultsPage;

export function meta() {
    const type = `${useProjectType()}s`;

    return MetaTags({
        title: `Search ${type}`,
        description: `Search and download your favorite cosmic reach ${type} with ease here on ${SITE_NAME_SHORT} (${SITE_NAME_LONG}).`,
        url: `${Config.FRONTEND_URL}${PageUrl(type)}`,
        image: `${Config.FRONTEND_URL}/icon.png`,
        suffixTitle: true,
    });
}
